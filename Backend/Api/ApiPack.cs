namespace Api
{
    public static class Packs
    {
        private static readonly List<Pack> packs = new()
        {
            new Pack
            {
                Id = 1,
                Name = "Pack Base",
                Description = "El pack clásico con cartas de la expansión Base.",
                ImageUrl = "https://assets.tcgdex.net/en/base/base1/pack/high.webp",
                Price = 4.99m,
                Stock = 50,
                CardsInPack = 10,
                PossibleRarities = new[] { "Common", "Uncommon", "Rare" },
                IsLimited = false,
                Discount = 0,
                CreatedAt = "2024-01-01"
            },
            new Pack
            {
                Id = 2,
                Name = "Pack Jungle",
                Description = "Cartas salvajes de la expansión Jungle.",
                ImageUrl = "https://assets.tcgdex.net/en/base/base2/pack/high.webp",
                Price = 5.99m,
                Stock = 30,
                CardsInPack = 10,
                PossibleRarities = new[] { "Common", "Uncommon", "Rare", "Rare Holo" },
                IsLimited = false,
                Discount = 0,
                CreatedAt = "2024-01-01"
            },
            new Pack
            {
                Id = 3,
                Name = "Pack Fossil",
                Description = "Desentierra cartas legendarias de la expansión Fossil.",
                ImageUrl = "https://assets.tcgdex.net/en/base/base3/pack/high.webp",
                Price = 6.99m,
                Stock = 2,
                CardsInPack = 10,
                PossibleRarities = new[] { "Uncommon", "Rare", "Rare Holo" },
                IsLimited = true,
                Discount = 10,
                CreatedAt = "2024-01-01"
            }
        };

        public static void PacksEndpoints(this WebApplication app)
        {
            app.MapGet("/api/packs", () => Results.Ok(packs));

            app.MapGet("/api/packs/{id}", (int id) =>
            {
                var pack = packs.FirstOrDefault(p => p.Id == id);
                return pack is not null ? Results.Ok(pack) : Results.NotFound();
            });
        }
    }
}