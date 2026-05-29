import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';

declare var $: any;

@Component({
  selector: 'app-recover-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './recover-form.html',
  styleUrl: './recover-form.css',
})
export class RecoverForm implements OnInit {

  recoverForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
 
  sent = false;
  errorMessage = '';
  loading = false;
 
  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    $('#recover').vide({ mp4: 'video/pickachu_runtime' });
  }
 
  onSubmit(): void {
    if (this.recoverForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    
    const email = this.recoverForm.value.email!;
    
    this.authService.recoverPassword(email).subscribe({
      next: (response) => {
        this.sent = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al enviar el enlace. Inténtalo de nuevo.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}