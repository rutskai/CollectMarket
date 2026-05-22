import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  imports: [CommonModule],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.css',
})
export class LoginModal {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  constructor(private router: Router) {}

   /**
   * Cierra el modal y navega al login.
   */
  goToLogin(): void {
    this.close.emit();
    this.router.navigate(['/auth/login']);
  }


  /**
   * Cierra el modal y navega al registro.
   */
  goToRegister(): void {
    this.close.emit();
    this.router.navigate(['/auth/register']);
  }

   /**
   * Cierra el modal al hacer click en el fondo.
   */
  onBackdropClick(): void {
    this.close.emit();
  }
}