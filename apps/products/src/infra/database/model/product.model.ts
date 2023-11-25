import { Model, Schema } from 'mongoose';
import { MongooseConnectionManager } from '@packages/mongoose-sidecar';
import { mongooseSidecar } from '@packages/mongoose-sidecar';
import { Product } from '../../../domain/product.entity';
import { ProductCategory } from '../../../domain/enum';
import { get } from 'http';

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

export default function getProductModel(): Model<Product> {
    return MongooseConnectionManager
    .getConnection()
    .model<Product>('products', productSchema)
}

