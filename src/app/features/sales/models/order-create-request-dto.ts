export interface OrderCreateRequestDto {
    totalAmount: number;
    paymentMethod: string;
    isPending: boolean;
    orderItems: OrderRequestItemDto[];
}

export interface OrderRequestItemDto {
    productLineItemId: string;
    salesPrice: number;
    quantity: number;
}