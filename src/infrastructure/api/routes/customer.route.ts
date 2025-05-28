import express, { Request, Response } from "express";
import CreateCustomerUseCase from "../../../usecase/customer/create/create.customer.usecase";
import CustomerRepository from "../../customer/repository/sequilize/customer.repository";
import { InputCreateCustomerDto, OutputCreateCustomerDto } from "../../../usecase/customer/create/create.customer.dto";
import ListCustomerUseCase from "../../../usecase/customer/list/list.customer.usecase";
import { OutputListCustomerDto } from "../../../usecase/customer/list/list.customer.dto";

export const customerRoute = express.Router();

customerRoute.post("/", async (req: Request, res: Response) => {
    const usecase = new CreateCustomerUseCase(new CustomerRepository());

    try {
        const customerDto: InputCreateCustomerDto = {
            name: req.body.name,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                number: req.body.address.number,
                zip: req.body.address.zip
            }
        }

        const output: OutputCreateCustomerDto = await usecase.execute(customerDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

customerRoute.get("/", async (req: Request, res: Response) => {
    const usecase = new ListCustomerUseCase(new CustomerRepository());

    try {
        const output: OutputListCustomerDto = await usecase.execute({});
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});