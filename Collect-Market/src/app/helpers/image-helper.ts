/**
 * Clase helper para gestionar URLs de imágenes.
 * 
 * Proporciona métodos estáticos para validar y formatear URLs de imágenes
 * de las cartas de la API, asegurando que siempre se devuelva una URL válida.
 */

export class ImageHelper {
  static getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return 'assets/card-placeholder.png';
    if (imageUrl.endsWith('.png') ||
        imageUrl.endsWith('.jpg') ||
        imageUrl.endsWith('.webp')) {
      return imageUrl;
    }
    return `${imageUrl}/high.webp`;
  }
}