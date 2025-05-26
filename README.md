<p align="center">
  <img src="resource/assets/logo.png" alt="StellarDex Logo" width="180"/>
</p>

<h1 align="center">StellarDex</h1>
<div align="center">
  简体中文 ｜ <a href="./README_EN.md"> English </a>
</div>

---

## ✨ 项目简介

StellarDex 是一个基于 Golang + Next 实现的导航页应用。

## 🚀 功能特性

- 多模式支持
- 多风格展示
- 中英文支持
- 多用户登录
- 自定义站点信息
- 浅色/深色模式切换
- 响应式设计，适配多终端

## 📸 预览
<div align="center">
  <img src="resource/assets/screenshots/navigation-grid.png" alt="导航-网格" width="45%">&nbsp;&nbsp;
  <img src="resource/assets/screenshots/navigation-row.png" alt="导航-列表" width="45%">
</div>

<div align="center" style="margin-top: 20px">
  <img src="resource/assets/screenshots/homepage-dark.png" alt="主页-深色" width="45%">&nbsp;&nbsp;
  <img src="resource/assets/screenshots/starry-dark.png" alt="星空-深色" width="45%">
</div>

## 📦 Docker部署

1. 复制示例文件到本地并重命名:
```bash
    cp docker-compose.yaml.example docker-compose.yaml
```
2. 修改配置文件:
```bash
    vim docker-compose.yaml
```
3. 环境变量参数:
    <table>
    <tr align="center">
      <th>变量名</th>
      <th>变量描述</th>
      <th>默认值</th>
      <th>是否必填</th>
    </tr>
    <tr align="center">
      <td>PROJECT_SM4KEY</td>
      <td>sm4加密 key</td>
      <td>abcdefghijklmnopqrstuvwxyz123456 (32位字符串)</td>
      <td>否</td>
    </tr>
    <tr align="center">
      <td>PROJECT_LANG</td>
      <td>系统语言</td>
      <td>zh-CN</td>
      <td>否</td>
    </tr>
    <tr align="center">
      <td>TZ</td>
      <td>时区</td>
      <td>Asia/Shanghai</td>
      <td>否</td>
    </tr>
    </table>
4. 启动服务:
```bash
    docker-compose up -d
```
5. 访问 URL_ADDRESS:{YOUR_PORT} 查看应用。
6. 初始账号密码：admin/stellardex

## 🛠️ 技术栈
- 后端：Goframe / sqlite
- 前端：React / Next.js
- 样式：Tailwind CSS / shadcnUI / MagicUI / Three.js

## 🎨 SVG 图标网站推荐
- [Lucide](https://lucide.dev/icons)
- [iconfont](https://www.iconfont.cn)

## 🤝 贡献
欢迎提交 issue 或 PR，参与项目共建！

## 📄 开源协议
MIT

## 🔗 感谢
- [Goframe](https://github.com/gogf/gf)
- [golang-migrate](https://github.com/golang-migrate/migrate)
- [Next.js](https://github.com/vercel/next.js)
- [Three.js](https://github.com/mrdoob/three.js)
- [shadcn UI](https://github.com/shadcn-ui/ui)
- [Magic UI](https://github.com/magicuidesign/magicui)