import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequilize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequilize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import { InputFindCustomerDto, OutputFindCustomerDto } from "./find.customer.dto";
import FindCustomerUseCase from "./find.customer.usecase";

const customer = new Customer("1", "John Doe");
const address = new Address("Street 1", 123, "Zip", "City");
customer.changeAddress(address);

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test find customer use case", () => {
    it("should find a customer", async () => {
        const customerRepository = MockRepository();

        const input: InputFindCustomerDto = {
            id: "1",
        };

        const outputExpected: OutputFindCustomerDto = {
            id: "1",
            name: "John Doe",
            address: {
                street: "Street 1",
                city: "City",
                number: 123,
                zip: "Zip"
            }
        }

        const usecase = new FindCustomerUseCase(customerRepository)
        const result = await usecase.execute(input)

        expect(result).toEqual(outputExpected);
        expect(input.id).toBe(outputExpected.id);
    });

    it("should not find a customer", async () => {
        const customerRepository = MockRepository();
        customerRepository.find.mockImplementation(() => {
            throw new Error("Customer not found");
        });

        const input: InputFindCustomerDto = {
            id: "1",
        };

        const usecase = new FindCustomerUseCase(customerRepository)

        expect(() => {
           return usecase.execute(input); 
        }).rejects.toThrow("Customer not found");
    });
});