import http from 'http';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import bluebird from 'bluebird';
import helmet from 'helmet';
import lusca from 'lusca';
import io from 'socket.io';
import mongoose from 'mongoose';
import config from 'config';
import cluster from 'cluster';

import { luscaConfig, corsOptions } from './utils/functions/config';
import { cpus } from 'os';

mongoose.Promise = bluebird;

const PORT = config.get('PORT') || 4001;
const numCPUs = cpus().length;

const app = express();
const httpServer = http.Server(app);
const _io = io(httpServer);

app.use(compression());
app.use(helmet());
app.use(lusca(luscaConfig));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function startServer() {
  if (cluster.isMaster) {
    fnMaster();
  } else if (cluster.isWorker) {
    childProcess();
  }
}

function fnMaster() {
  console.log(`Master ${process.pid} is running`);

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

function childProcess() {
  console.log(`Worker ${process.pid} started...`);

  httpServer.listen(PORT);
}

startServer();
