import { Component } from '@angular/core';

import { ProductResponse } from '../../models/product-response';
import { CommomService } from '../../services/commom.service';
import { FilterModel } from '../../models/filter-model';
import { User } from '../../../modules/auth/models/user.model';
import { AuthService } from '../../../modules/auth/services/auth.service';
import { CustomerService } from '../../../modules/customer/services/customer.service';
import { ToasterService } from '../../services/toaster.service';
import { CartRequest } from '../../../modules/customer/models/cart-request';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  products: ProductResponse[] = [];
  selectedProduct: ProductResponse | null = null;
  filter: FilterModel = {
    page: 1,
    pageSize: 5
  };
  hasNextPage = true;
  user?: User;

  constructor(private commonService: CommomService, private authService: AuthService,
    private customerService: CustomerService, private toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.user = this.authService.getUser();
  }

  loadProducts() {
    this.commonService.getProducts(this.filter).subscribe(response => {
      if(response.isSuccess && response.data.totalRecords > 0){
        this.products = response.data.products;
        this.hasNextPage = (this.filter.page ?? 1) * (this.filter.pageSize ?? 5) < response.data.totalRecords
      }
    });
  }

  loadNextPage() {
    if (this.hasNextPage) {
      this.filter.page = (this.filter.page || 1) + 1;
      this.loadProducts();
    }
  }

  loadPreviousPage() {
    if ((this.filter.page || 1) > 1) {
      this.filter.page = (this.filter.page || 1) - 1;
      this.loadProducts();
    }
  }

  addToCart(product: ProductResponse) {
    if(this.user?.roles.includes("Customer")){
      var cartRequest: CartRequest = {
        userId: this.user.id,
        productId: product.id,
        productCount: 1
      }

      this.customerService.updateCart(cartRequest).subscribe(
        response => {
          if(response.isSuccess){
            this.toasterService.showSuccess("Item Added to the Cart");
          }
          else{
            this.toasterService.showError(response.message);
          }
        }
      )
    }
    else{
      this.toasterService.showError("Please Login as Customer to Access Cart Related Functionalities.");
    }
  }

  applyFilter(filter: FilterModel) {
    this.filter.page = 1;
    this.filter = { ...this.filter, ...filter };
    this.loadProducts();
  }
}
