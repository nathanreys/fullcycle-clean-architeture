import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import ListCustomerUseCase from "./list.customer.usecase";

const customer1 = CustomerFactory.createWithAddress(
    "John One",
    new Address("Street 1", 1, "Zip 1", "City 1")
);

const customer2 = CustomerFactory.createWithAddress(
    "John Two",
    new Address("Street 2", 2, "Zip 2", "City 2")
);

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([customer1, customer2])),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe("Unit test for listing customer use case", () => {
    it("should list customers", async () => {
        const customerRepository = MockRepository();
        const useCase = new ListCustomerUseCase(customerRepository);

        const output = await useCase.execute({});

        expect(output.customers.length).toBe(2);
        expect(output.customers[0]).toEqual({
            id: customer1.id,
            name: customer1.name,
            address: {
                street: customer1.address.street,
                number: customer1.address.number,
                zip: customer1.address.zip,
                city: customer1.address.city,
            },
        });

        expect(output.customers[1]).toEqual({
            id: customer2.id,
            name: customer2.name,
            address: {
                street: customer2.address.street,
                number: customer2.address.number,
                zip: customer2.address.zip,
                city: customer2.address.city,
            },
        });
    });
});