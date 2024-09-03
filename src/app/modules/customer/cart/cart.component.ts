import { Component, OnInit } from '@angular/core';

import { CartResponse } from '../models/cart-response';
import { CustomerService } from '../services/customer.service';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../models/user.model';
import { CartRequest } from '../models/cart-request';
import { ProductResponse } from '../models/product-response';
import { ToasterService } from '../../../common/services/toaster.service';
import { StripeRequest } from '../models/stripe-request';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartRequest: CartRequest = {
    userId: "",
    productId: "",
    productCount: 0,
  };
  cartItems: CartResponse[] = [];
  cartTotal: number = 0;
  totalQuantity: number = 0;

  selectedProduct?: ProductResponse;

  user?: User;
  userId?: string;

  constructor(private customerService: CustomerService, private authService: AuthService, 
    private toasteService: ToasterService, private router: Router) {
    this.user = authService.getUser();
    this.userId = this.user?.id;
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    if (this.userId) {
      this.cartRequest.userId = this.userId;
      this.customerService.getCart(this.userId).subscribe(response => {
        if (response.isSuccess && response.data) {
          this.cartItems = response.data;
          this.calculateTotals();
        }
      });
    }
  }

  incrementQuantity(cartItem: CartResponse): void {
    this.cartRequest.productCount =  1;
    this.cartRequest.productId = cartItem.productId;

    this.customerService.updateCart(this.cartRequest).subscribe(response => {
      if (response.isSuccess && response.data) {
        const index = this.cartItems.findIndex(item => item.id === cartItem.id);
        if (index !== -1) {
          this.cartItems[index] = response.data;
          this.calculateTotals();
        }
        cartItem = response.data;
        this.calculateTotals();
      }
      else{
        this.toasteService.showError(response.message)
      }
    });
  }

  decrementQuantity(cartItem: CartResponse): void {
    if (cartItem.productCount > 1) {
      this.cartRequest.productCount = -1;
      this.cartRequest.productId = cartItem.productId;

      this.customerService.updateCart(this.cartRequest).subscribe(response => {
        if (response.isSuccess && response.data) {
          const index = this.cartItems.findIndex(item => item.id === cartItem.id);
          if (index !== -1) {
            this.cartItems[index] = response.data;
            this.calculateTotals();
          }
        }
        else{
          this.toasteService.showError(response.message)
        }
      });
    }
  }

  clearCart(): void {
    if (this.userId) {
      this.customerService.emptyCart(this.userId).subscribe(response => {
        if (response.isSuccess) {
          this.cartItems = [];
          this.cartTotal = 0;
          this.totalQuantity = 0;
        }
      });
    }
  }

  deleteCartItem(id: string){
    this.customerService.deleteCartItem(id).subscribe(response => {
      if (response.isSuccess) {
        this.cartItems = this.cartItems.filter(item => item.id !== id);
        this.calculateTotals();
      }
    });
  }

  private calculateTotals(): void {
    this.cartTotal = this.cartItems.reduce((total, item) => item.product ? (total + (item.product.productPrice * item.productCount)) : 0, 0);
    this.totalQuantity = this.cartItems.reduce((total, item) => total + item.productCount, 0);
  }

  createOrder():void{
    if(this.cartItems.length > 0){
      // Create Order
      this.customerService.createOrder(this.cartItems).subscribe(
        response => {
          if(response.isSuccess && response.data){
            var stripeRequest: StripeRequest ={
              approvedUrl: environment.ecomBaseUrl + "/customer/order",
              cancelUrl: environment.ecomBaseUrl + "/customer/cart",
              order: response.data
            };

            // Create Payment Session
            this.customerService.createPaymentSession(stripeRequest).subscribe(
              response => {
                if(response.isSuccess && response.data){
                  window.location.href = response.data.stripeSessionUrl;
                }
                else{
                  this.toasteService.showError(response.message);
                }
              },
              error => {
                this.toasteService.showError(error.message);
              }
            )
          }
          else{
            this.toasteService.showError(response.message);
          }
        },
        err => {
          this.toasteService.showError(err.message);
        }
      )
    }
  }
}
