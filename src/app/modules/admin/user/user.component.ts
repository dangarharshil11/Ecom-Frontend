import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import {  Observable } from 'rxjs';

import { AdminService } from '../service/admin.service';
import { Response } from '../models/response-model';
import { ToasterService } from '../../../common/services/toaster.service';
import { User } from '../../auth/models/user.model';
import { RegisterRequest } from '../../auth/models/register-request.model';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;
  Users: User[] = [];
  isUsersVisible: boolean = false;
  roles = ['Admin', 'Customer'];

  UserForm: FormGroup;
  EditUserForm: FormGroup;
  isValid: boolean = true;

  selectedUser: any;
  model: RegisterRequest;

  response$?: Observable<Response>

  constructor(private adminService: AdminService, private fb: FormBuilder, private toasterService: ToasterService) {
    this.UserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(7)]],
      address: ['', [Validators.required, Validators.maxLength(100)]],
    });

    this.model = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      email: '',
      role: '',
      password: '',
    };

    this.EditUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      address: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getUsers().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data?.length > 0) {
          this.isUsersVisible = true;
          this.Users = response.data;
        } else {
          this.isUsersVisible = false;
          this.Users = [];
        }
      }
    });
  }

  loadUser(user: User) {
    this.EditUserForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      role: user.roles
    });
    this.selectedUser = user;
  }

  clear(table: Table) {
    table.clear();
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt1!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  onSubmit(isEditing: boolean) {
    if (isEditing) {
      this.selectedUser.firstName = this.EditUserForm.get('firstName')?.value;
      this.selectedUser.lastName = this.EditUserForm.get('lastName')?.value;
      this.selectedUser.address = this.EditUserForm.get('address')?.value;
      this.selectedUser.phoneNumber = this.EditUserForm.get('phoneNumber')?.value;

      this.response$ = this.adminService.updateUser(this.selectedUser, this.selectedUser?.id);
      this.response$.subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.toasterService.showSuccess("User Updated Successfully.");
            this.loadUsers();
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

      this.isValid = true;
      this.model = {
        firstName: this.UserForm.get('firstName')?.value || '',
        lastName: this.UserForm.get('lastName')?.value || '',
        phoneNumber: this.UserForm.get('phoneNumber')?.value || '',
        email: this.UserForm.get('email')?.value || '',
        role: this.UserForm.get('role')?.value || '',
        password: this.UserForm.get('password')?.value || '',
        address: this.UserForm.get('address')?.value || ''
      };

      if (!this.UserForm.valid) {
        this.isValid = false;
      }

      this.response$ = this.adminService.createUser(this.model);

      this.response$.subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.toasterService.showSuccess("User Created Successfully.");
            this.loadUsers();
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
    this.UserForm.reset();
  }

  onDelete(id: string) {
    this.response$ = this.adminService.deleteUser(id);

    this.response$.subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toasterService.showSuccess("User Deleted Successfully.");
          this.loadUsers();
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
      this.EditUserForm.patchValue({
        firstName: this.selectedUser.firstName,
        lastName: this.selectedUser.lastName,
        phoneNumber: this.selectedUser.phoneNumber,
        address: this.selectedUser.address,
      });
    }
    else {
      this.UserForm.reset();
    }
  }
}
