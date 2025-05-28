import express, { Request, Response } from 'express';
import CreateProductUseCase from '../../../usecase/product/create/create.product.usrcase';
import ProductRepository from '../../product/repository/sequilize/product.repository';
import { InputCreateProductDto, OutputCreateProductDto } from '../../../usecase/product/create/create.product.dto';
import ListProductUseCase from '../../../usecase/product/list/list.product.usecase';
import FindProductUseCase from '../../../usecase/product/find/find.product.usecase';
import { InputFindProductDto } from '../../../usecase/product/find/find.product.dto';

export const productRoute = express.Router();

productRoute.post('/', async (req: Request, res: Response) => {
    const usecase = new CreateProductUseCase(new ProductRepository());

    try {
        const input: InputCreateProductDto = {
            name: req.body.name,
            price: req.body.price,
        }

        const output: OutputCreateProductDto = await usecase.execute(input)
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

productRoute.get('/', async (req: Request, res: Response) => {
    const usecase = new ListProductUseCase(new ProductRepository());

    try {
        const output = await usecase.execute({});
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

productRoute.get('/:id', async (req: Request, res: Response) => {
    const usecase = new FindProductUseCase(new ProductRepository());

    try {
        const input: InputFindProductDto = {
            id: req.params.id,
        }

        const output = await usecase.execute(input);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});
