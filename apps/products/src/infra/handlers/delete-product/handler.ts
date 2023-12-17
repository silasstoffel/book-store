import { APIGatewayEvent, Context } from "aws-lambda";
import {
    HttpPathValidatorMiddleware,
    MongooseConnectionMiddleware,
    middify
} from '@packages/middlewares'
import { Logger } from '@packages/logger'
import { httpEmpty } from '@packages/serverless-response'
import { pathGetProductSchema } from './schema'
import getProductModel from '../../database/model/product.model';
import { ProductRepository } from '../../database/repository/product.repository';
import { DeleteProductUseCase } from '../../../use-cases/delete/delete-product.use-case';
import { EventProducer } from "@packages/events";

const handler = async (event: APIGatewayEvent, context: Context) => {
    const logger = Logger.build({ context });
    const product = event.pathParameters?.product;

    logger.info('Deleting product', { product });
    const useCase = new DeleteProductUseCase(
        new ProductRepository(getProductModel(), logger),
        new EventProducer(logger)
    )
    await useCase.execute(product)
    logger.info('Product deleted', { product })

    return httpEmpty();
};

export const main = middify(handler)
    .use(HttpPathValidatorMiddleware(pathGetProductSchema))
    .use(MongooseConnectionMiddleware())
