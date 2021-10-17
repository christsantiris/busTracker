import * as express from 'express';
import * as dotenv from 'dotenv';

class App {
  public express: express.Application;

  constructor() {
    this.express = express()
    dotenv.config();
  }
}

export default new App().express