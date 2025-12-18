export interface CreateProductLineItemDto {
    id: string;
    barCodeId: string;
    productId: string;
    cost: number;
    displayPrice: number;
    discountedPrice: number;
}