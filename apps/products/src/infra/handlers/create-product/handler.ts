import { APIGatewayEvent, Context } from "aws-lambda";
import middy from '@middy/core'
import { HttpValidatorMiddleware, MongooseConnectionMiddleware } from '@packages/middlewares'
import { Logger } from '@packages/logger'
import { createProductSchema } from './schema'
import { ProductRepository } from "../../database/repository/product.repository";
import { CreateProductUseCase } from "../../../use-cases/create/create-product.use-case";
import { CreateProductInput } from "../../../use-cases/create/create-product.input";

const handler = async (event: APIGatewayEvent, context: Context) => {
    const logger = Logger.build({ context });
    logger.info('Creating product');

    const payload = createProductSchema.parse(event.body)
    const useCase = new CreateProductUseCase(new ProductRepository())
    const product = await useCase.execute(payload as CreateProductInput)

    logger.info('Product created', { product: product.id })

    return { statusCode: 201, body: JSON.stringify(product) }
};

export const main = middy(handler)
    .use(MongooseConnectionMiddleware())
    .use(HttpValidatorMiddleware(createProductSchema))
