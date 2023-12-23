import { IEventProducer, Event } from "@packages/events";
import { IOrderRepository } from "../domain/order.repository";
import { Order } from "../domain/order.entity";
import { CreateOrderInput } from "./create-order.input";

export class CreateOrderUseCase {
    constructor(
        private readonly orderRepository: IOrderRepository,
        private readonly eventProducer: IEventProducer
    ) {}

    async execute(input: CreateOrderInput): Promise<Order> {
        const order = await this.orderRepository.create(new Order(input));
        await this.eventProducer.publish(Event.ORDER_CREATED, order)

        return order;
    }
}
