import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../../common/guard/auth.guard';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { StocklevelComponent } from './stocklevel/stocklevel.component';
import { UserComponent } from './user/user.component';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  { path: 'category', canActivate: [authGuard], component: CategoryComponent },
  { path: 'product', canActivate: [authGuard], component: ProductComponent },
  { path: 'inventory', canActivate: [authGuard], component: StocklevelComponent },
  { path: 'user', canActivate: [authGuard], component: UserComponent },
  { path: 'orders', canActivate: [authGuard], component: OrderComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
