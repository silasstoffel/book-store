import { Model } from "mongoose";
import { Order } from "../../domain/order.entity";
import { IOrderRepository } from "../../domain/order.repository";
import { ILogger } from "@packages/logger";
import { UnknownException } from '@package/exceptions';

export class OrderRepository implements IOrderRepository {
    constructor(
        private readonly model: Model<Order>,
        private readonly logger: ILogger
    ) {}

    async create(order: Order): Promise<Order> {
        try {
            const result = await this.model.create(order);
            return new Order(result);
        } catch (error) {
            this.logger.error('Error creating order', error as Error, { ...order });
            throw new UnknownException();
        }
    }
}
