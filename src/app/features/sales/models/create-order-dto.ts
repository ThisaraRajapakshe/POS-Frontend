import { OrderItemDto } from "./order-Item-dto";

export interface CreateOrderDto {
    totalAmount: number;
    paymentMethod: PaymentMethods;
    isPending: boolean;    
    orderItems: OrderItemDto[];
}
export enum PaymentMethods {
    CASH = 'Cash',
    CARD_PAYMENT = 'Card Payment',
    CREDIT = 'Credit',
}