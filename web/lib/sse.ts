/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "@/lib/store/auth";
import { useUserStore } from "@/lib/store/user";

type SSEConfig = {
  channel: string;
  onMessage: (data: any) => void;
  onError?: (error: any) => void;
  onOpen?: () => void;
  maxRetries?: number;
  retryInterval?: number;
};

class SSEClient {
  private eventSource: EventSource | null = null;
  private config: SSEConfig;
  private baseURL: string;
  private retryCount: number = 0;
  private retryTimer: NodeJS.Timeout | null = null;
  private isReconnecting: boolean = false;

  constructor(config: SSEConfig) {
    this.config = {
      maxRetries: 20,
      retryInterval: 3000,
      ...config,
    };
    this.baseURL = process.env.NEXT_PUBLIC_API_PREFIX || "";
  }

  private getEventSourceURL(): string {
    const token = getToken();
    const params = new URLSearchParams({
      channel: this.config.channel,
    });
    if (token) {
      params.append("token", token);
    }
    return `${this.baseURL}/sse?${params.toString()}`;
  }

  private scheduleReconnect(): void {
    if (
      this.isReconnecting ||
      this.retryCount >= (this.config.maxRetries || 5)
    ) {
      this.config.onError?.(new Error("SSE: reconnect failed"));
      return;
    }

    this.isReconnecting = true;
    this.retryTimer = setTimeout(() => {
      this.retryCount++;
      console.log(`SSE: try ${this.retryCount} times reconnect...`);
      this.connect();
      this.isReconnecting = false;
    }, this.config.retryInterval);
  }

  public connect(): void {
    if (this.eventSource) {
      this.disconnect();
    }

    this.eventSource = new EventSource(this.getEventSourceURL());

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.config.onMessage(data);
      } catch (error) {
        this.config.onError?.(error);
      }
    };

    this.eventSource.onopen = () => {
      this.config.onOpen?.();
    };

    this.eventSource.onerror = (error) => {
      if (error instanceof Event) {
        const target = error.target as EventSource;
        if (target.readyState === EventSource.CLOSED) {
          if (
            (target as any).status === 401 ||
            (target as any).status === -401
          ) {
            useUserStore.getState().logout();
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            return;
          }
          this.scheduleReconnect();
        }
      }
      this.config.onError?.(error);
    };
  }

  public disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    this.retryCount = 0;
    this.isReconnecting = false;
  }
}

export function createSSEConnection(config: SSEConfig): SSEClient {
  const client = new SSEClient(config);
  client.connect();
  return client;
}
