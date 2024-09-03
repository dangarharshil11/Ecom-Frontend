import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';

import { CategoryResponse } from '../models/category-response';
import { AdminService } from '../service/admin.service';
import { FilterModel } from '../models/filter-model';
import { Response } from '../models/response-model';
import { ToasterService } from '../../../common/services/toaster.service';

@Component({
  selector: 'category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  Categories: CategoryResponse[] = [];
  isCategoriesVisible: boolean = false;
  count: number = 0;
  @ViewChild('dt1') dt1: Table | undefined;

  filterModel: FilterModel = {};
  response$?: Observable<Response>

  selectedCategory: any;
  CategoryForm: FormGroup;
  Category = {
    categoryName: '',
    categoryDescription: ''
  };

  constructor(private adminService: AdminService, private fb: FormBuilder, private toasterService: ToasterService) {
    this.CategoryForm = this.fb.group({
      categoryName: [this.selectedCategory?.categoryName || '', [Validators.required, Validators.minLength(3)]],
      categoryDescription: [this.selectedCategory?.categoryDescription || '', Validators.minLength(10)]
    })
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.adminService.getCategories(this.filterModel).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data?.length > 0) {
          this.isCategoriesVisible = true;
          this.Categories = response.data;
        } else {
          this.isCategoriesVisible = false;
          this.Categories = [];
        }
      }
    });
  }

  clear(table: Table) {
    table.clear();
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt1!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  loadCategory(category: CategoryResponse) {
    this.CategoryForm.patchValue({
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription
    });
    this.selectedCategory = category;
  }

  onSubmit(isEditing: boolean) {
    this.Category = {
      categoryName: this.CategoryForm.get('categoryName')?.value,
      categoryDescription: this.CategoryForm.get('categoryDescription')?.value
    }

    if (isEditing) {
      this.response$ = this.adminService.updateCategory(this.Category, this.selectedCategory?.id);
      this.response$.subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.toasterService.showSuccess("Category Updated Successfully.");
            this.loadCategories();
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
      this.response$ = this.adminService.createCategory(this.Category);

      this.response$.subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.toasterService.showSuccess("Category Created Successfully.");
            this.loadCategories();
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
    this.CategoryForm.reset();
  }

  onDelete(id: string) {
    this.response$ = this.adminService.deleteCategory(id);

    this.response$.subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toasterService.showSuccess("Category Deleted Successfully.");
          this.loadCategories();
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
    if (isEditing) {
      if (this.selectedCategory) {
        this.CategoryForm.patchValue({
          categoryName: this.selectedCategory.categoryName || '',
          categoryDescription: this.selectedCategory.categoryDescription || ''
        });
      }
    }
    else {
      this.CategoryForm.reset();
    }
  }
}
