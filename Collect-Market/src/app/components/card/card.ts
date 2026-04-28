import { Component, EventEmitter, Output, Input} from '@angular/core';
import { ModelCard } from '../../models/card';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {

  constructor(private http: HttpClient){}

  @Input() card!: ModelCard;
  @Input() isFavorite: boolean = false;
  @Output() addToCart = new EventEmitter<ModelCard>();
  @Output() toggleFavorite = new EventEmitter<ModelCard>();

  get imageUrl(): string {
    if (!this.card.imageUrl) return 'assets/card-placeholder.png';
    if (this.card.imageUrl.endsWith('.png') || 
        this.card.imageUrl.endsWith('.jpg') || 
        this.card.imageUrl.endsWith('.webp')) {
      return this.card.imageUrl;
    }
    return `${this.card.imageUrl}/high.webp`; 
  }


}
