import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CartComponent } from './cart/cart.component';
import { authGuard } from '../../common/guard/auth.guard';
import { OrderComponent } from './order/order.component';


const routes: Routes = [
  { path: "cart", canActivate:[authGuard], component: CartComponent },
  { path: "orders", canActivate:[authGuard], component: OrderComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
