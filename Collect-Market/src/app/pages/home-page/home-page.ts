import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardsService } from '../../services/cards/cards-service';
import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';
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
  popularCardsRepeated: any[] = [];

  constructor(private cardService: CardsService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    $('#index').vide({ mp4: 'video/pickachu_runtime' }, { poster: 'video/pickachu_runtime.jpg' });
    this.loadCards();
  }

  loadCards(): void {
    this.popularCardsRepeated = []; // Reset antes de llenar

    this.cardService.getCards().subscribe({
      next: (data) => {
        const mapped = data.map(card => ({
          ...card,
          imageUrl: `${card.imageUrl}/low.jpg`
        }));

        //CARTAS POPULARES
        this.cards = mapped;
        const shuffled = [...mapped].sort(() => 0.5 - Math.random());
        const selectedFive = shuffled.slice(0, 5);
        this.popularCards = selectedFive;

        // Repetir cartas para el Swiper loop
        for (let i = 0; i < 5; i++) {
          this.popularCardsRepeated.push(...selectedFive);
        }

        console.log('5 cartas aleatorias seleccionadas:', selectedFive);
        console.log('Total slides en swiper:', this.popularCardsRepeated.length);
        // Forzar detección de cambios
        this.cdr.detectChanges();

        // Inicializar Swiper después de que la vista se actualice
        setTimeout(() => {
          this.initSwiper();
        }, 200);
      },
      error: (err) => {
        console.error('Error cargando cartas:', err);
      }
    });
  }

  initSwiper(): void {
    const swiperOptions = {
      modules: [Autoplay], // Asegúrate de importar los módulos necesarios
      loop: true, 
      cssMode: true,                   // Habilita el bucle infinito
      freeMode: {
        enabled: true,                // Habilita el modo libre (FreeMode)
        momentum: false               // Desactiva el impulso para que no acelere/desacelere
      },
      spaceBetween: 25,               // Espacio de 25px entre cada slide
      grabCursor: true,               // Cambia el cursor a "mano" al pasar sobre el carrusel
      slidesPerView: 'auto',          // El ancho de los slides lo define su contenido o tu CSS
      autoplay: {
        delay: 1,                     // ¡Retardo de 1ms! Esto, combinado con speed alto, crea el efecto continuo
        disableOnInteraction: false   // El autoplay no se detiene al interactuar con el carrusel
      },
      speed: 5000,                    // Velocidad de transición muy lenta (5 segundos por slide)
    };

  }



}
