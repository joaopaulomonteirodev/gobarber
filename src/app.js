import Express from 'express';
import path from 'path';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = new Express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(Express.json());
    this.server.use(
      '/files',
      Express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
