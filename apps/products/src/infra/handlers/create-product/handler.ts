import { APIGatewayEvent, Context } from "aws-lambda";
import middy from '@middy/core'
import { HttpValidatorMiddleware, MongooseConnectionMiddleware } from '@packages/middlewares'
import { Logger } from '@packages/logger'
import { createProductSchema } from './schema'
import { ProductRepository } from "../../database/repository/product.repository";
import { CreateProductUseCase } from "../../../use-cases/create/create-product.use-case";
import { CreateProductInput } from "../../../use-cases/create/create-product.input";

import mongoose, { Connection, Schema } from 'mongoose';
import { ProductCategory } from "../../../domain/enum";
import { mongooseSidecar } from "@packages/mongoose-sidecar";
import { Product } from "../../../domain/product.entity";

const productSchema = mongooseSidecar(
    new Schema<Product>({
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        category: { type: String, enum: ProductCategory, required: false },
    }, {
        autoIndex: true,
        timestamps: true,
        _id: false,
    })
);

const handler = async (event: APIGatewayEvent, context: Context) => {
    const logger = Logger.build({ context });
    logger.info('Creating product');
    const activeConnection: Connection = mongoose.connection
    const productModel = activeConnection.model<Product>('products', productSchema)
    const payload = createProductSchema.parse(event.body)
    const useCase = new CreateProductUseCase(
        new ProductRepository(productModel)
    )
    const product = await useCase.execute(payload as CreateProductInput)

    logger.info('Product created', { product: product.id })

    return { statusCode: 201, body: JSON.stringify(product) }
};

export const main = middy(handler)
    .use(MongooseConnectionMiddleware())
    .use(HttpValidatorMiddleware(createProductSchema))
