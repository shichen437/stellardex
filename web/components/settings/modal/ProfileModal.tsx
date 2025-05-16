import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { updateProfile } from "@/api/profile";
import { toast } from "sonner";

export interface ProfileModalProps {
  userInfo: {
    nickname: string;
    email: string;
    sex: number;
    mobile: string;
  } | null;
}

export const ProfileModal = ({ userInfo }: ProfileModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");

  // 新增错误提示 state
  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [submitError, setSubmitError] = useState("");

  React.useEffect(() => {
    if (userInfo) {
      setNickname(userInfo.nickname || "");
      setEmail(userInfo.email || "");
      setGender(userInfo.sex !== undefined ? String(userInfo.sex) : "");
      setMobile(userInfo.mobile || "");
      setNicknameError("");
      setEmailError("");
      setGenderError("");
      setMobileError("");
      setSubmitError("");
    }
  }, [userInfo, open]);

  const validate = () => {
    let valid = true;
    setNicknameError("");
    setEmailError("");
    setGenderError("");
    setMobileError("");
    setSubmitError("");

    if (!nickname.trim()) {
      setNicknameError("昵称不能为空");
      valid = false;
    }
    if (!email.trim()) {
      setEmailError("邮箱不能为空");
      valid = false;
    } else if (!/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email)) {
      setEmailError("邮箱格式不正确");
      valid = false;
    }
    if (gender !== "0" && gender !== "1") {
      setGenderError("请选择性别");
      valid = false;
    }
    if (!mobile.trim()) {
      setMobileError("手机号不能为空");
      valid = false;
    } else if (!/^\d{11}$/.test(mobile)) {
      setMobileError("手机号格式不正确");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {

      const res = await updateProfile({
        nickname,
        email,
        sex: Number(gender),
        mobile,
      });
      if (res.code === 0) {
        toast.success("修改成功");
        setOpen(false);
        setNickname("");
        setEmail("");
        setGender("");
        setMobile("");
      } else {
        setSubmitError(res.msg);
      }
    } catch (e) {
      console.error(e);
      setSubmitError("提交失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          修改资料
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs w-full rounded-xl shadow-2xl p-8 bg-popover dark:bg-popover">
        <DialogHeader>
          <DialogTitle>修改资料</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Label className="block text-sm font-medium mb-1">昵称</Label>
          <Input
            type="text"
            placeholder="请输入昵称"
            className="w-full mb-1"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
          />
          {nicknameError && (
            <div className="text-xs text-red-500 mb-2">{nicknameError}</div>
          )}
          <Label className="block text-sm font-medium mb-1">邮箱</Label>
          <Input
            type="email"
            placeholder="请输入邮箱"
            className="w-full mb-1"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {emailError && (
            <div className="text-xs text-red-500 mb-2">{emailError}</div>
          )}
          <Label className="block text-sm font-medium mb-1">性别</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="w-full mb-1">
              <SelectValue placeholder="请选择性别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">男</SelectItem>
              <SelectItem value="0">女</SelectItem>
            </SelectContent>
          </Select>
          {genderError && (
            <div className="text-xs text-red-500 mb-2">{genderError}</div>
          )}
          <Label className="block text-sm font-medium mb-1">手机号</Label>
          <Input
            type="number"
            placeholder="请输入手机号"
            className="w-full mb-1"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
          />
          {mobileError && (
            <div className="text-xs text-red-500 mb-2">{mobileError}</div>
          )}
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "提交中..." : "确定"}
          </Button>
        </DialogFooter>
        {submitError && (
          <div className="text-xs text-red-500 text-center mt-2">{submitError}</div>
        )}
      </DialogContent>
    </Dialog>
  );
};
