"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuroraText } from "@/components/magicui/aurora-text";
import { ShineBorder } from "@/components/magicui/shine-border";
import { Meteors } from "@/components/magicui/meteors";
import { useUserStore } from "@/lib/store/user";
import { toast } from "sonner";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { getDefaultLang } from "@/api/settings";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const { t, setLanguage } = usePolyglot();
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "Stellardex";
    }
    getDefaultLang().then((res) => {
      if (res?.code === 0 && res?.data?.lang) {
        setLanguage(res.data.lang);
      }
      setLoading(false);
    });
    const match = document.cookie.match(/(?:^|;\s*)username=([^;]*)/);
    if (match && match[1]) {
      setUsername(decodeURIComponent(match[1]));
    }
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (loading) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username) {
      setError(t("login.error.username"));
      return;
    }
    if (!password) {
      setError(t("login.error.password"));
      return;
    }

    try {
      await login(username, password);
      router.push("/");
      toast.success(t("toast.welcome"));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || t("login.error.failed"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black/30 relative overflow-hidden">
      <Meteors number={20} minDuration={2.5} maxDuration={12} />
      <div className="flex flex-col items-center gap-4 -translate-y-14">
        {" "}
        {/* 这个div整体在屏幕正中间 */}
        <div className="flex flex-col items-center">
          <Image
            src="/logo/logo.png"
            alt="Logo"
            className="w-20 h-20 mb-2"
            width={100}
            height={100}
          />
          <AuroraText className="text-2xl font-bold md:text-3xl lg:text-4xl">
            StellarDex
          </AuroraText>
        </div>
        <Card className="relative w-[350px] overflow-hidden">
          <CardHeader className="text-xl">
            <CardTitle>{t("login.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="loginForm" onSubmit={handleLogin}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">{t("login.username")}</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t("login.placeholder.username")}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">{t("login.password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("login.placeholder.password")}
                  />
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
              </div>
            </form>
          </CardContent>
          <CardFooter className="grid w-full">
            <Button type="submit" form="loginForm">
              {t("login.title")}
            </Button>
          </CardFooter>
          <ShineBorder
            duration={16}
            shineColor={["#FF0080", "#7928CA", "#0070F3", "#38bdf8"]}
          />
        </Card>
      </div>
    </div>
  );
}
