import { Order } from "./order.entity";

export interface IOrderRepository {
    create(order: Order): Promise<Order>;
}
