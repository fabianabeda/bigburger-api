import { Router} from 'express'

import { v4 } from 'uuid';

import User from './app/models/User';

const routes = new Router()

routes.get('/', async (request, response) =>{
    const user = await User.create({
        id: v4,
        name: 'Fabiana2',
        email: 'fabiana2@email.com',
        password_hash: 'wiwuejrirdj',
    });
    return response.status(201).json(user);
})

export default routes