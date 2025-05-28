import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product API", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
                price: 100,
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Product 1");
        expect(response.body.price).toBe(100);
    });

    it("should not create a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                price: 1.99,
            });

        expect(response.status).toBe(500);
    });

    it("should list all products", async () => {
        const response1 = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
                price: 1.99,
            });

        expect(response1.status).toBe(200);

        const response2 = await request(app)
            .post("/product")
            .send({
                name: "Product 2",
                price: 2.99,
            });

        expect(response2.status).toBe(200);

        const responseList = await request(app).get("/product").send();

        expect(responseList.status).toBe(200);
        expect(responseList.body.products.length).toBe(2);

        expect(responseList.body.products[0].name).toBe("Product 1");
        expect(responseList.body.products[1].name).toBe("Product 2");
        expect(responseList.body.products[0].price).toBe(1.99);
        expect(responseList.body.products[1].price).toBe(2.99);
    });

    it("should find a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
                price: 1.99,
            });

        expect(response.status).toBe(200);

        const responseFind = await request(app)
            .get(`/product/${response.body.id}`)
            .send();

        expect(responseFind.status).toBe(200);
        expect(responseFind.body.name).toBe("Product 1");
        expect(responseFind.body.price).toBe(1.99);
    });
});