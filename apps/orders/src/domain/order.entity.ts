import { Customer, CustomerAttributes } from './customer.entity'
import { OrderStatus } from './enum';

export interface OrderParams {
    id?: string;
    status?: OrderStatus;
    customer: CustomerAttributes;
    totalAmount?: number;
    items: OrderItemParams[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrderItemParams {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    totalAmount?: number;
}

export class OrderItem {
    public readonly productId: string;
    public readonly productName: string;
    public readonly quantity: number;
    public readonly price: number;
    public readonly totalAmount?: number;

    constructor(params: OrderItemParams) {
        this.price = params.price;
        this.productId = params.productId;
        this.productName = params.productName;
        this.quantity = params.quantity;
        this.totalAmount = params?.totalAmount ?? this.price * this.quantity;
    }
}

export class Order {
    public readonly id?: string;
    public readonly status: OrderStatus;
    public readonly customer: Customer;
    public readonly items: OrderItem[];
    public readonly totalAmount: number;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;

    constructor(params: OrderParams) {
        this.id = params.id;
        this.customer = new Customer(params.customer);
        this.status = params?.status ?? OrderStatus.CREATED;
        this.createdAt = !params.createdAt && !this.id ? new Date() : params.createdAt;
        this.updatedAt = !params.updatedAt && !this.updatedAt ? new Date() : params.updatedAt;
        this.items = params.items.map(item => new OrderItem(item));
        this.totalAmount = params?.totalAmount ?? this.items.reduce((acc, item) => acc + item.totalAmount, 0);
    }
}
