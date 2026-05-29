import { Component } from '@angular/core';
import { CardsService } from '../../services/cards/cards-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';

/**
 * Componente de la página para vender cartas.
 * 
 * Permite a los usuarios autenticados publicar nuevas cartas
 * para la venta en el mercado.
 */
@Component({
  selector: 'app-sell-card-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sell-card-page.html',
  styleUrl: './sell-card-page.css',
})
export class SellCardPage {

  /**
   * Formulario reactivo para la publicación de una carta.
   * 
   * Campos:
   * - name: nombre de la carta (necesario)
   * - setName: nombre del set o colección
   * - rarity: rareza de la carta
   * - type: tipo de la carta
   * - price: precio de venta (requerido, mínimo 0.01)
   * - stock: cantidad disponible (requerido, mínimo 1)
   * - description: descripción de la carta
   * - imageUrl: URL de la imagen
   */
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

  /**
   * Constructor del componente SellCardPage.
   * 
   * @param cardsService - Servicio de gestión de cartas
   * @param authService - Servicio de autenticación
   */
  constructor(private cardsService: CardsService, private authService: AuthService) {
    const user = this.authService.getCurrentUser();
    this.userId = user?.id ?? null;
  }

  /** ID del usuario autenticado (vendedor). */
  private userId: number | null = null;

  /**
   * Gestiona el envío del formulario para publicar una carta.
   * 
   * Valida el formulario, crea el objeto de carta con los datos
   * y lo envía al servidor.
   */
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
        this.success = `Carta "${res.name}" publicada correctamente!`;
        this.sellForm.reset();
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al publicar la carta. Inténtalo de nuevo.';
      }
    });
  }

  /**
   * Comprueba si un campo del formulario es inválido y ha sido tocado.
   * 
   * @param field - Nombre del campo
   * @returns true si el campo es inválido y ha sido tocado
   */
  isInvalid(field: string): boolean {
    const control = this.sellForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

}