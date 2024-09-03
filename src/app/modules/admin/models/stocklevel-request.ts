export interface StockLevelRequest{
    productId: string;
    currentStockItems: number;
    thresholdAmount: number;
    supplierName: string;
    supplierEmail: string;
    lastOrderDate: Date | null;
}