import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth-service';
import { Router } from '@angular/router';
 declare var $: any;

@Component({
  selector: 'app-register-form',
  imports: [FormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm implements OnInit{
 
 userData = {
    name: '',
    email: '',
    password: '',
    repeatPassword: ''
  };

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    $('#register').vide({mp4: 'video/pickachu_runtime' });
  }

  onSubmit(): void {
    if (this.userData.password !== this.userData.repeatPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.authService.register(this.userData.name, this.userData.email, this.userData.password, this.userData.repeatPassword).subscribe({
      next: () => {
        console.log("Usuario registrado correctamente.");
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al registrarse';
      }
    });
  }
}
