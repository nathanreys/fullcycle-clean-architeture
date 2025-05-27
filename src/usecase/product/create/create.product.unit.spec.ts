import { InputCreateProductDto, OutputCreateProductDto } from "./create.product.dto";
import CreateProductUseCase from "./create.product.usrcase";

const input: InputCreateProductDto = {
    name: 'Product 1',
    price: 1.99,
}

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test create product use case", () => {
    it("should create a product", async () => {
        const productRepository = MockRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const output: OutputCreateProductDto = await usecase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        });
    })
    
    it("should throw an error when name is missing", async () => {
        const productRepository = MockRepository();
        const usecase = new CreateProductUseCase(productRepository);

        var localInput = Object.assign({}, input);
        localInput.name = "";

        await expect(usecase.execute(localInput)).rejects.toThrow("Name is required");
    });    

     it("should throw an error when price is equal or less than zero", async () => {
        const productRepository = MockRepository();
        const usecase = new CreateProductUseCase(productRepository);

        var localInput = Object.assign({}, input);
        localInput.price = 0;

        await expect(usecase.execute(localInput)).rejects.toThrow("Price must be greater than zero");
    });    
});