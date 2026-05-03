import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardsService } from '../../services/cards/cards-service';
import { RouterLink } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {

  cards: any[] = [];
  popularCards: any[] = [];

  constructor(private cardService: CardsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    $('#home').vide({ mp4: 'video/poke-center.gif' });
    this.loadCards();
  }
 

  loadCards(): void {
    this.cardService.getCards().subscribe({
      next: (data) => {
        const shuffled = [...data].sort(() => 0.6 - Math.random());
        this.cards = shuffled.slice(0, 3);
        this.popularCards = shuffled.slice(0, 5);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando cartas:', err)
    });
  }

   getImageUrl(card: any): string {
  if (!card.imageUrl) return 'assets/card-placeholder.png';
  if (card.imageUrl.endsWith('.png') || 
      card.imageUrl.endsWith('.jpg') || 
      card.imageUrl.endsWith('.webp')) {
    return card.imageUrl;
  }
  return `${card.imageUrl}/low.webp`;
}
}