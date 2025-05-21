import { Github, Mail } from "lucide-react";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { usePolyglot } from "@/providers/PolyglotProvider";
import Image from "next/image";

export function AboutTab() {
  const { t } = usePolyglot();
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 py-8">
      <div className="w-32 h-32 relative">
        <Image
          src="/logo/logo.png"
          alt="Stellardex Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      {/* 项目名称 */}
      <div className="text-center">
        <SparklesText sparklesCount={10}>
          <h1 className="text-4xl font-bold">Stellardex</h1>
        </SparklesText>
      </div>

      {/* 版本号 */}
      <div className="text-center">
        <span className="text-lg text-gray-600 dark:text-gray-400">
          {t("about.version")} {process.env.NEXT_PUBLIC_VERSION}
        </span>
      </div>

      {/* 链接区域 */}
      <div className="flex flex-col items-center space-y-2">
        <a
          href="https://github.com/shichen437/stellardex"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          <Github className="w-5 h-5" />
          <span>{t("about.viewCode")}</span>
        </a>

        <a
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          <Mail className="w-5 h-5" />
          <span>{t("about.concact")}</span>
        </a>
      </div>
    </div>
  );
}
