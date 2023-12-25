import { IEventProducer, Event } from "@packages/events";
import { IOrderRepository } from "../domain/order.repository";
import { Order } from "../domain/order.entity";
import { IProductRepository, Product } from "../domain/product.repository";
import { CustomerAttributes } from "../domain/customer.entity";
import { ILogger } from "@packages/logger";

export interface CreateOrderInput {
    customer: CustomerAttributes;
    items: {
        productId: string;
        quantity: number;
    }[];
}

export class CreateOrderUseCase {
    private products: Map<string, Product> = new Map();

    constructor(
        private readonly orderRepository: IOrderRepository,
        private readonly eventProducer: IEventProducer,
        private readonly productRepository: IProductRepository,
        private readonly logger: ILogger
    ) {}

    async execute(input: CreateOrderInput): Promise<Order> {
        await this.validate(input);
        const data = this.buildCreateProductInput(input);
        const order = await this.orderRepository.create(new Order(data));
        await this.eventProducer.publish(Event.ORDER_CREATED, order)

        return order;
    }

    private async validate(input: CreateOrderInput): Promise<void> {
        this.logger.info('Validating order', { ...input });
        const { items } =  input;

        for (const item of items) {
            const product = await this.productRepository.findById(item.productId);

            if (!product) {
                const exc = new Error(`Product not found: ${item.productId}`)
                this.logger.error('Product not found', exc, { product: item.productId});
                throw exc ;
            }

            if (product.quantity < item.quantity) {
                const exc = new Error(`Product ${item.productId} has insufficient quantity`);
                this.logger.error('Product has insufficient quantity', exc, {
                    product: item.productId,
                    quantity: product.quantity
                });
                throw exc ;
            }

            if (!product.active) {
                const exc = new Error(`Product ${item.productId} is not active`);
                this.logger.error('Product is not active', exc, { product: item.productId});
                throw exc ;
            }

            this.products.set(item.productId, product);
        }

        this.logger.info('Order validated', { ...input });
    }

    private buildCreateProductInput(input: CreateOrderInput) {
        return {
            customer: input.customer,
            items: input.items.map(item => ({
                ...item,
                productName: this.products.get(item.productId).name,
                price: this.products.get(item.productId).price,
            }))
        }
    }
}
