import { Component } from '@angular/core';
import { CardsService } from '../../services/cards/cards-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-sell-card-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sell-card-page.html',
  styleUrl: './sell-card-page.css',
})
export class SellCardPage {

  sellForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    setName: new FormControl(''),
    rarity: new FormControl(''),
    type: new FormControl(''),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    stock: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    description: new FormControl(''),
    imageUrl: new FormControl(''),
  });

  loading = false;
  success = '';
  error = '';

  rarities = ['Common', 'Rare', 'Ultra Rare', 'Secret'];
  types = ['Electric', 'Fire', 'Water', 'Grass', 'Psychic', 'Dark'];

  constructor(private cardsService: CardsService, private authService: AuthService) {
    const user = this.authService.getCurrentUser();
    this.userId = user?.id ?? null;
  }

  private userId: number | null = null;

  onSubmit(): void {
    if (this.sellForm.invalid) {
      this.sellForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.success = '';
    this.error = '';

    const card = {
      name: this.sellForm.value.name!,
      setName: this.sellForm.value.setName ?? undefined,
      rarity: this.sellForm.value.rarity ?? undefined,
      type: this.sellForm.value.type ?? undefined,
      price: this.sellForm.value.price!,
      stock: this.sellForm.value.stock!,
      description: this.sellForm.value.description ?? undefined,
      imageUrl: this.sellForm.value.imageUrl ?? undefined,
      sellerId: this.userId ?? undefined,
    };

    this.cardsService.createCard(card).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = `¡Carta "${res.name}" publicada correctamente!`;
        this.sellForm.reset();
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al publicar la carta. Inténtalo de nuevo.';
      }
    });
  }

  isInvalid(field: string): boolean {
    const control = this.sellForm.get(field);
    return !!(control?.invalid && control?.touched);
  }


}
