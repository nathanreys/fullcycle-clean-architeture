import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequilize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequilize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import { InputFindCustomerDto, OutputFindCustomerDto } from "./find.customer.dto";
import FindCustomerUseCase from "./find.customer.usecase";

describe("Test find customer use case", () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find a customer", async () => {
        const customer = new Customer("1", "John Doe");
        const address = new Address("Street 1", 123, "Zip", "City");
        customer.changeAddress(address);

        const customerRepository = new CustomerRepository()
        await customerRepository.create(customer);

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
    });
});