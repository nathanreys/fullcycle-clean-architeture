import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import { InputUpdateCustomerDto, OutputUpdateCustomerDto } from "./update.customer.dto";
import UpdateCustomerUseCase from "./update.customer.usecase";

const customer = CustomerFactory.createWithAddress(
    "John Doe",
    new Address(
        "Street 1",
        123,
        "Zip",
        "City"
    )
);

const input: InputUpdateCustomerDto = {
    id: customer.id,
    name: "John Updated",
    address: {
        street: "Street Updated",
        number: 1234,
        zip: "Zip Updated",
        city: "City Updated"
    }
}

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }    
}

describe("Unit test for customer update use case", () => {
    it("should update a customer", async () => {
        const customerRepository = MockRepository();
        const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);

        const output: OutputUpdateCustomerDto = await customerUpdateUseCase.execute(input);
        expect(output).toEqual(input);
    });
});