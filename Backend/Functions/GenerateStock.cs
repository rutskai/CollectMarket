using System;

namespace Helper
{
    public static class CardPriceHelper
    {
        private static readonly Random Random = new Random();

        /**
         * Genera automáticamente un precio
         * según la rareza de la carta.
         *
         * Las cartas Rare tienen un 30% de probabilidad
         * de ser especialmente valiosas (hasta 105€).
         *
         * @param rarity Rareza de la carta (Common, Uncommon, Rare)
         *
         * @return Precio generado (desde 1€ hasta 105€)
         */
        public static decimal GeneratePrice(string rarity)
        {
            return rarity switch
            {
                "Common" => Random.Next(1, 4),
                "Uncommon" => Random.Next(3, 8),
                "Rare" => Random.Next(5, 25) + (Random.Next(0, 100) > 70 ? Random.Next(20, 80) : 0),
                _ => Random.Next(2, 10)
            };
        }

         /**
         * Genera stock según rareza.
         *
         * Las cartas más raras tienen menos stock.
         *
         * @param rarity Rareza de la carta
         *
         * @return Cantidad de stock generada
         */
        public static int GenerateStock(string? rarity)
        {
            rarity ??= "Unknown";
            
            return rarity switch
            {
                "Common" => Random.Next(50, 100),
                "Uncommon" => Random.Next(30, 60),
                "Rare" => Random.Next(5, 20),
                _ => Random.Next(20, 50)
            };
        }
    }
}