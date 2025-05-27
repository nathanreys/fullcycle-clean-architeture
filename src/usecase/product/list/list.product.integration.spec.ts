import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequilize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequilize/product.repository";
import ListProductUseCase from "./list.product.usecase";

const product1 = new Product("1", "Product 1", 1.99);
const product2 = new Product("2", "Product 2", 2.99);

describe("Unit test for listing product use case", () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should list products", async () => {
        const productRepository = new ProductRepository();
        await productRepository.create(product1);
        await productRepository.create(product2);
        
        const useCase = new ListProductUseCase(productRepository);

        const output = await useCase.execute({});

        expect(output.products.length).toBe(2);

        expect(output.products[0]).toEqual({
            id: product1.id,
            name: product1.name,
            price: product1.price
        });

        expect(output.products[1]).toEqual({
            id: product2.id,
            name: product2.name,
            price: product2.price
        });
    });
});