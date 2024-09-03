import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../../modules/auth/models/user.model';
import { AuthService } from '../../../modules/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user?: User;

  constructor(private authService: AuthService, private route: Router){ }

  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (error) => {
        console.error(error);
      }
    });

    this.user = this.authService.getUser();
  }

  onLogout(){
    this.authService.logout();
    this.route.navigateByUrl('/');
    window.location.reload();
  }
}
