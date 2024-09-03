import { NgModule } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { UserComponent } from './user/user.component';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { AuthModuleRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    UserComponent,
  ],
  imports: [
    AuthModuleRoutingModule,
    DropdownModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    DropdownModule,
    InputTextareaModule,
  ]
})
export class AuthModule { }
