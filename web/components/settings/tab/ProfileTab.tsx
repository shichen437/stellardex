import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PasswordModal } from "@/components/settings/modal/PasswordModal";
import { ProfileModal } from "@/components/settings/modal/ProfileModal";
import { UserInfo } from "@/lib/types/user";
import { useUserStore } from "@/lib/store/user";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { toast } from "sonner";
import { updateAvatar } from "@/api/profile";
import { Input } from "@/components/ui/input";

export function ProfileTab() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const getUserInfo = useUserStore((state) => state.getUserInfo);
  const { t } = usePolyglot();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await getUserInfo();
        setUserInfo(info);
      } catch (error) {
        console.error("获取用户信息失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [getUserInfo]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            <Skeleton className="w-20 h-20 rounded-full" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      toast.error(t("profile.error.uploadLimit"));
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await updateAvatar(formData);
      if (response.code === 0) {
        toast.success(t("toast.uploadSuccess"));
        // 更新用户信息
        const updatedUserInfo = await getUserInfo(true);
        setUserInfo(updatedUserInfo);
      } else {
        toast.error(t("toast.uploadError"));
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(t("toast.uploadError"));
    }
  };

  if (!userInfo) {
    return <div className="items-center">{t("users.noData")}</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto p-6 bg-popover dark:bg-popover rounded-xl shadow-md space-y-8 relative">
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8 space-y-4 md:space-y-0">
        <Avatar className="w-24 h-24 shadow-lg border-2 border-grey-100 dark:border-grey-900 relative group">
          {userInfo.avatar ? (
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_API_PREFIX}${userInfo.avatar}`}
              className="w-full h-full"
            />
          ) : (
            <AvatarFallback className="text-3xl font-bold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-800 filter grayscale">
              {userInfo.username.slice(0, 2)}
            </AvatarFallback>
          )}
          <label className="absolute inset-0 cursor-pointer">
            <Input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleAvatarUpload}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="text-white" />
            </div>
          </label>
        </Avatar>
        <div className="flex-1 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-1">{userInfo.nickname}</h3>
              <Badge className="text-base font-medium">
                {userInfo.roleId === 1
                  ? t("userField.role_admin")
                  : userInfo.roleId === 2
                  ? t("userField.role_user")
                  : userInfo.roleName}
              </Badge>
            </div>
            <div className="mt-2 md:mt-0">
              <Badge
                variant={userInfo.status === 1 ? "secondary" : "destructive"}
                className={
                  userInfo.status === 1
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }
              >
                {userInfo.status === 1
                  ? t("userField.status_active")
                  : t("userField.status_inactive")}
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-4">
            <div className="bg-gray-50 dark:bg-black/20 rounded-lg px-4 py-3 shadow-sm flex-1 min-w-[180px] flex items-center">
              <span className="text-gray-500 dark:text-gray-400 text-xs mr-2 min-w-[48px] text-left">
                {t("userField.username")}
              </span>
              <span className="font-semibold text-base text-gray-900 dark:text-white mx-auto">
                {userInfo.username}
              </span>
            </div>
            <div className="bg-gray-50 dark:bg-black/20 rounded-lg px-4 py-3 shadow-sm flex-1 min-w-[180px] flex items-center">
              <span className="text-gray-500 dark:text-gray-400 text-xs mr-2 min-w-[48px] text-left">
                {t("userField.sex")}
              </span>
              <span className="font-semibold text-base text-gray-900 dark:text-white mx-auto">
                {userInfo.sex === 0
                  ? t("userField.sex_famale")
                  : t("userField.sex_male")}
              </span>
            </div>
            {userInfo.mobile && (
              <div className="bg-gray-50 dark:bg-black/20 rounded-lg px-4 py-3 shadow-sm flex-1 min-w-[180px] flex items-center">
                <span className="text-gray-500 dark:text-gray-400 text-xs mr-2 min-w-[48px] text-left">
                  {t("userField.phone")}
                </span>
                <span className="font-semibold text-base text-gray-900 dark:text-white mx-auto">
                  {userInfo.mobile}
                </span>
              </div>
            )}
            {userInfo.email && (
              <div className="bg-gray-50 dark:bg-black/20 rounded-lg px-4 py-3 shadow-sm flex-1 min-w-[180px] flex items-center">
                <span className="text-gray-500 dark:text-gray-400 text-xs mr-2 min-w-[48px] text-left">
                  {t("userField.email")}
                </span>
                <span className="font-semibold text-base text-gray-900 dark:text-white mx-auto truncate max-w-[160px] overflow-hidden whitespace-nowrap">
                  {userInfo.email}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <ProfileModal
          userInfo={{
            nickname: userInfo.nickname,
            email: userInfo.email,
            sex: userInfo.sex,
            mobile: userInfo.mobile,
          }}
        />
        <PasswordModal />
      </div>
    </Card>
  );
}
