import * as Yup from 'yup';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';

class ProductController {
    async store(request, response) {
        // Definindo o esquema de validação com Yup
        const schema = Yup.object({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number().required(),
            offer: Yup.boolean(),
        });

        try {
            // Usando validação assíncrona com await
            await schema.validate(request.body, { abortEarly: false });
        } catch (err) {
            // Retorna erros de validação com status 400
            return response.status(400).json({ error: err.errors });
        }

        // Verifica se o usuário é admin
        const user = await User.findByPk(request.userId);
        if (!user || !user.admin) {
            return response.status(401).json({ error: 'Unauthorized' });
        }

        // Verifica se request.file está definido e usa o filename se disponível
        const path = request.file ? request.file.filename : null;
        const { name, price, category_id, offer } = request.body;

        // Cria um novo produto no banco de dados
        const product = await Product.create({
            name,
            price,
            category_id,
            path,
            offer,
        });

        // Retorna o produto criado com status 201
        return response.status(201).json(product);
    }

    async update(request, response) {
        // Definindo o esquema de validação com Yup
        const schema = Yup.object({
            name: Yup.string(),
            price: Yup.number(),
            category_id: Yup.number(),
            offer: Yup.boolean(),
        });

        try {
            // Usando validação assíncrona com await
            await schema.validate(request.body, { abortEarly: false });
        } catch (err) {
            // Retorna erros de validação com status 400
            return response.status(400).json({ error: err.errors });
        }

        // Verifica se o usuário é admin
        const user = await User.findByPk(request.userId);
        if (!user || !user.admin) {
            return response.status(401).json({ error: 'Unauthorized' });
        }

        // Busca o produto pelo ID
        const { id } = request.params;
        const findProduct = await Product.findByPk(id);

        if (!findProduct) {
            // Retorna erro se o produto não for encontrado
            return response.status(400).json({ error: 'Make sure your product ID is correct' });
        }

        // Usa o filename do arquivo se estiver presente, caso contrário, mantém o caminho atual
        const path = request.file ? request.file.filename : findProduct.path;
        const { name, price, category_id, offer } = request.body;

        // Atualiza o produto com os novos dados
        await findProduct.update({
            name,
            price,
            category_id,
            path,
            offer,
        });

        // Retorna o produto atualizado com status 200
        return response.status(200).json(findProduct);
    }

    async index(request, response) {
        // Busca todos os produtos, incluindo a categoria associada
        const products = await Product.findAll({
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name'],
            }],
        });

        // Retorna a lista de produtos
        return response.json(products);
    }
}

export default new ProductController();
