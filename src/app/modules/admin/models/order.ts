import { OrderDetails } from "./order-details";
import { User } from "./user.model";

export interface Order{
    id?: string;
    userId: string;
    user?: User;
    orderAmount: number;
    orderDetails: OrderDetails[];
    status?: string;
    note?: string;
    orderTime: Date;
}