import { Product } from "./product.model";

export interface ProductLineItem{
    
  
    id: string,
    barcodeId: string,
    productId: string;
    cost : number;
    displayPrice: number;
    discountedPrice: number;
    // Navigation properties
    product : Product;

}