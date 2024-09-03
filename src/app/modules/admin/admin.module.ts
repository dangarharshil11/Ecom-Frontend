import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AccordionModule } from 'primeng/accordion';

import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { CategoryComponent } from './category/category.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ProductComponent } from './product/product.component';
import { StocklevelComponent } from './stocklevel/stocklevel.component';
import { UserComponent } from './user/user.component';
import { OrderComponent } from './order/order.component';

@NgModule({
  declarations: [
    CategoryComponent,
    ProductComponent,
    StocklevelComponent,
    UserComponent,
    OrderComponent
  ],
  imports: [
    AdminRoutingModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    InputTextareaModule,
    AccordionModule,
    CalendarModule,
    TableModule,
  ]
})
export class AdminModule { }
