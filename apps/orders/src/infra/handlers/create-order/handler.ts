import { APIGatewayEvent, Context } from 'aws-lambda';
import { HttpValidatorMiddleware, MongooseConnectionMiddleware, middify } from '@packages/middlewares'
import { Logger } from '@packages/logger'
import { SDK } from '@packages/sdk';
import { httpCreated } from '@packages/serverless-response'
import { createOrderSchema } from './schema'
import { EventProducer } from '@packages/events';
import { CreateOrderUseCase, CreateOrderInput } from '../../../use-cases/create-order.use-case';
import { OrderRepository } from '../../database/order.repository';
import getOrderModel from '../../database/order.model';
import { ProductRepository } from '../../lambda/product.repository';

const handler = async (event: APIGatewayEvent, context: Context) => {
    const logger = Logger.build({ context });
    logger.info('Creating order');

    const payload = createOrderSchema.parse(JSON.parse(event.body || '{}'))

    const createOrder = new CreateOrderUseCase(
        new OrderRepository(getOrderModel(), logger),
        new EventProducer(logger),
        new ProductRepository(new SDK(logger)),
        logger
    )
    const order = await createOrder.execute(payload as CreateOrderInput)

    logger.info('Order created', { order: order.id })

    return httpCreated(order);
};

export const main = middify(handler)
    .use(HttpValidatorMiddleware(createOrderSchema))
    .use(MongooseConnectionMiddleware())
