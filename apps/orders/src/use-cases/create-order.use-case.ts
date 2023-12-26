import { IEventProducer, Event } from "@packages/events";
import { IOrderRepository } from "../domain/order.repository";
import { Order } from "../domain/order.entity";
import { IProductRepository, Product } from "../domain/product.repository";
import { CustomerAttributes } from "../domain/customer.entity";
import { ILogger } from "@packages/logger";
import { InactiveProductException, ProductNotFoundException, UnavailableQuantityRequestedException } from "../domain/exceptions";

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
            this.logger.info('Getting product information', { product: item.productId });
            const product = await this.productRepository.findById(item.productId);
            this.logger.info('Got product information', { ...product });
            if (!product) {
                const exc = new ProductNotFoundException(item.productId)
                this.logger.error('Product not found', exc, { product: item.productId});
                throw exc ;
            }

            if (product.quantity < item.quantity) {
                const exc = new UnavailableQuantityRequestedException(product.quantity);
                this.logger.warn('Product has insufficient quantity', {
                    product,
                    quantityRequested: item.quantity
                });
                throw exc ;
            }

            if (!product.active) {
                const exc = new InactiveProductException(item.productId);
                this.logger.warn('Product is inactive.', { ...product });
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
