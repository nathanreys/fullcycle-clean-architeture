import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order.repository.interface";
import OrderModel from "./order.model";
import OrderItemModel from "./order_item.model";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity
            })),
        },
            {
                include: [{ model: OrderItemModel }]
            }
        );
    }

    async update(entity: Order): Promise<void> {
        await OrderModel.update(
            {
                customer_id: entity.customerId
            },
            {
                where: { id: entity.id },
            }
        );

        await OrderItemModel.destroy({
            where: { order_id: entity.id },
        });

        await OrderItemModel.bulkCreate(
            entity.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
                order_id: entity.id
            }))
        );        
    }

    async find(id: string): Promise<Order> {
        let orderModel;

        try {
            orderModel = await OrderModel.findOne({
                where: { id },
                include: [{ model: OrderItemModel }],
                rejectOnEmpty: true,
            });
        } catch (error) {
            throw new Error("Order not found");
        }

        const order = new Order(
            orderModel.id,
            orderModel.customer_id,
            orderModel.items.map((item: OrderItemModel) => new OrderItem(
                item.id,
                item.name,
                item.price,
                item.product_id,
                item.quantity
            ))
        );

        return order;
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({
            include: [{ model: OrderItemModel }],
        });

        return orderModels.map((orderModel) => {
            return new Order(
                orderModel.id,
                orderModel.customer_id,
                orderModel.items.map((item: OrderItemModel) => new OrderItem(
                    item.id,
                    item.name,
                    item.price,
                    item.product_id,
                    item.quantity
                ))
            );
        });
    }
}