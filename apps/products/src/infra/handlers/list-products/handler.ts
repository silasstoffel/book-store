import { APIGatewayEvent, Context } from "aws-lambda";
import {
    HttpQueryStringValidatorMiddleware,
    MongooseConnectionMiddleware,
    middify
} from '@packages/middlewares'
import { Logger } from '@packages/logger'
import { httpOk } from '@packages/serverless-response'
import { queryStringListProductSchema } from './schema'
import getProductModel from '../../database/model/product.model';
import { ProductRepository } from '../../database/repository/product.repository';
import { ListProductsUseCase } from '../../../use-cases/list/list-products.use-case';

const handler = async (event: APIGatewayEvent, context: Context) => {
    const logger = Logger.build({ context });

    logger.info('Listing products information');
    const useCase = new ListProductsUseCase(new ProductRepository(getProductModel(), logger))
    const params = queryStringListProductSchema.parse(event.queryStringParameters)
    const record = await useCase.execute(params)
    logger.info('Listing products information')

    return httpOk(record);
};

export const main = middify(handler)
    .use(HttpQueryStringValidatorMiddleware(queryStringListProductSchema))
    .use(MongooseConnectionMiddleware())
