import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { ModelUser } from '../../models/user';
import { Router, RouterLink } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-user-page',
  imports: [RouterLink],
  templateUrl: './user-page.html',
  styleUrl: './user-page.css',
})
export class UserPage {
   user: ModelUser | null = null;

  constructor(private authService: AuthService, private router: Router) {}


  ngOnInit(): void {
   $('#user').vide({mp4: 'video/pickachu_runtime'}, {poster: 'video/pickachu_runtime.png'});
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  logout(): void {
  this.authService.logout();
  this.router.navigate(['/']);
}
}
