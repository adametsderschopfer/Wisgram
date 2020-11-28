const rp = require('app-root-path');
const config = require('config');

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

// database connection
/* MONGO */
const mongoConnectConfig = {};
/* MYSQL */
const mysqlConnectConfig = {
  user: config.get('MySql.User'),
  password: config.get('MySql.Password'),
  port: config.get('MySql.Port'),
  host: config.get('MySql.Host'),
  database: config.get('MySql.Database'),
};
/* --- */

const transportConfig = {
  host: config.get('smtp.host'),
  port: isDevelopment ? config.get('smtp.port') : undefined,
  service: isProduction ? config.get('smtp.service') : undefined,
  security: config.get('smtp.security'),
  auth: {
    user: config.get('smtp.email'),
    pass: config.get('smtp.pass'),
  },
};

/*
  Exports config variables
*/
module.exports = {
  isDevelopment,
  isProduction,
  winstonOptions,
  morganOptions,
  corsOptions,
  luscaConfig,
  mongoConnectConfig,
  mysqlConnectConfig,
  transportConfig,
};
