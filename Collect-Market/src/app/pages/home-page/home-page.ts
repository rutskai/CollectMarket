import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardsService } from '../../services/cards/cards-service';
declare var $: any;

@Component({
  selector: 'app-home-page',
  imports: [CommonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {

  cards: any[] = [];
  popularCards: any[] = [];

  constructor(private cardService: CardsService) {}

  ngOnInit(): void {
    $('#home').vide({ mp4: 'video/poke-center.gif' });

    this.loadCards();
  }

  loadCards(): void {
    this.cardService.getCards().subscribe({
      next: (data) => {
        const mapped = data.map(card => ({
          ...card,
          imageUrl: `${card.imageUrl}/low.jpg`
        }));

        this.cards = mapped;

       
        const shuffled = [...mapped].sort(() => 0.6 - Math.random());
        this.popularCards = shuffled.slice(0, 6);

        console.log('Cartas populares:', this.popularCards);
      },
      error: (err) => {
        console.error('Error cargando cartas:', err);
      }
    });
  }
}