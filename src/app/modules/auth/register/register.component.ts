import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { RegisterRequest } from '../models/register-request.model';
import { AuthService } from '../services/auth.service';
import { Response } from '../models/response-model';
import { ToasterService } from '../../../common/services/toaster.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  model: RegisterRequest;
  response$?: Observable<Response>;
  registerForm: FormGroup;
  isValid: boolean = true;

  constructor( private authService: AuthService, private route: Router, private toasterService: ToasterService, private fb: FormBuilder) {
    this.model = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      email: '',
      role: 'Customer',
      password: '',
    };

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
      address: ['', [Validators.required, Validators.maxLength(100)]],
    })
  }

  onFormSubmit(): void {
    this.isValid = true;
    this.model = {
      firstName: this.registerForm.get('firstName')?.value || '',
      lastName: this.registerForm.get('lastName')?.value || '',
      phoneNumber: this.registerForm.get('phoneNumber')?.value || '',
      email: this.registerForm.get('email')?.value || '',
      role: 'Customer',
      password: this.registerForm.get('password')?.value || '',
      address: this.registerForm.get('address')?.value || ''
    };
    
    if (!this.registerForm.valid) {
      this.isValid = false;
    }
    else {
      this.authService.register(this.model).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.toasterService.showSuccess('Registration Successful!')
            this.route.navigateByUrl('/auth/login');
          }
          else {
            this.toasterService.showError(response.message);
          }
        }
      });
    }
  }
}
