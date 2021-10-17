
import * as bodyParser from 'body-parser';
import * as express from 'express';
import app from './app';
import { serviceConfig } from '../config/config';
import { Services } from './services';
import { ServerHelpers } from './lib/server.helpers';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new Services();

const port = serviceConfig.port;

app.listen(port, async() => {
  console.log(`server is listening on ${port} in environment ${serviceConfig.envName}`);
  await db.createMongoConnection();
  console.info('Database Connected');
  await db.initializeDependencies();
  await db.resolveServices();
  ServerHelpers.loadRoutes(app, express, db)
  app.use(async (err, req, res, next) => {
    console.error(err);
    const statusCode = err?.statusCode || 500;
    res.status(statusCode).json({
      status: statusCode,
      message: err.message
    });
  })
  console.info('Finished loading route at', new Date());
});

process.on('SIGINT', async() => {
  await ServerHelpers.handleProgramExit(db.connection);
});

process.on('SIGTERM', async() => {
  await ServerHelpers.handleProgramExit(db.connection);
});