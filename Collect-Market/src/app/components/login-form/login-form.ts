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

  /**
   * Formulario reactivo de login.
   *
   * Campos:
   * - email: formato email válido
   * - password: mínimo 6 caracteres
   */
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  /** Mensaje de error a mostrar en el formulario. */
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) { }

  /**
   * Inicializa el fondo de vídeo del componente.
   */
  ngOnInit(): void {
    $('#login').vide({ mp4: 'video/pickachu_runtime' });
  }


  /**
   * Gestiona el envío del formulario de login.
   *
   * Si el formulario es inválido no hace nada.
   * Gestiona los errores:
   * - 404: email no encontrado
   * - 401: contraseña incorrecta
   * Si el login es exitoso almacena el token
   * y redirige al home.
   */
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
