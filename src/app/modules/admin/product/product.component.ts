import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { ProductResponse } from '../models/product-response';
import { FilterModel } from '../models/filter-model';
import { AdminService } from '../service/admin.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { Response } from '../models/response-model';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  @ViewChild('dt1') dt1: Table | undefined;
  products!: ProductResponse[];

  totalRecords!: number;
  filterModel: FilterModel = {};

  selectedProduct: any;
  ProductForm: FormGroup;
  Product = {
    productName: '',
    productDescription: '',
    productPrice: 0,
    categoryId: '',
    productBrandName: '',
    imageRepresentationBase64: '',
  };

  categories: string[] = [];
  categoryMap: Map<string, string> = new Map<string, string>();

  imageFlag: boolean = false;
  file?: File;
  imagePreview: string | ArrayBuffer | null = null;

  isEditing: boolean = false;
  response$?: Observable<Response>

  constructor(private adminService: AdminService, private route: ActivatedRoute,
    private toasterService: ToasterService, private changeDetector: ChangeDetectorRef,
    private fb: FormBuilder) {
    this.ProductForm = this.fb.group({
      productName: [this.selectedProduct?.productName || '', [Validators.required, Validators.minLength(3)]],
      productDescription: [this.selectedProduct?.productDescription || '', [Validators.required, Validators.minLength(10)]],
      productPrice: [this.selectedProduct?.productPrice || 0, [Validators.required, Validators.min(1)]],
      categoryName: [this.selectedProduct?.categoryName || '', [Validators.required]],
      productBrandName: [this.selectedProduct?.productBrandName || '', [Validators.required, Validators.minLength(3)]],
    });

    this.adminService.getCategoryList().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.categories = Object.values(response.data);
          this.categoryMap = new Map<string, string>(Object.entries(response.data));
        }
      },
      error: (err) => {
        this.toasterService.showError(err.message);
      }
    });

    this.getData(this.filterModel);
  }

  // Function to get ID based on category name
  getIdByValue(value: string): string | undefined {
    for (const [key, val] of this.categoryMap.entries()) {
      if (val === value) {
        return key;
      }
    }
    return undefined; // Return undefined if value is not found
  }

  loadProducts(event: TableLazyLoadEvent) {
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

  getData(filterModel: FilterModel) {
    this.adminService.getProducts(filterModel).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.products = response.data.products;
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

  onFileUploadChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.file = element.files?.[0];
    if (this.file) {
      
      // Create a FileReader instance
      const reader = new FileReader();
      
      // Set up a callback for when the file is read
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          // Get the Base64 string from the result
          const base64String = e.target.result as string;
          
          // Store the Base64 string in a variable
          this.Product.imageRepresentationBase64 = base64String;
          this.imagePreview = base64String;
          this.imageFlag = true;
        }
      };
      // Read the file as a data URL (Base64)
      reader.readAsDataURL(this.file);
    }
  }

  onSubmit(isEditing: boolean) {
    this.Product = {
      productName: this.ProductForm.get('productName')?.value,
      productDescription: this.ProductForm.get('productDescription')?.value,
      productPrice: this.ProductForm.get('productPrice')?.value,
      categoryId: this.getIdByValue(this.ProductForm.get('categoryName')?.value) || '',
      productBrandName: this.ProductForm.get('productBrandName')?.value,
      imageRepresentationBase64: this.Product.imageRepresentationBase64 
    }

    if (isEditing) {
      this.response$ = this.adminService.updateProduct(this.Product, this.selectedProduct?.id);
      this.response$.subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.toasterService.showSuccess("Product Updated Successfully.");
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
      this.response$ = this.adminService.createProduct(this.Product);

      this.response$.subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.toasterService.showSuccess("Product Created Successfully.");
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
    this.onReset(this.isEditing);
  }

  loadProduct(product: ProductResponse) {
    this.ProductForm.patchValue({
      productName: product.productName,
      productPrice: product.productPrice,
      categoryId: product.category.categoryName,
      productBrandName: product.productBrandName,
      productDescription: product.productDescription,
      categoryName: product.category.categoryName
    });
    this.Product.imageRepresentationBase64 = product.imageRepresentationBase64;
    this.selectedProduct = product;
  }

  onDelete(id: string) {
    this.response$ = this.adminService.deleteProduct(id);

    this.response$.subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toasterService.showSuccess("Product Deleted Successfully.");
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
    this.ProductForm.reset();
    if (isEditing) {
      if (this.selectedProduct) {
        this.ProductForm.patchValue({
          productName: this.selectedProduct.productName,
          productDescription: this.selectedProduct.productDescription,
          productPrice: this.selectedProduct.productPrice,
          categoryName: this.selectedProduct.category.categoryName,
          productBrandName: this.selectedProduct.productBrandName
        });
      }
      this.imagePreview = null;
    }
    else {      
      this.imageFlag = false;

      const fileInput = document.getElementById('UploadImage') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    }
  }
}
