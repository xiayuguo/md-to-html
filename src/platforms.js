/**
 * 各平台后处理逻辑
 * 来源: mdnice src/utils/converter.js 的平台特定函数
 */

/**
 * 微信公众号后处理
 * - 移除外层 id（公众号编辑器会自己管理 id）
 * - 微信编辑器接受 text/html 粘贴，juice 内联样式后直接可用
 */
export function processWeChat(html) {
  return html.replace(/ id="nice"/, '');
}

/**
 * 掘金后处理
 * - 修复代码块 -webkit-box 导致的不换行问题（来源: mdnice solveJuejinCode）
 * - 移除外层 id
 * - 追加来源署名（来源: mdnice addJuejinSuffix）
 */
export function processJuejin(html) {
  // 修复掘金代码块换行：-webkit-box → block，<br> → 换行符
  let result = html.replace(
    /(<pre[^>]*class="custom"[^>]*>[\s\S]*?<\/pre>)/g,
    (match) =>
      match
        .replace(/display:\s*-webkit-box\s*;/g, 'display: block;')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/&nbsp;/g, ' '),
  );

  // 追加来源署名
  result = result.replace(
    '</section>',
    '<p style="margin-top:20px !important">本文使用 <a href="https://mdnice.com/?from=juejin" target="_blank">mdnice</a> 排版</p></section>',
  );

  return result.replace(/ id="nice"/, '');
}

/**
 * 知乎后处理
 * - 知乎编辑器对部分样式有特殊处理，基本兼容内联样式
 */
export function processZhihu(html) {
  return html.replace(/ id="nice"/, '');
}

export const PLATFORMS = {
  wechat: processWeChat,
  juejin: processJuejin,
  zhihu: processZhihu,
};
