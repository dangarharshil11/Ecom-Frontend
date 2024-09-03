import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

import { AuthService } from '../../modules/auth/services/auth.service';
import { ToasterService } from '../services/toaster.service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const toasterService = inject(ToasterService);

  const user = authService.getUser();

  let token = cookieService.get('Authorization');

  // If  User is LoggedIn
  if(token && user){
    token = token.replace('Bearer ', '');
    const decodedToken: any = jwtDecode(token);

    const expDate = decodedToken.exp * 1000;
    const currentTime = new Date().getTime();

    // User should be logout if token expires
    if(expDate < currentTime){
      authService.logout();
      toasterService.showError("Session Expired, Please Login Again")
      return router.createUrlTree(['/auth/login'], { queryParams: {returnUrl: state.url} });
    }
    // If User Role is invalid
    else{
      if(user.roles.includes("Admin") || user.roles.includes("Customer")){
        return true;
      }
      toasterService.showError("UnAuthorized User, You do not have access to this page");
      return false;
    }
  }
  // If User is not LoggedIn
  else{
    authService.logout();
    return router.createUrlTree(['/auth/login'], { queryParams: {returnUrl: state.url} });
  }

};


