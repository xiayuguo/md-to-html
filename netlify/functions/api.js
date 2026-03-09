import serverlessHttp from 'serverless-http';
import { buildApp } from '../../src/app.js';

const app = buildApp();
await app.ready();

export const handler = serverlessHttp(app);
