import MarkdownIt from 'markdown-it';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItDeflist from 'markdown-it-deflist';
import markdownItTableOfContents from 'markdown-it-table-of-contents';
import hljs from 'highlight.js';
import juice from 'juice';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mdMultiquote from './plugins/md-multiquote.js';
import mdSpan from './plugins/md-span.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 加载 mdnice 主题 CSS
const BASIC_CSS = readFileSync(join(__dirname, 'themes/basic.css'), 'utf-8');
const NORMAL_CSS = readFileSync(join(__dirname, 'themes/normal.css'), 'utf-8');

/**
 * 代码高亮渲染（与 mdnice langHighlight 对齐）
 */
function highlight(str, lang) {
  const escapeHtml = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  if (lang && hljs.getLanguage(lang)) {
    try {
      const highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
      return `<pre class="custom"><code class="hljs language-${lang}">${highlighted}</code></pre>`;
    } catch (_) {}
  }
  return `<pre class="custom"><code class="hljs">${escapeHtml(str)}</code></pre>`;
}

/**
 * 构建 markdown-it 实例（与 mdnice 插件配置对齐）
 */
function buildMarkdownIt() {
  const md = new MarkdownIt({
    html: false,
    breaks: true,
    linkify: true,
    highlight,
  })
    .use(markdownItFootnote)
    .use(markdownItDeflist)
    .use(markdownItTableOfContents, { includeLevel: [2, 3] })
    .use(mdMultiquote)
    .use(mdSpan);

  // 链接在新标签页打开
  const defaultLinkOpen =
    md.renderer.rules.link_open ||
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    tokens[idx].attrSet('target', '_blank');
    return defaultLinkOpen(tokens, idx, options, env, self);
  };

  return md;
}

const md = buildMarkdownIt();

/**
 * 将 Markdown 转换为带内联样式的 HTML
 *
 * @param {string} markdown - 输入的 Markdown 文本
 * @param {object} options
 * @param {string} [options.themeCSS]   - 覆盖默认主题的 CSS（可选）
 * @param {string} [options.customCSS]  - 追加的自定义 CSS（可选）
 * @returns {string} 带内联样式的 HTML 字符串
 */
export function renderMarkdown(markdown, { themeCSS, customCSS = '' } = {}) {
  // 1. markdown-it 渲染为原始 HTML
  const rawHtml = md.render(markdown);

  // 2. 用 #nice 包裹（与 mdnice LAYOUT_ID / BOX_ID 对应）
  const wrappedHtml = `<section id="nice">${rawHtml}</section>`;

  // 3. juice 将 CSS 内联（核心步骤，与 mdnice converter.js solveHtml 一致）
  const css = BASIC_CSS + (themeCSS ?? NORMAL_CSS) + customCSS;
  const inlined = juice.inlineContent(wrappedHtml, css, {
    inlinePseudoElements: true,
    preserveImportant: true,
  });

  return inlined;
}
