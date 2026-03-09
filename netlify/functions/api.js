import serverlessHttp from 'serverless-http';
import { buildApp } from '../../src/app.js';

let _handler;

export const handler = async (event, context) => {
  if (!_handler) {
    const app = buildApp();
    await app.ready();
    _handler = serverlessHttp(app);
  }
  return _handler(event, context);
};
