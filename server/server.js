/* eslint-disable no-console */
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bluebird = require('bluebird');
const helmet = require('helmet');
const lusca = require('lusca');
const mongoose = require('mongoose');
const config = require('config');
const path = require('path');

const {
  luscaConfig,
  corsOptions,
  isProduction,
  isDevelopment,
  morganOptions,
  mongoConnectConfig,
} = require('./utils/config');

// routes
const authRouter = require('./routes/api/v1/auth');
const userRouter = require('./routes/api/v1/user');

// add bluebird like Promise
mongoose.Promise = bluebird;

// initialize express and http
const app = express();

app.set('PORT', config.get('PORT'));
app.set('API_VERSION', config.get('API_VERSION'));

// load modules
app.use(compression());
app.use(helmet());
app.use(lusca(luscaConfig));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));

if (isDevelopment) {
  app.use(morgan(morganOptions));
}

// APIs routes
app.use(`/api/${app.get('API_VERSION')}/auth`, authRouter);
app.use(`/api/${app.get('API_VERSION')}/user`, userRouter);

/**
 * Give away static react files if isProduction -> true (NODE_ENV === "production")
 */

if (isProduction) {
  app.use(express.static(path.resolve(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

module.exports = app;
