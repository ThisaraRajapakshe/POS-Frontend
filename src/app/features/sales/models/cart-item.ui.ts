export interface CartItem {
    lineItemId: string;
    productName: string;
    barcode: string;
    quantity: number;
    price: number;
    subTotal: number;
    maxStock: number;

}
