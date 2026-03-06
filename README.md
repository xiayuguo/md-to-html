# md-to-html

[中文](README.zh.md)

An HTTP API service that converts Markdown to platform-ready HTML, based on the [mdnice](https://mdnice.com/) rendering engine. Generates richly styled content for WeChat Official Accounts, Juejin, and Zhihu with a single request.

## Features

- Renders Markdown with markdown-it, supporting footnotes, definition lists, table of contents, image sizing, and more
- Inlines CSS theme styles using juice — paste directly into platform editors with styles intact
- Syntax highlighting via highlight.js
- Platform-specific post-processing for WeChat, Juejin, and Zhihu
- Custom theme CSS and additional CSS override support
- Built-in web preview UI (`GET /`)

## Getting Started

**Install dependencies**

```bash
npm install
```

**Start the server**

```bash
npm start
```

The server listens on `http://localhost:3000` by default.

**Development mode (auto-restart on file changes)**

```bash
npm run dev
```

## Environment Variables

| Variable | Default   | Description    |
| -------- | --------- | -------------- |
| `PORT`   | `3000`    | Listening port |
| `HOST`   | `0.0.0.0` | Listening host |

## API

### `POST /convert`

Convert Markdown to HTML for the target platform.

**Request body (JSON)**

| Field       | Type     | Required | Description                                              |
| ----------- | -------- | -------- | -------------------------------------------------------- |
| `markdown`  | `string` | Yes      | Markdown source text                                     |
| `platform`  | `string` | No       | Target platform: `wechat` (default) / `juejin` / `zhihu` |
| `themeCSS`  | `string` | No       | CSS to replace the default theme                         |
| `customCSS` | `string` | No       | Additional CSS appended on top of the theme              |

**Response body (JSON)**

| Field      | Type     | Description                          |
| ---------- | -------- | ------------------------------------ |
| `html`     | `string` | HTML fragment with inlined styles    |
| `platform` | `string` | The platform name actually used      |

**Example**

```bash
curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Hello\n\nSome body text.", "platform": "wechat"}'
```

### `GET /health`

Health check. Returns `{"status":"ok"}`.

### `GET /`

Web preview UI — open in a browser to preview rendered output interactively.

## Project Structure

```
src/
  server.js          # Fastify HTTP server entry point
  renderer.js        # Markdown rendering core (markdown-it + juice)
  platforms.js       # Platform-specific post-processing
  plugins/
    md-multiquote.js # Nested blockquote class plugin
    md-span.js       # Heading prefix/content/suffix span plugin
  themes/
    basic.css        # Base structural styles (mdnice basic)
    normal.css       # Default theme styles (mdnice normal)
```

## Deployment (Netlify)

CI/CD is handled by GitHub Actions (see [.github/workflows/deploy.yml](.github/workflows/deploy.yml)).

Every push to `main` automatically deploys to Netlify via the Netlify CLI.

**Required GitHub repository secrets:**

| Secret                | Where to find it                                       |
| --------------------- | ------------------------------------------------------ |
| `NETLIFY_AUTH_TOKEN`  | Netlify → User settings → Personal access tokens       |
| `NETLIFY_SITE_ID`     | Netlify → Site configuration → Site ID                 |

**How it works:**

- `src/public/` is deployed as static assets (served directly by Netlify)
- `POST /convert` and `GET /health` run as a Netlify Function (`netlify/functions/api.js`) backed by `serverless-http` + Fastify

## License

GPL-3.0
