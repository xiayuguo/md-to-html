import Fastify from 'fastify';
import { renderMarkdown } from './renderer.js';
import { PLATFORMS } from './platforms.js';

export function buildApp() {
  const app = Fastify({ logger: false });

  app.post('/convert', {
    schema: {
      body: {
        type: 'object',
        required: ['markdown'],
        properties: {
          markdown:  { type: 'string', minLength: 1 },
          platform:  { type: 'string', enum: ['wechat', 'juejin', 'zhihu'], default: 'wechat' },
          themeCSS:  { type: 'string' },
          customCSS: { type: 'string', default: '' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            html:     { type: 'string' },
            platform: { type: 'string' },
          },
        },
      },
    },
  }, async (req) => {
    const { markdown, platform = 'wechat', themeCSS, customCSS = '' } = req.body;
    const baseHtml = renderMarkdown(markdown, { themeCSS, customCSS });
    const processor = PLATFORMS[platform] ?? PLATFORMS.wechat;
    return { html: processor(baseHtml), platform };
  });

  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}
