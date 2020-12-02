const http = require('http');
const cluster = require('cluster');
const { cpus } = require('os');
const mongoose = require('mongoose');
const { app } = require('../server/server');
const { mongoConnectConfig } = require('../server/utils/config');

const PORT = app.get('PORT');

// providers
const SocketServer = require('../server/providers/SocketServer.provider');

const numCPUs = cpus().length;

const httpServer = http.Server(app);

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

  SocketServer(httpServer);

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
