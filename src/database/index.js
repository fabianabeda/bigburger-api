import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';
import configDatabase from '../config/database.js';

import User from '../app/models/User.js';
import Product from '../app/models/Product.js';
import Category from '../app/models/Category.js';

const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(configDatabase);

    this.connection.authenticate()
      .then(() => console.log('Conectado ao banco de dados SQL'))
      .catch(err => console.error('Erro ao conectar ao banco de dados SQL:', err));

    models
      .forEach(model => {
        model.init(this.connection);
      });

    models
      .forEach(model => {
        if (model.associate) {
          model.associate(this.connection.models);
        }
      });
  }

  mongo() {
    mongoose.connect('mongodb://localhost:27017/bigburger')
      .then(() => console.log('Conectado ao MongoDB'))
      .catch(err => console.error('Erro ao conectar ao MongoDB:', err));
  }
}

export default new Database();
