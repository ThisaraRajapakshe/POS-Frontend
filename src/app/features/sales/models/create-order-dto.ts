import { OrderItemDto } from "./order-Item-dto";

export interface CreateOrderDto {
    totalAmount: number;
    paymentMethod: string;
    isPending: boolean;
    orderItems: OrderItemDto[];
}