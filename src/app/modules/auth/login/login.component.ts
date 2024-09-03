import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

import { LoginRequest } from '../models/login-request.model';
import { AuthService } from '../services/auth.service';
import { Response } from '../models/response-model';
import { ToasterService } from '../../../common/services/toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  model: LoginRequest = {
    email: '',
    password: ''
  };
  response$?: Observable<Response>
  loginForm: FormGroup;

  forgotPasswordForm: FormGroup;
  forgotPasswordMessage: string | null = null;
  forgotPasswordSuccess: boolean | null = null;

  
  constructor(private ngZone: NgZone, private authService: AuthService, private cookieService: CookieService, private route: Router, private fb: FormBuilder, private toasterService: ToasterService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(7)]
    });

    this.forgotPasswordForm = this.fb.group({
      femail: ['', [Validators.required, Validators.email]]
    });
  }

  forgotPassword(){
    const email = this.forgotPasswordForm.get('femail')?.value;
    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        if(response.isSuccess){
          this.forgotPasswordMessage = response.message;
          this.forgotPasswordForm.reset();
          this.forgotPasswordSuccess = true;
        }
        else{
          this.forgotPasswordSuccess = false;
          this.forgotPasswordMessage = response.message;
        }
      },
      error: (error) => {
        this.forgotPasswordMessage = 'An error occurred while processing your request.';
        this.toasterService.showError(error.message);
      }
    });
  }

  onFormSubmit(): void {
    this.model = {
      email: this.loginForm.get('email')?.value || '',
      password: this.loginForm.get('password')?.value || '',
    };

    this.response$ = this.authService.login(this.model)

    this.ngZone.run(() => {
      this.response$?.subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.cookieService.set('Authorization', `Bearer ${response.data?.token}`, undefined, '/', undefined, true, 'Strict');
            if (response.data) {
              this.authService.setUser({
                id: response.data.userId,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                phoneNumber: response.data.phoneNumber,
                address: response.data.address,
                email: response.data.email,
                roles: response.data.roles,
              });
            }
            this.route.navigateByUrl('/');
          }
          else {
            this.toasterService.showError(response.message);
          }
        }
      });
    });
  }
}
