import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { UserService } from '../../services/user/user-service';
import { User } from '../../models/user';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {


  public user:User | null = null;

  constructor(private authService: AuthService, private userService: UserService){}

 ngOnInit(): void {
      this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

}
