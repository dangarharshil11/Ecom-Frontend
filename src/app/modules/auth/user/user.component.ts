import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { ChangePasswordRequest } from '../models/change-password-request';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userProfile?: User;

  editProfileForm: FormGroup;
  changePasswordForm: FormGroup;
  isProfileFormValid: boolean = true;
  isPasswordFormValid: boolean = true;

  constructor(private fb: FormBuilder, private authService: AuthService, 
    private toasterService: ToasterService, private route: Router) {
    this.editProfileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      address: ['', [Validators.required, Validators.maxLength(100)]],
    });

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(7)]],
      newPassword: ['', [Validators.required, Validators.minLength(7)]]
    });
  }

  ngOnInit(): void {
    this.userProfile = this.authService.getUser();
    this.editProfileForm.patchValue({
      firstName: this.userProfile?.firstName,
      lastName: this.userProfile?.lastName,
      phoneNumber: this.userProfile?.phoneNumber,
      address: this.userProfile?.address
    });
  }

  onSubmitProfile() {
    this.isProfileFormValid = true;
    if (!this.editProfileForm.valid) {
      this.isProfileFormValid = false;
    }
    else {
      if (this.userProfile) {
        this.userProfile.firstName = this.editProfileForm.get('firstName')?.value || this.userProfile.firstName,
          this.userProfile.lastName = this.editProfileForm.get('lastName')?.value || this.userProfile.lastName,
          this.userProfile.address = this.editProfileForm.get('address')?.value || this.userProfile.address,
          this.userProfile.phoneNumber = this.editProfileForm.get('phoneNumber')?.value || this.userProfile.phoneNumber,
          this.authService.editProfile(this.userProfile, this.userProfile.id).subscribe({
            next: (response) => {
              if (response.isSuccess && this.userProfile) {
                this.toasterService.showSuccess('User Updated Successfully!')
                this.authService.setUser(this.userProfile)
              }
              else {
                this.toasterService.showError(response.message);
              }
            }
          })
      }
    }
    this.onResetProfile();
  }

  onResetProfile() {
    this.editProfileForm.reset(this.userProfile);
  }

  onSubmitPassword() {
    this.isPasswordFormValid = true;
    if (!this.changePasswordForm.valid) {
      this.isPasswordFormValid = false;
    }
    else {
      if (this.userProfile) {
        var request: ChangePasswordRequest = {
          email: this.userProfile?.email,
          oldPassword: this.changePasswordForm.get('oldPassword')?.value,
          newPassword: this.changePasswordForm.get('newPassword')?.value,
        }

        this.authService.changePassword(request).subscribe({
          next: (response) => {
            if (response.isSuccess && this.userProfile) {
              this.toasterService.showSuccess('Password Changed Successfully!')
              this.onResetPassword();
            }
            else {
              this.toasterService.showError(response.message);
            }
          }
        });
      }
      else {
        this.toasterService.showError("email not found!!");
      }
    }
  }

  onResetPassword() {
    this.changePasswordForm.reset();
  }

  onDeleteUser() {
    if (this.userProfile) {
      this.authService.deleteUser(this.userProfile?.id).subscribe({
        next: (response) => {
          if (response.isSuccess && this.userProfile) {
            this.toasterService.showSuccess('User Deleted Successfully!')
            this.route.navigateByUrl('');
            this.authService.logout();
          }
          else {
            this.toasterService.showError(response.message);
          }
        }
      })
    }
  }
}
