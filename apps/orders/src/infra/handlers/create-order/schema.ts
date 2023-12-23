import { z } from 'zod';
import { OrderStatus } from '../../../domain/enum';

export const orderItemSchema = z.object({
  productId: z.string().min(26),
  productName: z.string().min(3),
  quantity: z.number().positive(),
  price: z.number().positive(),
  totalAmount: z.number().optional(),
});

export const customerSchema = z.object({
  id: z.string().min(26).optional(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().min(10),
});

export const createOrderSchema = z.object({
  id: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional().default(OrderStatus.CREATED),
  customer: customerSchema,
  totalAmount: z.number().optional(),
  items: z.array(orderItemSchema),
  createdAt: z.date().optional(),
});

export type OrderItemSchema = z.infer<typeof orderItemSchema>;
export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
export type CustomerSchema = z.infer<typeof customerSchema>;
