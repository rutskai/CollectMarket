import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth/auth-service';
import { Router } from '@angular/router';
declare var $: any;

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const repeatPassword = control.get('repeatPassword')?.value;
  
  if (password && repeatPassword && password !== repeatPassword) {
    return { passwordsMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm implements OnInit {

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    repeatPassword: new FormControl('', [Validators.required])
  }, { validators: passwordsMatchValidator });
  
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router,  private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    $('#register').vide({ mp4: 'video/pickachu_runtime' });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const { name, email, password, repeatPassword } = this.registerForm.value;

    this.authService.register(name!, email!, password!, repeatPassword!).subscribe({
      next: () => {
        console.log("Usuario registrado correctamente.");
        this.registerForm.reset();
        this.errorMessage = '';
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage = 'Este email ya está registrado.';
          
        } else {
          this.errorMessage = err.error?.message || 'Error al registrarse';
        }
        this.cdr.detectChanges();
      }
      
    });
  }
}