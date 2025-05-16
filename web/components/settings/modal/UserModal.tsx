import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { listRole } from "@/api/role";
import { postUser, putUser } from "@/api/user";
import { toast } from "sonner";
import { UserInfo } from "@/lib/types/user"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface UserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userInfo?: UserInfo;
    onSuccess?: () => void;
}

export const UserModal = ({
    open,
    onOpenChange,
    userInfo,
    onSuccess,
}: UserModalProps) => {
    const isEdit = !!userInfo;
    const [loading, setLoading] = useState(false);

    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [roleId, setRoleId] = useState("");
    const [roles, setRoles] = useState<{ id: number; roleName: string }[]>([]);

    // 错误提示
    const [usernameError, setUsernameError] = useState("");
    const [nicknameError, setNicknameError] = useState("");
    const [roleError, setRoleError] = useState("");
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        if (open) {
            // 获取角色列表
            listRole().then((res) => {
                if (res.data?.roles) {
                    setRoles(res.data.roles || []);
                }
            });
            if (isEdit) {
                setUsername(userInfo.username || "");
                setNickname(userInfo.nickname || "");
                setRoleId(String(userInfo.roleId || ""));
            } else {
                setUsername("");
                setNickname("");
                setRoleId("");
            }
            setUsernameError("");
            setNicknameError("");
            setRoleError("");
            setSubmitError("");
        }
    }, [open, userInfo, isEdit]);

    const validate = () => {
        let valid = true;
        setUsernameError("");
        setNicknameError("");
        setRoleError("");
        setSubmitError("");
        if (!username.trim()) {
            setUsernameError("用户名不能为空");
            valid = false;
        }
        if (!nickname.trim()) {
            setNicknameError("昵称不能为空");
            valid = false;
        }
        if (!roleId) {
            setRoleError("请选择角色");
            valid = false;
        }
        return valid;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            let res;
            if (isEdit) {
                res = await putUser({ id: userInfo.id, username, nickname, roleId: Number(roleId) });
            } else {
                res = await postUser({ username, nickname, roleId: Number(roleId) });
            }
            if (res.code === 0) {
                toast.success(isEdit ? "编辑成功" : "添加成功");
                onOpenChange(false);
                onSuccess?.();
            } else {
                setSubmitError(res.msg || "操作失败");
            }
        } catch (e) {
            console.error(e);
            setSubmitError("请求失败，请重试");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md w-full rounded-xl shadow-2xl p-8 bg-popover dark:bg-popover">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">{isEdit ? "编辑用户" : "添加用户"}</DialogTitle>
                    <DialogDescription className="text-gray-500 mb-4">
                        {isEdit ? "修改用户信息，完成后点击保存。" : "填写新用户信息，完成后点击保存。"}
                    </DialogDescription>
                </DialogHeader>
                <form
                    className="space-y-4"
                    onSubmit={e => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <div className="grid gap-4 py-2">
                        {/* 用户名 */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">用户名</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="请输入用户名"
                                className="col-span-3"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                disabled={isEdit}
                            />
                        </div>
                        {usernameError && <div className="col-start-2 col-span-3 text-xs text-red-500">{usernameError}</div>}

                        {/* 昵称 */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nickname" className="text-right">昵称</Label>
                            <Input
                                id="nickname"
                                type="text"
                                placeholder="请输入昵称"
                                className="col-span-3"
                                value={nickname}
                                onChange={e => setNickname(e.target.value)}
                            />
                        </div>
                        {nicknameError && <div className="col-start-2 col-span-3 text-xs text-red-500">{nicknameError}</div>}

                        {/* 角色 */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">角色</Label>
                            <Select
                                value={roleId}
                                onValueChange={setRoleId}
                            >
                                <SelectTrigger className="col-span-3 w-full">
                                    <SelectValue placeholder="请选择角色" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map(r => (
                                        <SelectItem key={r.id} value={String(r.id)}>
                                            {r.roleName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {roleError && <div className="col-start-2 col-span-3 text-xs text-red-500">{roleError}</div>}

                        {/* 错误提示 */}
                        {submitError && <div className="col-span-4 text-xs text-red-500 text-center">{submitError}</div>}
                    </div>
                    {/* 按钮组 */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={loading}>
                            取消
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "提交中..." : "确定"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};