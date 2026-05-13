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