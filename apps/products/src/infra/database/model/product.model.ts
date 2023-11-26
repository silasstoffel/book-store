import { Model, Schema } from 'mongoose';
import { mongooseSidecar } from '@packages/mongoose-sidecar';
import { Product } from '../../../domain/product.entity';
import { ProductCategory } from '../../../domain/enum';
import mongoose from 'mongoose';

const productSchema = mongooseSidecar(
    new Schema<Product>({
        name: { type: String, required: true, index: { unique: true } },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        category: { type: String, enum: ProductCategory, required: false, index: true, sparse: true },
    }, {
        autoIndex: true,
        timestamps: true,
    })
);

export default function getProductModel(): Model<Product> {
    return mongoose.model<Product>('products', productSchema)
}
