/* eslint-disable no-console */
const http = require('http');
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
const cluster = require('cluster');
const path = require('path');

const { cpus } = require('os');
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

// providers
const ioProvider = require('./providers/io.provider');

// add bluebird like Promise
mongoose.Promise = bluebird;

const PORT = config.get('PORT') || 4001;
const numCPUs = cpus().length;

// initialize express and http
const app = express();
const httpServer = http.Server(app);

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
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

/**
 * Give away static react files if isProduction -> true (NODE_ENV === "production")
 */

if (isProduction) {
  app.use(express.static(path.resolve(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

function fnMaster() {
  console.log(`Master ${process.pid} is running`);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < numCPUs; i++) {
    console.log(`Forking process number ${i}...`);

    cluster.fork();
  }

  cluster.on('exit', worker => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Forking a new process...');

    cluster.fork();
  });
}

function DatabaseConnections() {
  return new Promise(async (resolve, reject) => {
    await mongoose.connect(mongoConnectConfig, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    const db = mongoose.connection;
    db.on('error', reject);
    db.once('open', () => {
      console.log('connected to mongodb server');
    });

    resolve();
  });
}

async function childProcess() {
  console.log(`Worker ${process.pid} started...`);

  try {
    await DatabaseConnections();
  } catch (error) {
    throw Error(error);
  }

  ioProvider(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server has been started on port: ${PORT} `);
  });
}

// function work with multithreads
function startServer() {
  if (cluster.isMaster) {
    fnMaster();
  } else if (cluster.isWorker) {
    childProcess();
  }
}

startServer();
