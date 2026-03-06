/**
 * 来源: mdnice src/utils/markdown-it-multiquote.js
 * 为嵌套 blockquote 添加 multiquote-N class，配合 basic.css 的 .multiquote-1/2/3 样式
 */
function makeRule() {
  return function addBlockquoteClass(state) {
    let count = 0;
    let outerQuoteToken;
    for (let i = 0; i < state.tokens.length; i++) {
      const curToken = state.tokens[i];
      if (curToken.type === 'blockquote_open') {
        if (count === 0) {
          outerQuoteToken = curToken;
        }
        count++;
        continue;
      }
      if (count > 0) {
        outerQuoteToken.attrs = [['class', 'multiquote-' + count]];
        count = 0;
      }
    }
  };
}

export default (md) => {
  md.core.ruler.push('blockquote-class', makeRule(md));
};
