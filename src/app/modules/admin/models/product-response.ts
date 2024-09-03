import { CategoryResponse } from "./category-response";

export interface ProductResponse{
    id: string;
    productName: string;
    productDescription: string;
    productPrice: number;
    categoryId: string;
    productBrandName: string;
    imageRepresentationBase64: string;
    createdDate: Date;
    category: CategoryResponse;
    stockItems?: number | null;
}