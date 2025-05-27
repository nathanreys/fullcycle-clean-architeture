import { InputCreateCustomerDto, OutputCreateCustomerDto } from "./create.customer.dto";
import CreateCustomerUseCase from "./create.customer.usecase";

const input: InputCreateCustomerDto = {
    name: 'John Doe',
    address: {
        street: '123 Main St',
        number: 123,
        zip: '12345',
        city: 'Anytown'
    }
}

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test create customer use case", () => {
    it("should create a customer", async () => {
        const customerRepository = MockRepository();
        const customerCreateUseCase = new CreateCustomerUseCase(customerRepository);

        const output: OutputCreateCustomerDto = await customerCreateUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            address: {
                street: input.address.street,
                number: input.address.number,
                zip: input.address.zip,
                city: input.address.city
            }
        })
    });

    it("should throw an error when name is missing", async () => {
        const customerRepository = MockRepository();
        const customerCreateUseCase = new CreateCustomerUseCase(customerRepository);

        var localInput = Object.assign({}, input); 
        localInput.name = "";

        await expect(customerCreateUseCase.execute(localInput)).rejects.toThrow("Name is required");
    });

    it("should throw an error when street is missing", async () => {
        const customerRepository = MockRepository();
        const customerCreateUseCase = new CreateCustomerUseCase(customerRepository);

        var localInput = Object.assign({}, input);         
        localInput.address.street = "";        

        await expect(customerCreateUseCase.execute(localInput)).rejects.toThrow("Street is required");
    });
});

