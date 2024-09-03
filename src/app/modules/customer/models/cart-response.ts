import { ProductResponse } from "./product-response";
import { User } from "./user.model";

export interface CartResponse{
    id: string;
    userId: string;
    user?: User;
    productId: string;
    product?: ProductResponse;
    productCount: number;
}