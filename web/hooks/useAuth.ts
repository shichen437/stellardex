import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/store/auth";
import { getIsLoggedIn } from "@/lib/store/auth";

export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    if (!getIsLoggedIn()) {
      router.push("/login");
    }
    const handleUnauthorized = (event: CustomEvent) => {
      if (event.detail?.code === 401) {
        router.push("/login");
      }
    };
    window.addEventListener(
      "unauthorized",
      handleUnauthorized as EventListener
    );
    return () => {
      window.removeEventListener(
        "unauthorized",
        handleUnauthorized as EventListener
      );
    };
  }, [router]);

  return { getToken };
}
