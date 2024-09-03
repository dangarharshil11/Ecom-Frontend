import { Order } from "./order";

export interface StripeRequest{
    stripeSessionUrl? : string;
    stripeSessionId?: string;
    approvedUrl: string;
    cancelUrl: string;
    order?: Order;
}