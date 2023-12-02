import { APIGatewayEvent, Context } from "aws-lambda";
import {
    HttpPathValidatorMiddleware,
    HttpValidatorMiddleware,
    MongooseConnectionMiddleware,
    middify
} from '@packages/middlewares'
import { Logger } from '@packages/logger'
import { httpOk } from '@packages/serverless-response'
import { updateProductSchema, pathUpdateProductSchema } from './schema'
import getProductModel from '../../database/model/product.model';
import { ProductRepository } from '../../database/repository/product.repository';
import { UpdateProductInput } from '../../../use-cases/update/update-product.input';
import { UpdateProductUseCase } from '../../../use-cases/update/update-product.use-case';

const handler = async (event: APIGatewayEvent, context: Context) => {
    const logger = Logger.build({ context });
    const id = event.pathParameters?.product
    logger.info('Updating product' , { product: id });
    const payload = updateProductSchema.parse(JSON.parse(event.body || '{}'))
    const repository = new ProductRepository(getProductModel(), logger)
    const useCase = new UpdateProductUseCase(repository)
    const product = await useCase.execute('', payload as UpdateProductInput)
    logger.info('Product updated', { product: id })

    return httpOk(product);
};

export const main = middify(handler)
    .use(HttpPathValidatorMiddleware(pathUpdateProductSchema))
    .use(HttpValidatorMiddleware(updateProductSchema))
    .use(MongooseConnectionMiddleware())
