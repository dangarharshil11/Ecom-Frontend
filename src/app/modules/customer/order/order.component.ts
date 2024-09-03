import { Component } from '@angular/core';

import { Order } from '../models/order';
import { ToasterService } from '../../../common/services/toaster.service';
import { orderStatus } from '../../../common/constants/order-status';
import { CustomerService } from '../services/customer.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  orders!: Order[];
  totalRecords!: number;
  selectedOrder?: Order;
  userId: string;

  constructor(private customerService: CustomerService,
    private toasterService: ToasterService, private authService: AuthService) {
    this.userId = authService.getUser()?.id || '';
    this.getData();
  }

  getData() {
    if (this.userId != '') {
      this.customerService.getOrdersByUserId(this.userId).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.orders = response.data;
            this.totalRecords = this.orders.length;
          }
          else {
            this.orders = [];
          }
        },
        error: (err) => {
          this.toasterService.showError(err.message);
        }
      });
    }
  }

  cancelOrder() {
    this.customerService.updateOrder(orderStatus.Status_Canceled, this.selectedOrder?.id || '', "Order Canceled By the Customer.").subscribe(
      response => {
        if (response.isSuccess) {
          this.toasterService.showSuccess(response.message);
          this.getData();
        }
        else {
          this.toasterService.showError(response.message);
        }
      },
      err => {
        this.toasterService.showError(err.message);
      }
    );
  }
}
