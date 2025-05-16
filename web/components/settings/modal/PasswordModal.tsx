import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updatePwd } from "@/api/profile";
import React, { useState } from "react";
import { toast } from "sonner";

export const PasswordModal = () => {
  const [open, setOpen] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!oldPwd || !newPwd || !confirmPwd) {
      setError("NPE");
      return;
    }
    if (newPwd.length < 6 || newPwd.length > 20) {
      setError("PLEN");
      return;
    }
    if (oldPwd === newPwd) {
      setError("OSN");
      return;
    }
    if (newPwd !== confirmPwd) {
      setError("TPNS");
      return;
    }
    setLoading(true);
    try {
      const res = await updatePwd(oldPwd, newPwd);
      if (res.code === 0) {
        toast.success("修改成功");
        setOpen(false);
        setOldPwd("");
        setNewPwd("");
        setConfirmPwd("");
      } else {
        setError(res.msg);
      }
    } catch (e) {
      console.error(e);
      setError("请求失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            修改密码
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-xs w-full rounded-xl shadow-2xl p-8 bg-popover dark:bg-popover">
          <DialogHeader>
            <DialogTitle>修改密码</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Label className="block text-sm font-medium mb-2">旧密码</Label>
            <Input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-1"
              value={oldPwd}
              onChange={(e) => setOldPwd(e.target.value)}
              disabled={loading}
            />
            {error === "NPE" && !oldPwd && (
              <div className="text-red-500 text-xs mb-2">请输入旧密码</div>
            )}
            <Label className="block text-sm font-medium mb-2">新密码</Label>
            <Input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-1"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              disabled={loading}
            />
            {error === "NPE" && !newPwd && (
              <div className="text-red-500 text-xs mb-2">请输入新密码</div>
            )}
            {error === "PLEN" && (
              <div className="text-red-500 text-xs mb-2">新密码长度需为6-20位字符</div>
            )}
            {error === "OSN" && (
              <div className="text-red-500 text-xs mb-2">新密码不能与旧密码相同</div>
            )}
            <Label className="block text-sm font-medium mb-2">确认密码</Label>
            <Input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-1"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              disabled={loading}
            />
            {error === "NPE" && !confirmPwd && (
              <div className="text-red-500 text-xs mb-2">请再次输入新密码</div>
            )}
            {error === "TPNS" && (
              <div className="text-red-500 text-xs mb-2">
                新密码与确认密码不一致
              </div>
            )}
            {error !== "NPE" && error !== "TPNS" &&
              error && <div className="text-red-500 text-xs mb-2">{error}</div>}
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button onClick={handleSubmit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
