import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { AuroraText } from "@/components/magicui/aurora-text";

export function SupportTab() {
  const { t } = usePolyglot();
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-bold">
          <AuroraText>{t("support.title")}</AuroraText>
        </h2>
        <p className="text-muted-foreground max-w-md">{t("support.message")}</p>
      </div>

      <div className="flex flex-row gap-6">
        <Card className="w-[300px]">
          <CardHeader>
            <CardTitle className="text-center">{t("support.wechat")}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Image
              src="/support/wechat-qrcode.png"
              alt="微信收款码"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </CardContent>
        </Card>

        <Card className="w-[300px]">
          <CardHeader>
            <CardTitle className="text-center">{t("support.alipay")}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Image
              src="/support/alipay-qrcode.png"
              alt="支付宝收款码"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
