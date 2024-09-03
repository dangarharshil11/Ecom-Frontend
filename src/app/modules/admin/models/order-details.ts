import { ProductResponse } from "./product-response";

export interface OrderDetails{
    id: string;
    orderId: string;
    productId: string;
    product: ProductResponse;
    productCount: number;
    productUnitPrice: number;
}