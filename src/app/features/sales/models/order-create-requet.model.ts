export interface OrderCreateRequest {
    totalAmount: number;
    paymentMethod: string;
    isPending: boolean;
    orderItems: OrderRequestItem[];
}

export interface OrderRequestItem {
    productLineItemId: string;
    salesPrice: number;
    quantity: number;
}