import Product from "../../../domain/product/entity/product";
import { InputFindProductDto } from "./find.product.dto";
import FindProductUseCase from "./find.product.usecase";

const input: InputFindProductDto = {
    id: "1",
};

const product = new Product("1", "Product 1", 1.99);

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test find product use case", () => {
    it("should find a product", async () => {
        const productRepository = MockRepository();

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
        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
            throw new Error("Product not found");
        });
        
        const usecase = new FindProductUseCase(productRepository);

        expect(() => {
            return usecase.execute(input);
        }).rejects.toThrow("Product not found");
    });
});