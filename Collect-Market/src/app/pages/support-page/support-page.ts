import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FAQ, Category } from '../../models/faq';


export type SupportTab = 'faq' | 'contact';

/**
 * Componente de la página de soporte al usuario.
 * 
 * Proporciona dos pestañas principales:
 * 1 - FAQ: Muestra preguntas frecuentes organizadas por categorías,
 *    con funcionalidad de filtrado y expansión de respuestas.
 * 2 - Contacto: Formulario de contacto para consultas personalizadas
 *    con validación de campos.
 */

@Component({
  selector: 'app-support-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './support-page.html',
  styleUrls: ['./support-page.css']
})
export class SupportPage {

  activeTab: SupportTab = 'faq';
  openFAQ: number | null = null;
  selectedCategory = 'Todos';

  /**
   * Formulario reactivo de contacto.
   * 
   * Campos:
   * - name: nombre completo (requerido, mínimo 2 caracteres)
   * - email: correo electrónico (requerido, formato email)
   * - subject: asunto (requerido, mínimo 3 caracteres)
   * - message: mensaje (requerido, mínimo 10 caracteres)
   */
  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', [Validators.required, Validators.minLength(3)]),
    message: new FormControl('', [Validators.required, Validators.minLength(10)])
  });

  categories: Category[] = [
    { name: 'Todos', count: 8 },
    { name: 'Cuenta y perfil', count: 3 },
    { name: 'Pedidos y envíos', count: 4 },
    { name: 'Pagos y facturación', count: 2 },
    { name: 'Cartas y colecciones', count: 5 },
    { name: 'Vender en Collect', count: 2 }
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

  /**
   * Getter que filtra automáticamente las FAQs por categoría seleccionada.
   * 
   * @returns Array de FAQs filtradas
   */
  get filteredFAQs(): FAQ[] {
    let filtered = this.faqs;
    
    if (this.selectedCategory !== 'Todos') {
      filtered = filtered.filter(f => f.category === this.selectedCategory);
    }
    
    return filtered;
  }

  /**
   * Cambia la pestaña activa del soporte.
   * 
   * @param tab - Pestaña a activar ('faq' o 'contact')
   */
  changeTab(tab: SupportTab): void {
    this.activeTab = tab;
  }

  /**
   * Selecciona una categoría para filtrar las FAQs.
   * 
   * @param category - Nombre de la categoría
   */
  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  /**
   * Abre o cierra una pregunta frecuente.
   * 
   * @param id - ID de la FAQ a togglear
   */
  toggleFAQ(id: number): void {
    this.openFAQ = this.openFAQ === id ? null : id;
  }

  /**
   * Indica si el formulario de contacto es válido.
   * 
   * @returns true si el formulario es válido
   */
  get isFormValid(): boolean {
    return this.contactForm.valid;
  }

  /**
   * Envía el formulario de contacto.
   * 
   * Registra el mensaje en consola y resetea el formulario.
   */
  submitContact(): void {
    if (this.contactForm.valid) {
      console.log('Formulario enviado:', this.contactForm.value);
      alert('¡Mensaje enviado con éxito! Te responderemos en menos de 24 horas.');
      
      this.contactForm.reset({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }
  }
}