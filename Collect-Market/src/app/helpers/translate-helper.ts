import { TYPE_TRANSLATION, RARITY_TRANSLATION, EXPANSION_TRANSLATION } from './constants';

export class TranslateHelper {
  
  /**
   * Traduce una rareza
   */
  static rarity(rarity?: string | null): string {
    return RARITY_TRANSLATION[rarity ?? ''] ?? rarity ?? 'Rareza desconocida';
  }

  /**
   * Traduce un tipo
   */
  static type(type?: string | null): string {
    return TYPE_TRANSLATION[type ?? ''] ?? type ?? 'Tipo desconocido';
  }

  /**
   * Traduce una expansión
   */
  static expansion(expansion?: string | null): string {
    return EXPANSION_TRANSLATION[expansion ?? ''] ?? expansion ?? 'Expansión desconocida';
  }

 
}