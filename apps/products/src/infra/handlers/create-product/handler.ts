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
        timestamps: true,
        _id: false,
    })
);

const handler = async (event: APIGatewayEvent, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false
    const logger = Logger.build({ context });

    const cnx = mongoose.createConnection(String(process.env.MONGO_URI), {
        serverSelectionTimeoutMS: 30000,
    });

    await cnx.asPromise();
    logger.info('Creating product');
    const productModel = cnx.model<Product>('products', productSchema)
    const payload = createProductSchema.parse(JSON.parse(event.body) || {})
    const product = await productModel.create(payload)
    logger.info('Product created', { product: product.id })

    return { statusCode: 201, body: JSON.stringify(product) }
};

export const main = middy(handler)
    //.use(MongooseConnectionMiddleware())
    .use(HttpValidatorMiddleware(createProductSchema))
