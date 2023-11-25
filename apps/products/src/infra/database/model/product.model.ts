import mongoose, { model, Schema } from 'mongoose';
import { mongooseSidecar } from '@packages/mongoose-sidecar';
import { Product } from '../../../domain/product.entity';
import { ProductCategory } from '../../../domain/enum';

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

export default mongoose.connection.model<Product>('products', productSchema);
