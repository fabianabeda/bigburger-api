import express from 'express';
import { resolve } from 'node:path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import routes from './routes.js';
import './database/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

class App {
  constructor() {
    this.app = express();

    this.app.use(cors({
      origin: 'http://localhost:5173',
    }));
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());

    this.app.use(
      '/product-file',
      express.static(resolve(__dirname, '..', 'uploads'))
    );

    this.app.use(
      '/category-file',
      express.static(resolve(__dirname, '..', 'uploads'))
    );
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app;
