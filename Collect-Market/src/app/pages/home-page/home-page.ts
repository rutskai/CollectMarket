import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardsService } from '../../services/cards/cards-service';
import { Card } from '../../components/card/card';
import { RouterLink } from '@angular/router';
import { ModelCard } from '../../models/card';
import { ImageHelper } from '../../helpers/image-helper';

declare var $: any;

/**
 * Componente de la página de inicio (home).
 * 
 * Muestra un vídeo de fondo, una selección de cartas aleatorias
 * y las últimas cartas añadidas a la colección.
 */
@Component({
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink, Card],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {

  ImageHelper = ImageHelper
  cards: ModelCard[] = [];
  latestCards: ModelCard[] = [];

  /**
   * Constructor del componente HomePage.
   * 
   * @param cardService - Servicio de gestión de cartas
   * @param cdr - Detector de cambios para actualizaciones manuales
   */
  constructor(private cardService: CardsService, private cdr: ChangeDetectorRef) {}

  /**
   * Inicializa el componente al cargarse.
   * 
   * Configura el vídeo de fondo y carga las cartas.
   */
  ngOnInit(): void {
    $('#home').vide({ mp4: 'video/poke-center.gif' });
    this.loadCards();
  }

  /**
   * Carga las cartas desde el servidor.
   * 
   * Calcula las 5 cartas más recientes (por fecha de creación)
   * y selecciona 3 cartas aleatorias para destacar.
   */
  loadCards(): void {
    this.cardService.getCards().subscribe({
      next: (data) => {
        const sortedByDate = [...data].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.latestCards = sortedByDate.slice(0, 5);

        const shuffled = [...data].sort(() => 0.6 - Math.random());
        this.cards = shuffled.slice(0, 3);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando cartas:', err)
    });
  }
}