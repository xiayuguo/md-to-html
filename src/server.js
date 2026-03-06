import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { buildApp } from './app.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexHtml = readFileSync(join(__dirname, 'public/index.html'), 'utf-8');

const app = buildApp();

app.get('/', (_req, reply) => {
  reply.type('text/html').send(indexHtml);
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

try {
  await app.listen({ port: Number(PORT), host: HOST });
  console.log(`md-converter-api running on http://localhost:${PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
