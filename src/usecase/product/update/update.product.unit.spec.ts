import Product from "../../../domain/product/entity/product";
import { InputUpdateProductDto, OutputUpdateProductDto } from "./update.product.dto";
import UpdateProductUseCase from "./update.product.usecase";

const product = new Product("1", "Product 1", 1.99);

const input: InputUpdateProductDto = {
    id: product.id,
    name: "Product Updated",
    price: 2.99
}

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test for product update use case", () => {
    it("should update a product", async () => {
        const productRepository = MockRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);

        const output: OutputUpdateProductDto = await productUpdateUseCase.execute(input);
        expect(output).toEqual(input);
    });
});