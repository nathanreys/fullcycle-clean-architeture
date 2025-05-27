import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import { InputFindProductDto } from "./find.product.dto";
import FindProductUseCase from "./find.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequilize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequilize/product.repository";

const input: InputFindProductDto = {
    id: "1",
};

describe("Unit test find product use case", () => {
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

    it("should find a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 1.99);

        await productRepository.create(product);

        const outputExpected = {
            id: "1",
            name: "Product 1",
            price: 1.99,
        };

        const usecase = new FindProductUseCase(productRepository);
        const result = await usecase.execute(input);

        expect(result).toEqual(outputExpected);
    });

    it("should not find a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("2", "Product 2", 2.99);

        await productRepository.create(product);

        const usecase = new FindProductUseCase(productRepository);

        await expect(() => {
            return usecase.execute(input);
        }).rejects.toThrow("Product not found");
    });
});