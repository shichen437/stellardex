import { Github, Mail } from "lucide-react";
import { SparklesText } from "@/components/magicui/sparkles-text";

export function AboutTab() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-12 py-8">
      {/* 项目名称 */}
      <div className="text-center">
        <SparklesText sparklesCount={10}>
          <h1 className="text-4xl font-bold">Stellardex</h1>
        </SparklesText>
      </div>

      {/* 版本号 */}
      <div className="text-center">
        <span className="text-lg text-gray-600 dark:text-gray-400">
          version 0.0.1
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
          <span>查看源码</span>
        </a>

        <a
          href="shichen437@gmail.com"
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          <Mail className="w-5 h-5" />
          <span>联系作者</span>
        </a>
      </div>
    </div>
  );
}
