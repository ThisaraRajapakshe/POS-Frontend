import { ProductDto } from "../product/product-dto";

export interface ProductLineItemDto {
    id: string;
    barCodeId: string;
    productId: string;
    cost: number;
    displayPrice: number;
    discountedPrice: number;
    quantity: number;
    product: ProductDto;
}