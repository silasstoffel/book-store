import mongoose, { Model, Schema } from 'mongoose';
import { mongooseSidecar } from '@packages/mongoose-utils';
import { Order, OrderItem } from '../../domain/order.entity';
import { Customer } from '../../domain/customer.entity';

const orderCustomerSchema = new Schema<Customer>({
    id: { type: String, required: false, index: true, sparse: true },
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true, index: true },
}, {
    autoIndex: true,
    timestamps: false,
    _id: false
})

const orderItemSchema = new Schema<OrderItem>({
    productId: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalAmount: { type: Number, required: false },
}, {
    autoIndex: true,
    timestamps: false,
    _id: false
});

const orderSchema = mongooseSidecar(
    new Schema<Order>({
        status: { type: String, required: true, index: true },
        customer: { type: orderCustomerSchema, required: true },
        totalAmount: { type: Number, required: true },
        items: { type: [orderItemSchema], required: true },
    }, {
        autoIndex: true,
        timestamps: true,
    })
);

export default function getOrderModel(): Model<Order> {
    return mongoose.model<Order>('orders', orderSchema)
}
