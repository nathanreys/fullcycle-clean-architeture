import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequilize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequilize/product.repository";
import { InputUpdateProductDto, OutputUpdateProductDto } from "./update.product.dto";
import UpdateProductUseCase from "./update.product.usecase";

const product = new Product("1", "Product 1", 1.99);

const input: InputUpdateProductDto = {
    id: product.id,
    name: "Product Updated",
    price: 2.99
}

describe("Unit test for product update use case", () => {
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

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        await productRepository.create(product);

        const productUpdateUseCase = new UpdateProductUseCase(productRepository);

        const output: OutputUpdateProductDto = await productUpdateUseCase.execute(input);
        expect(output).toEqual(input);
    });
});