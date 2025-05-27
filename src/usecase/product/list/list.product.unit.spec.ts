import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

const product1 = new Product("1", "Product 1", 1.99);
const product2 = new Product("2", "Product 2", 2.99);

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe("Unit test for listing product use case", () => {
    it("should list products", async () => {
        const productRepository = MockRepository();
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