import { APIGatewayEvent, Context } from "aws-lambda";
import middy from '@middy/core'
import { HttpValidatorMiddleware, MongooseConnectionMiddleware } from '@packages/middlewares'
import { Logger } from '@packages/logger'
import { createProductSchema } from './schema'
import mongoose, { Schema } from 'mongoose';
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
    })
);

const handler = async (event: APIGatewayEvent, context: Context) => {
    const logger = Logger.build({ context });
    logger.info('Creating product');
    const productModel = mongoose.model<Product>('products', productSchema)
    const payload = createProductSchema.parse(JSON.parse(event.body) || {})
    const product = await productModel.create(payload)
    logger.info('Product created', { product: product.id })

    return { statusCode: 201, body: JSON.stringify(product) }
};

export const main = middy(handler)
    .use(MongooseConnectionMiddleware())
    .use(HttpValidatorMiddleware(createProductSchema))
