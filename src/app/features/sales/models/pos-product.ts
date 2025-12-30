export interface PosProduct {
    lineItemId: string;     // Needed to track inventory
    name: string;           // Flattened: Product Name
    barcode: string;        // From LineItem
    displayPrice: number;   // From LineItem
    salePrice: number;      // From LineItem
    stock: number;          // From LineItem.Quantity
}