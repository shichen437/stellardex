'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Meteors } from "@/components/magicui/meteors";
import { useUserStore } from '@/lib/store/user';
import { toast } from "sonner";
import { usePolyglot } from "@/providers/PolyglotProvider";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const { t } = usePolyglot();

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)username=([^;]*)/);
    if (match && match[1]) {
      setUsername(decodeURIComponent(match[1]));
    }
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      router.push('/');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('用户名和密码不能为空');
      return;
    }

    try {
      await login(username, password);
      router.push('/');
      toast.success(t("toast.welcome"));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || '登录失败，请稍后重试');
    }
  };

  return (
    <div className="min-h-screen h-screen w-screen flex items-center justify-center bg-white dark:bg-black/30 relative overflow-hidden">
      <Meteors number={25} minDuration={2.5} maxDuration={12} />
      <Card className="relative w-[350px] overflow-hidden">
        <CardHeader>
          <CardTitle>登录</CardTitle>
          <CardDescription>
            请输入您的账号密码进行登录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="loginForm" onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="grid w-full">
          <Button type="submit" form="loginForm">登录</Button>
        </CardFooter>
        <BorderBeam duration={8} size={100} colorFrom="#3b82f6" colorTo="#9333ea" />
      </Card>
    </div>
  );
}