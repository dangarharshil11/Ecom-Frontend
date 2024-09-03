import { Component, ViewChild } from '@angular/core';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { FilterModel } from '../models/filter-model';
import { AdminService } from '../service/admin.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { Response } from '../models/response-model';
import { StockLevelResponse } from '../models/stock-level-response';
import { StockLevelRequest } from '../models/stocklevel-request';

@Component({
  selector: 'stocklevel',
  templateUrl: './stocklevel.component.html',
  styleUrls: ['./stocklevel.component.css']
})
export class StocklevelComponent {
  @ViewChild('dt1') dt1: Table | undefined;
  
  totalRecords!: number;
  filterModel: FilterModel = {};
  response$?: Observable<Response>
  
  selectedInventory: any;
  InventoryForm: FormGroup;
  Inventory!: StockLevelRequest;
  inventories!: StockLevelResponse[];
  
  products: string[] = [];
  productMap: Map<string, string> = new Map<string, string>();
  
  OrderForm: FormGroup;

  isEditing: boolean = false;

  constructor(private adminService: AdminService, private toasterService: ToasterService, private fb: FormBuilder) {
    this.InventoryForm = this.fb.group({
      productName: [this.selectedInventory?.productName, [Validators.required]],
      currentStockItems: [this.selectedInventory?.currentStockItems, [Validators.required, Validators.min(0)]],
      thresholdAmount: [this.selectedInventory?.thresholdAmount, [Validators.required, Validators.min(1)]],
      supplierName: [this.selectedInventory?.supplierName, [Validators.required, Validators.minLength(3)]],
      supplierEmail: [this.selectedInventory?.supplierEmail, [Validators.required, Validators.email]],
    });

    this.OrderForm = this.fb.group({
      quantity: [0, [Validators.required, Validators.min(1)]],
    });

    this.adminService.getProductList().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.products = Object.values(response.data);
          this.productMap = new Map<string, string>(Object.entries(response.data));
        }
      },
      error: (err) => {
        this.toasterService.showError(err.message);
      }
    });

    this.getData(this.filterModel);
  }

  // Function to get ID based on producty name
  getIdByValue(value: string): string | undefined {
    for (const [key, val] of this.productMap.entries()) {
      if (val === value) {
        return key;
      }
    }
    return undefined; // Return undefined if value is not found
  }

  loadInventories(event: TableLazyLoadEvent) {
    this.filterModel.sortByColumn = event.sortField?.toString();
    this.filterModel.sortOrder = event.sortOrder == 1 ? 'ASC' : 'DESC';
    if (event.rows != null && event.first != null) {
      this.filterModel.pageSize = event.rows;
      this.filterModel.page = Math.floor(event.first / event.rows) + 1;
    }

    if (this.filterModel) {
      this.getData(this.filterModel);
    }
  }

  getData(filterModel: FilterModel) {
    this.adminService.getStockLevels(filterModel).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.inventories = response.data.stockLevels;
          this.totalRecords = response.data.totalRecords;
        }
        else {
          this.products = [];
        }
      },
      error: (err) => {
        this.toasterService.showError(err.message);
      }
    });
  }

  onOrderSubmit() {
    this.Inventory = {
      productId: this.selectedInventory.productId,
      currentStockItems: this.selectedInventory.currentStockItems + this.OrderForm.get('quantity')?.value,
      thresholdAmount: this.selectedInventory.thresholdAmount,
      supplierName: this.selectedInventory.supplierName,
      supplierEmail: this.selectedInventory.supplierEmail,
      lastOrderDate: new Date()
    }

    this.response$ = this.adminService.updateStockLevel(this.Inventory, this.selectedInventory.id);
    this.OrderForm.reset();
    this.response$.subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toasterService.showSuccess("Order Placed Successfully.");
          this.getData(this.filterModel);
        }
        else {
          this.toasterService.showError(response.message);
        }
      },
      error: (error) => {
        this.toasterService.showError(error.message);
      }
    });
  }

  onSubmit(isEditing: boolean) {
    this.Inventory = {
      productId: this.getIdByValue(this.InventoryForm.get('productName')?.value) || '',
      currentStockItems: this.InventoryForm.get('currentStockItems')?.value,
      thresholdAmount: this.InventoryForm.get('thresholdAmount')?.value,
      supplierName: this.InventoryForm.get('supplierName')?.value,
      supplierEmail: this.InventoryForm.get('supplierEmail')?.value,
      lastOrderDate: null
    }

    if (isEditing) {
      this.response$ = this.adminService.updateStockLevel(this.Inventory, this.selectedInventory.id);
      this.onReset(this.isEditing);
      this.response$.subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.toasterService.showSuccess("Stock Updated Successfully.");
            this.getData(this.filterModel);
          }
          else {
            this.toasterService.showError(response.message);
          }
        },
        error: (error) => {
          this.toasterService.showError(error.message);
        }
      });
    }
    else {
      this.response$ = this.adminService.createStockLevel(this.Inventory);
      this.onReset(this.isEditing);
      this.response$.subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.toasterService.showSuccess("Stock Created Successfully.");
            this.getData(this.filterModel);
          }
          else {
            this.toasterService.showError(response.message);
          }
        },
        error: (error) => {
          this.toasterService.showError(error.message);
        }
      });
    }
  }

  loadInventory(inventory: StockLevelResponse) {
    this.InventoryForm.patchValue({
      productName: inventory.product.productName,
      currentStockItems: inventory.currentStockItems,
      thresholdAmount: inventory.thresholdAmount,
      supplierName: inventory.supplierName,
      supplierEmail: inventory.supplierEmail
    });
    this.selectedInventory = inventory;
  }

  onDelete(id: string) {
    this.response$ = this.adminService.deleteStockLevel(id);

    this.response$.subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toasterService.showSuccess("Stock Deleted Successfully.");
          this.getData(this.filterModel);
        }
        else {
          this.toasterService.showError(response.message);
        }
      },
      error: (error) => {
        this.toasterService.showError(error.message);
      }
    });
  }

  onReset(isEditing: boolean) {
    this.InventoryForm.reset();
    if (isEditing) {
      if (this.selectedInventory) {
        this.InventoryForm.patchValue({
          productName: this.selectedInventory.product.productName,
          currentStockItems: this.selectedInventory.currentStockItems,
          thresholdAmount: this.selectedInventory.thresholdAmount,
          supplierName: this.selectedInventory.supplierName,
          supplierEmail: this.selectedInventory.supplierEmail
        });
      }
    }
  }
}
