/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "@/lib/store/auth";

const isRelogin = { show: false };

const serviceConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_PREFIX,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
};

type RequestConfig = {
  method: string;
  url: string;
  params?: Record<string, any>;
  headers?: Record<string, any>;
  body?: string | FormData;
};

async function requestInterceptor(
  config: RequestConfig
): Promise<RequestConfig> {
  const isToken = config.headers?.isToken !== false;
  if (isToken && getToken()) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${getToken()}`,
    };
  }

  if (config.method.toLowerCase() === "get" && config.params) {
    config.url = `${config.url}?${new URLSearchParams(config.params)}`;
    delete config.params;
  }

  return config;
}

async function responseInterceptor(response: Response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.code === 401) {
    if (!isRelogin.show) {
      isRelogin.show = true;
      window.dispatchEvent(new CustomEvent("unauthorized", { detail: data }));
    }
    throw new Error("登录已过期，请重新登录。");
  }

  return data;
}

function errorHandler(error: Error) {
  let message = error.message;

  if (message.includes("Failed to fetch")) {
    message = "后端接口连接异常";
  } else if (message.includes("timeout")) {
    message = "系统接口请求超时";
  } else if (message.includes("HTTP error")) {
    message = `系统接口${message.split(": ")[1]}异常`;
  }

  return Promise.reject(error);
}

export const request = async function (config: {
  url: string;
  method: string;
  headers?: Record<string, any>;
  data?: Record<string, any>;
  params?: Record<string, any>;
}) {
  try {
    const requestConfig: RequestConfig = {
      method: config.method.toUpperCase(),
      url: config.url,
      headers: {},
    };

    if (!(config.data instanceof FormData)) {
      requestConfig.headers = {
        ...serviceConfig.headers,
        ...config.headers,
      };
    } else {
      requestConfig.headers = {
        ...config.headers,
      };
    }

    if (config.data) {
      if (config.data instanceof FormData) {
        requestConfig.body = config.data;
      } else {
        requestConfig.body = JSON.stringify(config.data);
      }
    }

    if (config.params) {
      requestConfig.params = config.params;
    }

    const interceptedConfig = await requestInterceptor(requestConfig);
    const response = await fetch(
      `${serviceConfig.baseURL}${interceptedConfig.url}`,
      interceptedConfig
    );
    return responseInterceptor(response);
  } catch (error) {
    return errorHandler(error as Error);
  }
};
