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

  goToLogin(): void {
    this.close.emit();
    this.router.navigate(['/auth/login']);
  }

  goToRegister(): void {
    this.close.emit();
    this.router.navigate(['/auth/register']);
  }

  onBackdropClick(): void {
    this.close.emit();
  }
}