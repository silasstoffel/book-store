import { APIGatewayEvent, Context } from "aws-lambda";
import {
    HttpPathValidatorMiddleware,
    MongooseConnectionMiddleware,
    middify
} from '@packages/middlewares'
import { Logger } from '@packages/logger'
import { httpOk } from '@packages/serverless-response'
import { pathGetProductSchema } from './schema'
import getProductModel from '../../database/model/product.model';
import { ProductRepository } from '../../database/repository/product.repository';
import { GetProductByIdUseCase } from '../../../use-cases/get-by-id/get-product-by-id.use-case';

const handler = async (event: APIGatewayEvent, context: Context) => {
    const logger = Logger.build({ context });
    const product = event.pathParameters?.product;

    logger.info('Getting product information', { product });
    const useCase = new GetProductByIdUseCase(new ProductRepository(getProductModel()))
    const record = await useCase.execute(product)
    logger.info('Got product information', { product })

    return httpOk(record);
};

export const main = middify(handler)
    .use(HttpPathValidatorMiddleware(pathGetProductSchema))
    .use(MongooseConnectionMiddleware())
