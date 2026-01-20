export interface OrderItemResponseDto {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
}

export interface OrderResponseDto {
    id: string;
    orderNumber: string;
    orderDate: string;
    totalAmount: number;
    paymentMethod: string;
    status: string;
    cashierName: string;
    orderItems: OrderItemResponseDto[];
}
