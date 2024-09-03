import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { LoginRequest } from '../models/login-request.model';
import { User } from '../models/user.model';
import { RegisterRequest } from '../models/register-request.model';
import { Response } from '../models/response-model';
import { apiRoutes } from '../../../common/constants/api-routes';
import { ChangePasswordRequest } from '../models/change-password-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  $user = new BehaviorSubject<User | undefined>(undefined);

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  register(request: RegisterRequest): Observable<Response>{
    return this.http.post<Response>(apiRoutes.register, request);
  }

  login(request: LoginRequest): Observable<Response>{
    return this.http.post<Response>(apiRoutes.login, {
      email: request.email,
      password: request.password,
    });
  }

  editProfile(request: User, id: string): Observable<Response>{
    return this.http.post<Response>(apiRoutes.updateUser + `${id}?addAuth=true`, request);
  }

  forgotPassword(email: string): Observable<Response>{
    return this.http.get<Response>(apiRoutes.forgotPassword + email);
  }

  changePassword(request: ChangePasswordRequest): Observable<Response>{
    return this.http.post<Response>(apiRoutes.changePassword, request);
  }

  deleteUser(id: string): Observable<Response>{
    return this.http.delete<Response>(`${apiRoutes.deleteUser}` + `${id}?addAuth=true`);
  }

  // Storing user-data to localStorage
  setUser(user: User): void{
    this.$user.next(user);
    localStorage.setItem('user-id',user.id);
    localStorage.setItem('user-fname',user.firstName);
    localStorage.setItem('user-lname',user.lastName);
    localStorage.setItem('user-phone',user.phoneNumber);
    localStorage.setItem('user-address',user.address);
    localStorage.setItem('user-email',user.email);
    localStorage.setItem('user-roles',user.roles.join(','));
  }

  // Retrieving user-data from localStorage
  getUser(): User | undefined{
    const Id = localStorage.getItem('user-id');
    const firstName = localStorage.getItem('user-fname');
    const lastName = localStorage.getItem('user-lname');
    const phoneNumber = localStorage.getItem('user-phone');
    const address = localStorage.getItem('user-address');
    const email = localStorage.getItem('user-email');
    const roles = localStorage.getItem('user-roles');

    if(email && roles && Id && firstName && lastName && phoneNumber && address){
      const user: User = {
        id: Id,
        firstName: firstName,
        lastName: lastName,
        address: address,
        phoneNumber: phoneNumber,
        email: email,
        roles: roles?.split(','),
      }
      return user;
    }
    return undefined;
  } 

  user(): Observable<User | undefined>{
    return this.$user.asObservable();
  }

  // Clearnig User-data from cookie and localStorage on logout
  logout(): void{
    localStorage.clear();
    this.cookieService.delete('Authorization', '/');
    this.$user.next(undefined);
  }
}
