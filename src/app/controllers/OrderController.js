import * as Yup from 'yup';
import Order from '../schemas/Order.js'; 
import Product from '../models/Product.js'; 
import Category from '../models/Category.js';
import User from '../models/User.js';

class OrderController {
    async store(request, response) {
        // Definição do esquema de validação com Yup
        const schema = Yup.object({
            products: Yup.array().required().of(
                Yup.object({
                    id: Yup.number().required(),
                    quantity: Yup.number().required(),
                })
            ),
        });

        try {
            // Validação do request body
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { products } = request.body;

        // Mapeando os IDs dos produtos
        const productsIds = products.map((product) => product.id);
        
        // Buscando produtos no banco de dados
        const findProducts = await Product.findAll({
            where: {
                id: productsIds,
            },
            include: {
                model: Category,
                as: 'category',
                attributes: ['name'],
            }
        });
        
        // Formatando os produtos para a ordem
        const formattedProducts = findProducts.map(product => {
            const productIndex = products.findIndex((item) => item.id === product.id);

            const newProduct = {
                id: product.id,
                name: product.name,
                category: product.category.name,
                price: product.price,
                url: product.url, 
                quantity: products[productIndex].quantity,
            };
            return newProduct;
        });

    
        // Criando a ordem
        const order = {
            user: {
                id: request.userId,
                name: request.userName,
            },
            products: formattedProducts,
            status: 'Pedido realizado',
        };

        const createdOrder = await Order.create(order);
        console.log('Ordem criada:', createdOrder);

        return response.status(201).json(createdOrder);
    }

    async index(request, response){
        const orders = await Order.find();

        return response.json(orders);
    }

    async update(request, response) {
        const schema = Yup.object({
            status: Yup.string().required(),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }
        const { admin: isAdmin } = await User.findByPk(request.userId);
        
        if (!isAdmin) {
            return response.status(401).json();
        }


        const { id } = request.params;
        const { status } = request.body;
        try {
            await Order.updateOne({ _id: id }, { status });
        } catch (err) {
                return response.status(400).json({ error: err.message });
        }
    
        return response.json({ message: 'Status updated successfully' });
    }
        
    
}

export default new OrderController;
