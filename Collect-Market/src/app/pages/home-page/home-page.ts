import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardsService } from '../../services/cards/cards-service';
import { Card } from '../../components/card/card';
import { RouterLink } from '@angular/router';
import { ModelCard } from '../../models/card';
import { ImageHelper } from '../../helpers/image-helper';

declare var $: any;

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink, Card],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {

  ImageHelper=ImageHelper
  cards: ModelCard[] = [];
  latestCards: ModelCard[] = [];

  constructor(private cardService: CardsService,  private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    $('#home').vide({ mp4: 'video/poke-center.gif' });
    this.loadCards();
  }

  loadCards(): void {
    this.cardService.getCards().subscribe({
      next: (data) => {
        const shuffled = [...data].sort(() => 0.6 - Math.random());
        this.cards = shuffled.slice(0, 3);
        this.latestCards = data.slice(0, 5);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando cartas:', err)
    });
  }
}