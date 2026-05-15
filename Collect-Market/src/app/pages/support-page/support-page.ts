import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type SupportTab = 'faq' | 'contact';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  link?: boolean;
}

interface Category {
  name: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-support-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-page.html',
  styleUrls: ['./support-page.css']
})
export class SupportPage {
  activeTab: SupportTab = 'faq';
  searchQuery = '';
  openFAQ: number | null = null;
  selectedCategory = 'Todos';

  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  categories: Category[] = [
    { name: 'Todos', icon: '📋', count: 8 },
    { name: 'Cuenta y perfil', icon: '👤', count: 3 },
    { name: 'Pedidos y envíos', icon: '📦', count: 4 },
    { name: 'Pagos y facturación', icon: '💳', count: 2 },
    { name: 'Cartas y colecciones', icon: '🃏', count: 5 },
    { name: 'Vender en Collect', icon: '🏷️', count: 2 }
  ];

  faqs: FAQ[] = [
    { id: 1, category: 'Cuenta y perfil', question: '¿Cómo creo una cuenta en CollectMarket?', answer: 'Para crear una cuenta, haz clic en "Registrarse" en la esquina superior derecha. Completa tus datos básicos y verifica tu correo electrónico para activar tu cuenta.', link: true },
    { id: 2, category: 'Cuenta y perfil', question: '¿Cómo recupero mi contraseña?', answer: 'En la página de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?". Recibirás un enlace para restablecerla en tu correo electrónico registrado.' },
    { id: 3, category: 'Pedidos y envíos', question: '¿Cuánto tarda el envío de mis cartas?', answer: 'Los envíos nacionales tardan entre 2-5 días laborables. Los internacionales pueden tardar 7-14 días laborables dependiendo del destino.', link: true },
    { id: 4, category: 'Pedidos y envíos', question: '¿Puedo rastrear mi pedido?', answer: 'Sí, todos los pedidos incluyen número de seguimiento. Lo encontrarás en tu perfil > "Mis pedidos" y también lo recibirás por email.' },
    { id: 5, category: 'Pagos y facturación', question: '¿Qué métodos de pago aceptan?', answer: 'Aceptamos tarjetas Visa/Mastercard, PayPal, Bizum y transferencia bancaria. Todos los pagos son seguros y están protegidos.' },
    { id: 6, category: 'Cartas y colecciones', question: '¿Las cartas son originales?', answer: 'Sí, todas las cartas son 100% originales y verificadas. Trabajamos directamente con distribuidores oficiales y coleccionistas verificados.' },
    { id: 7, category: 'Vender en Collect', question: '¿Cómo puedo vender mis cartas?', answer: 'En tu perfil, selecciona "Vender carta". Sube fotos, describe el estado y el precio. Nuestro equipo revisará la publicación antes de activarla.' },
    { id: 8, category: 'Cartas y colecciones', question: '¿Qué garantía tienen las cartas?', answer: 'Todas las cartas pasan por un control de calidad. Si recibes una carta en mal estado, tienes 14 días para solicitar devolución o cambio.' }
  ];

  // Getter que filtra automáticamente por categoría y búsqueda
  get filteredFAQs(): FAQ[] {
    let filtered = this.faqs;
    
    if (this.selectedCategory !== 'Todos') {
      filtered = filtered.filter(f => f.category === this.selectedCategory);
    }
    
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(f => 
        f.question.toLowerCase().includes(query) || 
        f.answer.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }

  changeTab(tab: SupportTab): void {
    this.activeTab = tab;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  toggleFAQ(id: number): void {
    this.openFAQ = this.openFAQ === id ? null : id;
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  isFormValid(): boolean {
    return this.contactForm.name.trim() !== '' &&
           this.contactForm.email.trim() !== '' &&
           this.contactForm.email.includes('@') &&
           this.contactForm.subject !== '' &&
           this.contactForm.message.trim() !== '';
  }

  submitContact(): void {
    if (this.isFormValid()) {
      console.log('Formulario enviado:', this.contactForm);
      alert('¡Mensaje enviado con éxito! Te responderemos en menos de 24 horas.');
      this.contactForm = { name: '', email: '', subject: '', message: '' };
    }
  }
}