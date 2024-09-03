import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagenotfoundComponent } from './common/components/pagenotfound/pagenotfound.component';
import { HomeComponent } from './common/components/home/home.component';

const routes: Routes = [
  // public Routes
  { path: "", component: HomeComponent },

  // Auth Routes
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },

  // Admin Routes
  { path: "admin", loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule) },
  
  // Customer Routes
  { path: "customer", loadChildren: () => import('./modules/customer/customer.module').then(m => m.CustomerModule) },

  { path: '**', pathMatch: 'full', component: PagenotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
