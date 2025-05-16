
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SupportTab() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-bold">支持我们</h2>
        <p className="text-muted-foreground max-w-md">
          感谢您的支持！扫描下方二维码即可通过微信或支付宝进行捐赠
        </p>
      </div>

      <div className="flex flex-row gap-6">
        <Card className="w-[300px]">
          <CardHeader>
            <CardTitle className="text-center">微信</CardTitle>
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
            <CardTitle className="text-center">支付宝</CardTitle>
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
