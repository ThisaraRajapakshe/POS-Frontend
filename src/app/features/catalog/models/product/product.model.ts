import { Category } from "../category/category.model";

export interface Product {
    id: string;
    name: string;
    category: Category
}