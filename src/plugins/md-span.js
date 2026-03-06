/**
 * 来源: mdnice src/utils/markdown-it-span.js
 * 为标题添加 <span class="prefix/content/suffix"> 结构，方便主题通过 CSS 装饰标题前后缀
 */
export default (md, opts = {}) => {
  const options = Object.assign({ addHeadingSpan: true }, opts);

  if (!options.addHeadingSpan) return;

  md.core.ruler.push('heading_span', (state) => {
    for (let i = 0; i < state.tokens.length - 1; i++) {
      if (
        state.tokens[i].type !== 'heading_open' ||
        state.tokens[i + 1].type !== 'inline'
      ) {
        continue;
      }
      const headingInlineToken = state.tokens[i + 1];
      if (!headingInlineToken.content) continue;

      const spanPre = new state.Token('html_inline', '', 0);
      spanPre.content = '<span class="prefix"></span><span class="content">';
      headingInlineToken.children.unshift(spanPre);

      const spanPost = new state.Token('html_inline', '', 0);
      spanPost.content = '</span><span class="suffix"></span>';
      headingInlineToken.children.push(spanPost);

      i += 2;
    }
  });
};
