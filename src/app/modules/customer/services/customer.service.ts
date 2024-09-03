import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Response } from '../models/response-model';
import { apiRoutes } from '../../../common/constants/api-routes';
import { CartRequest } from '../models/cart-request';
import { CartResponse } from '../models/cart-response';
import { StripeRequest } from '../models/stripe-request';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  // Cart Requests
  getCart(userId: string): Observable<Response>{
    return this.http.get<Response>(apiRoutes.getCart + `${userId}?addAuth=true`);
  }

  updateCart(request: CartRequest): Observable<Response>{
    return this.http.post<Response>(apiRoutes.updateCart, request);
  }

  deleteCartItem(id: string): Observable<Response>{
    return this.http.delete<Response>(apiRoutes.deletCartItem + `${id}?addAuth=true`);
  }

  emptyCart(userId: string): Observable<Response>{
    return this.http.get<Response>(apiRoutes.emptyCart + `${userId}?addAuth=true`);
  }

  // Order Request
  createOrder(request: CartResponse[]): Observable<Response>{
    return this.http.post<Response>(apiRoutes.createOrder, request);
  }

  createPaymentSession(request: StripeRequest): Observable<Response>{
    return this.http.post<Response>(apiRoutes.createPaymentSession, request);
  }

  validatePayment(orderId: string): Observable<Response>{
    return this.http.get<Response>(apiRoutes.validatePayment + `${orderId}?addAuth=true`);
  }

  getOrder(orderId: string): Observable<Response>{
    return this.http.get<Response>(apiRoutes.getOrder + `${orderId}?addAuth=true`);
  }

  getOrdersByUserId(userId: string): Observable<Response>{
    return this.http.get<Response>(apiRoutes.getOrdersByUserId + `${userId}?addAuth=true`);
  }
  
  updateOrder(newStatus: string, orderId: string, note: string): Observable<Response>{
    return this.http.post<Response>(apiRoutes.updateOrder , {orderId: orderId, note: note, status: newStatus});
  }
}
