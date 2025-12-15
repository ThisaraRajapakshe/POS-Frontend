import { Product } from "../product/product.model";

export interface ProductLineItem {


    id: string,
    barCodeId: string,
    productId: string;
    cost: number;
    displayPrice: number;
    discountedPrice: number;
    // Navigation properties
    product: Product;

}