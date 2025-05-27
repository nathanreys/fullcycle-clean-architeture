import { Sequelize } from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequilize/product.repository";
import { InputCreateProductDto, OutputCreateProductDto } from "./create.product.dto";
import CreateProductUseCase from "./create.product.usrcase";
import ProductModel from "../../../infrastructure/product/repository/sequilize/product.model";

const input: InputCreateProductDto = {
    name: 'Product 1',
    price: 1.99,
}

describe("Unit test create product use case", () => {
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

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const output: OutputCreateProductDto = await usecase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        });
    })
    
    it("should throw an error when name is missing", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        var localInput = Object.assign({}, input);
        localInput.name = "";

        await expect(usecase.execute(localInput)).rejects.toThrow("Name is required");
    });    

     it("should throw an error when price is equal or less than zero", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        var localInput = Object.assign({}, input);
        localInput.price = 0;

        await expect(usecase.execute(localInput)).rejects.toThrow("Price must be greater than zero");
    });    
});