import Sequelize from "sequelize";
import mongoose from 'mongoose';
import configDatabase from '../config/database';

import User from "../app/models/User";
import Product from "../app/models/Product";
import Category from "../app/models/Category";

const models = [User, Product, Category];

class Database {
    constructor(){
        this.init();
        this.mongo();
    }

    init() {
        this.connection = new Sequelize(configDatabase);
        this.connection.authenticate()
            .then(() => console.log('Conectado ao banco de dados SQL'))
            .catch(err => console.error('Erro ao conectar ao banco de dados SQL:', err));

        models
            .map((model) => model.init(this.connection))
            .map((model) => model.associate && model.associate(this.connection.models));
    }

    mongo() {
        mongoose.connect('mongodb://localhost:27017/bigburger')
            .then(() => console.log('Conectado ao MongoDB'))
            .catch(err => console.error('Erro ao conectar ao MongoDB:', err));
    }
}

export default new Database();
