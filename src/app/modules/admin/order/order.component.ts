import { Component, ViewChild } from '@angular/core';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { Order } from '../models/order';
import { FilterModel } from '../models/filter-model';
import { ToasterService } from '../../../common/services/toaster.service';
import { AdminService } from '../service/admin.service';
import { orderStatus } from '../../../common/constants/order-status';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  @ViewChild('dt1') dt1: Table | undefined;
  orders!: Order[];

  orderStatuses = [
    orderStatus.Status_Approved,
    orderStatus.Status_Canceled,
    orderStatus.Status_Delivered,
    orderStatus.Status_Pending,
    orderStatus.Status_Processing,
    orderStatus.Status_Refunded,
    orderStatus.Status_Rejected,
    orderStatus.Status_Returned,
    orderStatus.Status_Shipped];

  totalRecords!: number;
  filterModel: FilterModel = {};

  selectedOrder?: Order;
  OrderForm: FormGroup;

  response$?: Observable<Response>

  constructor(private adminService: AdminService,
    private toasterService: ToasterService, private fb: FormBuilder) {
    this.OrderForm = this.fb.group({
      note: [this.selectedOrder?.note || '', [Validators.required]],
      status: [this.selectedOrder?.status || '']
    });

    this.getData(this.filterModel);

  }

  loadOrders(event: TableLazyLoadEvent) {
    this.filterModel.sortByColumn = event.sortField?.toString();
    this.filterModel.sortOrder = event.sortOrder == 1 ? 'ASC' : 'DESC';
    if (event.rows != undefined && event.first != undefined) {
      this.filterModel.pageSize = event.rows;
      this.filterModel.page = Math.floor(event.first / event.rows) + 1;
    }
    if (this.filterModel) {
      this.getData(this.filterModel);
    }
  }

  loadOrder(order: Order) {
    this.selectedOrder = order;
    this.OrderForm.patchValue({
      note: order?.note || '',
      status: order?.status || '',
    });
  }

  getData(filterModel: FilterModel) {
    this.adminService.getOrders(filterModel).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data.totalRecords > 0) {
          this.orders = response.data.orderDTOs;
          this.totalRecords = response.data.totalRecords;
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

  updateOrder() {
    let newStatus = this.OrderForm.get('status')?.value;
    let note = this.OrderForm.get('note')?.value;
    this.adminService.updateOrder(newStatus, this.selectedOrder?.id || '', note).subscribe(
      response => {
        if (response.isSuccess) {
          this.toasterService.showSuccess(response.message);
          this.getData(this.filterModel);
        }
        else {
          this.toasterService.showError(response.message);
        }
      },
      err => {
        this.toasterService.showError(err.message);
      }
    );

    this.onReset();
  }


  onReset() {
    this.OrderForm.patchValue({
      note: this.selectedOrder?.note || '',
      status: this.selectedOrder?.status || '',
    });
  }
}
