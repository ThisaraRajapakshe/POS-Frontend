import { CategoryDto } from "../category/category-dto";

export interface ProductDto {
    id: string;
    name: string;
    category: CategoryDto
}
