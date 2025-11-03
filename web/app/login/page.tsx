"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuroraText } from "@/components/magicui/aurora-text";
import { Meteors } from "@/components/magicui/meteors";
import { useUserStore } from "@/lib/store/user";
import { toast } from "sonner";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { getDefaultLang } from "@/api/settings";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ShineBorder } from "@/components/magicui/shine-border";
import { useIsMobile } from "@/hooks/useMobile";

interface LoginFormProps {
  handleLogin: (e: React.FormEvent) => Promise<void>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  t: (key: string) => string;
}

function LoginForm({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
  error,
  t,
}: LoginFormProps) {
  return (
    <form className="p-6 md:p-8 w-full max-w-md" onSubmit={handleLogin}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t("login.title")}</h1>
          <p className="text-muted-foreground text-balance">
            {t("login.login_tip")}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="username">{t("login.username")}</FieldLabel>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t("login.placeholder.username")}
            autoComplete="username"
            inputMode="email"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">{t("login.password")}</FieldLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("login.placeholder.password")}
            autoComplete="current-password"
          />
        </Field>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Field>
          <Button type="submit" className="w-full">
            {t("login.title")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const { t, setLanguage } = usePolyglot();
  const isMobile = useIsMobile();

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

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light");

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    if (mediaQuery.matches) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

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

  const loginFormProps = {
    handleLogin,
    username,
    setUsername,
    password,
    setPassword,
    error,
    t,
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white dark:bg-black/30 relative overflow-hidden px-4">
      <Meteors number={20} minDuration={2.5} maxDuration={12} />

      {isMobile ? (
        <div className="w-full max-w-md -translate-y-4">
          <Card className="overflow-hidden p-0 w-full">
            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            <CardContent className="p-0">
              <LoginForm {...loginFormProps} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 -translate-y-6">
          <Card
            className="overflow-hidden p-0"
            style={{ width: 900, height: 560 }}
          >
            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            <CardContent className="grid p-0 md:grid-cols-2 place-items-center h-full">
              <div className="bg-muted relative hidden md:flex flex-col items-center justify-center p-6 md:p-8 h-full w-full">
                <Image
                  src="/logo/logo.png"
                  alt="Logo"
                  className="w-16 h-16 mb-2"
                  width={100}
                  height={100}
                />
                <AuroraText className="p-2 text-xl font-bold md:text-2xl lg:text-3xl">
                  StellarDex
                </AuroraText>
                <FieldDescription>{t("login.project_desc")}</FieldDescription>
              </div>
              <LoginForm {...loginFormProps} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}