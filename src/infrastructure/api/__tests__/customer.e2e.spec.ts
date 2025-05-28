import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for customer API", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John Doe",
                address: {
                    street: "Street",
                    city: "City",
                    number: 1,
                    zip: "12345",
                }
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("John Doe");
        expect(response.body.address.street).toBe("Street");
        expect(response.body.address.city).toBe("City");
        expect(response.body.address.number).toBe(1);
        expect(response.body.address.zip).toBe("12345");
    });

    it("should not create a customer", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John Doe",
            })

        expect(response.status).toBe(500);
    });

    it("should list all customers", async () => {
        const response1 = await request(app)
            .post("/customer")
            .send({
                name: "John Doe",
                address: {
                    street: "Street",
                    city: "City",
                    number: 1,
                    zip: "12345",
                }
            });

        expect(response1.status).toBe(200);

        const response2 = await request(app)
            .post("/customer")
            .send({
                name: "John Doe 2",
                address: {
                    street: "Street 2",
                    city: "City",
                    number: 2,
                    zip: "12345",
                }
            });

        expect(response2.status).toBe(200);

        const listResponse = await request(app).get("/customer").send();

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.customers.length).toBe(2);

        const customerReturned1 = listResponse.body.customers[0];
        const customerReturned2 = listResponse.body.customers[1];

        expect(customerReturned1.name).toBe("John Doe");
        expect(customerReturned1.address.street).toBe("Street");
        expect(customerReturned2.name).toBe("John Doe 2");
        expect(customerReturned2.address.street).toBe("Street 2");
    });
});