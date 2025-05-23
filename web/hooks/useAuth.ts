import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getIsLoggedIn } from "@/lib/store/auth";

export function useAuth() {
  const router = useRouter();
  useEffect(() => {
    if (!getIsLoggedIn()) {
      router.push("/login");
    }
  }, [router]);

  return {};
}
