<p align="center">
  <img src="resource/assets/logo.png" alt="StellarDex Logo" width="180"/>
</p>

<h1 align="center">StellarDex</h1>
<div align="center">
  <a href="./README.md">简体中文</a> ｜ English
</div>

---

## ✨ Project Introduction

StellarDex is a navigation page application implemented with Golang + Next.js.

## 🚀 Features

- Multiple display modes
- Multiple style themes
- Chinese/English language support
- Multi-user login
- Customizable site information
- Light/Dark mode toggle
- Responsive design for multiple devices

## 📸 Preview
<div align="center">
  <img src="resource/assets/screenshots/navigation-grid.png" alt="navigation-grid" width="45%">&nbsp;&nbsp;
  <img src="resource/assets/screenshots/navigation-row.png" alt="navigation-row" width="45%">
</div>

<div align="center" style="margin-top: 20px">
  <img src="resource/assets/screenshots/homepage-dark.png" alt="homepage-dark" width="45%">&nbsp;&nbsp;
  <img src="resource/assets/screenshots/starry-dark.png" alt="starry-dark" width="45%">
</div>

## 📦 Docker Deployment

1. Copy example file and rename:
```bash
    cp docker-compose.yaml.example docker-compose.yaml
```
2. Modify configuration:
```bash
    vim docker-compose.yaml
```
3. Environment variables:
    <table>
    <tr align="center">
      <th>Variable</th>
      <th>Description</th>
      <th>Default</th>
      <th>Required</th>
    </tr>
    <tr align="center">
      <td>PROJECT_SM4KEY</td>
      <td>SM4 encryption key</td>
      <td>abcdefghijklmnopqrstuvwxyz123456 (32 chars)</td>
      <td>No</td>
    </tr>
    <tr align="center">
      <td>PROJECT_LANG</td>
      <td>System language</td>
      <td>zh-CN</td>
      <td>No</td>
    </tr>
    <tr align="center">
      <td>TZ</td>
      <td>Timezone</td>
      <td>Asia/Shanghai</td>
      <td>No</td>
    </tr>
    </table>
4. Start services:
```bash
    docker-compose up -d
```
5. Visit URL_ADDRESS:{YOUR_PORT} to view the application.
6. Init account: admin/stellardex

## 🛠️ Tech Stack
- Backend: Goframe / sqlite
- Frontend: React / Next.js
- Styling: Tailwind CSS / shadcnUI / MagicUI / Three.js

## 🎨 SVG Icon Resources
- [Lucide](https://lucide.dev/icons)
- [iconfont](https://www.iconfont.cn)

## 🤝 Contributions
Welcome to submit issues or PRs!

## 📄 License
MIT

## 🔗 Acknowledgements
- [Goframe](https://github.com/gogf/gf)
- [golang-migrate](https://github.com/golang-migrate/migrate)
- [Next.js](https://github.com/vercel/next.js)
- [Three.js](https://github.com/mrdoob/three.js)
- [shadcn UI](https://github.com/shadcn-ui/ui)
- [Magic UI](https://github.com/magicuidesign/magicui)