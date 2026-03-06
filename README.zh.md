# md-to-html

[English](README.md)

Markdown 转 HTML 的 HTTP API 服务，基于 [mdnice](https://mdnice.com/) 渲染引擎，支持一键生成适配微信公众号、掘金、知乎的富文本内容。

## 功能特性

- 使用 markdown-it 渲染 Markdown，兼容脚注、定义列表、目录、图片尺寸等扩展语法
- 使用 juice 将 CSS 主题样式内联，粘贴到各平台编辑器后样式保持完整
- 支持代码高亮（highlight.js）
- 内置三个平台的后处理逻辑：微信公众号、掘金、知乎
- 支持自定义主题 CSS 和追加 CSS
- 提供 Web 预览界面（`GET /`）

## 快速开始

**安装依赖**

```bash
npm install
```

**启动服务**

```bash
npm start
```

服务默认监听 `http://localhost:3000`。

**开发模式（文件变更自动重启）**

```bash
npm run dev
```

## 环境变量

| 变量   | 默认值    | 说明     |
| ------ | --------- | -------- |
| `PORT` | `3000`    | 监听端口 |
| `HOST` | `0.0.0.0` | 监听地址 |

## API

### `POST /convert`

将 Markdown 转换为目标平台的 HTML。

**请求体（JSON）**

| 字段        | 类型     | 必填 | 说明                                            |
| ----------- | -------- | ---- | ----------------------------------------------- |
| `markdown`  | `string` | 是   | Markdown 原文                                   |
| `platform`  | `string` | 否   | 目标平台：`wechat`（默认）/ `juejin` / `zhihu` |
| `themeCSS`  | `string` | 否   | 替换默认主题的 CSS                              |
| `customCSS` | `string` | 否   | 在主题基础上追加的 CSS                          |

**响应体（JSON）**

| 字段       | 类型     | 说明                   |
| ---------- | -------- | ---------------------- |
| `html`     | `string` | 带内联样式的 HTML 片段 |
| `platform` | `string` | 实际使用的平台名       |

**示例**

```bash
curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Hello\n\n这是一段正文。", "platform": "wechat"}'
```

### `GET /health`

健康检查，返回 `{"status":"ok"}`。

### `GET /`

Web 预览界面，可在浏览器中在线预览渲染效果。

## 项目结构

```
src/
  server.js          # Fastify HTTP 服务入口
  renderer.js        # Markdown 渲染核心（markdown-it + juice）
  platforms.js       # 各平台后处理逻辑
  plugins/
    md-multiquote.js # 嵌套引用块 class 插件
    md-span.js       # 标题 prefix/content/suffix span 插件
  themes/
    basic.css        # 基础结构样式（mdnice basic）
    normal.css       # 默认主题样式（mdnice normal）
```

## 部署（Netlify）

CI/CD 通过 GitHub Actions 实现（参见 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)）。

每次推送到 `main` 分支时，自动通过 Netlify CLI 部署到 Netlify。

**需要在 GitHub 仓库中配置以下 Secrets：**

| Secret                | 获取方式                                               |
| --------------------- | ------------------------------------------------------ |
| `NETLIFY_AUTH_TOKEN`  | Netlify → 用户设置 → Personal access tokens            |
| `NETLIFY_SITE_ID`     | Netlify → Site configuration → Site ID                 |

**工作原理：**

- `src/public/` 作为静态资源部署，由 Netlify 直接提供服务
- `POST /convert` 和 `GET /health` 以 Netlify Function 运行（`netlify/functions/api.js`），使用 `serverless-http` 适配 Fastify

## 关注我们

如果本项目对你有帮助，欢迎关注微信公众号 **Feed**，获取更多内容。

<img src="src/public/qrcode.jpg" alt="Feed 微信公众号二维码" width="200" />

## 许可证

GPL-3.0
