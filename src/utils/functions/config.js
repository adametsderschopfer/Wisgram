import rp from 'app-root-path';
import * as cors from 'cors';

/*
  Environment:
    NODE_ENV
*/
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

/*
  Winstron options
*/
const winstonOptions = {
  file: {
    level: 'info',
    filename: `${rp.path}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const corsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
};

const luscaConfig = {
  xframe: 'SAMEORIGIN',
  p3p: 'ABCDEF',
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  xssProtection: true,
  nosniff: true,
  referrerPolicy: 'same-origin',
};

/*
  Morgan options
*/
const morganOptions = 'dev';

/*
  Exports config variables
*/
export {
  isDevelopment,
  isProduction,
  winstonOptions,
  morganOptions,
  corsOptions,
  luscaConfig,
};
