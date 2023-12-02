import { APIGatewayEvent, Context } from "aws-lambda";
import { HttpValidatorMiddleware, MongooseConnectionMiddleware, middify } from '@packages/middlewares'
import { Logger } from '@packages/logger'
import { httpCreated } from '@packages/serverless-response'
import { createProductSchema } from './schema'
import getProductModel from '../../database/model/product.model';
import { ProductRepository } from '../../database/repository/product.repository';
import { CreateProductUseCase } from '../../../use-cases/create/create-product.use-case';
import { CreateProductInput } from '../../../use-cases/create/create-product.input';

const handler = async (event: APIGatewayEvent, context: Context) => {
    const logger = Logger.build({ context });
    logger.info('Creating product');
    const payload = createProductSchema.parse(JSON.parse(event.body || '{}'))
    const repository = new ProductRepository(getProductModel(), logger)
    const useCase = new CreateProductUseCase(repository)
    const product = await useCase.execute(payload as CreateProductInput)
    logger.info('Product created', { product: product.id })

    return httpCreated(product);
};

export const main = middify(handler)
    .use(HttpValidatorMiddleware(createProductSchema))
    .use(MongooseConnectionMiddleware())
