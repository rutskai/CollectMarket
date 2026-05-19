  import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
  import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { AuthService } from '../../services/auth/auth-service';
  import { Router, RouterLink } from '@angular/router';
  declare var $: any;

  @Component({
    selector: 'app-login-form',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './login-form.html',
    styleUrl: './login-form.css',
  })
  export class LoginForm implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private cdr:ChangeDetectorRef) {}

    ngOnInit(): void {
      $('#login').vide({ mp4: 'video/pickachu_runtime' });
    }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        this.authService.setUser(response.user);
        console.log("Usuario logueado correctamente.");
        this.loginForm.reset();
        this.errorMessage = '';
        this.router.navigate(['/home']);
      },
        error: (err) => {
  if (err.status === 404) {
    this.errorMessage = err.error?.message || 'Email no encontrado';
  } else if (err.status === 401) {
    this.errorMessage = err.error?.message || 'Contraseña incorrecta';
  } else {
    this.errorMessage = err.error?.message || 'Error al iniciar sesión';
  }
  this.cdr.detectChanges();
}
    });
  }

  }
