import { ProductResponse } from "./product-response";

export interface StockLevelResponse{
    id: string;
    productId: string;
    product: ProductResponse;
    currentStockItems: number;
    thresholdAmount: number;
    supplierName: string;
    supplierEmail: string;
    lastOrderDate: Date | null;
    lastEmailSentDate: Date | null;
}