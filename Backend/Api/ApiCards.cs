using Microsoft.EntityFrameworkCore;

namespace Api
{
    public static class Cards
    {
        public static void CardsEndpoints(this WebApplication app)
        {


            app.MapGet("/api/cards", async (AppDb db) =>
            {
                var cards = await db.Cards.ToListAsync();
                return Results.Ok(cards);
            });

            app.MapGet("/api/cards/{id}", async (int id, AppDb db) =>
            {
                var card = await db.Cards.FirstOrDefaultAsync(c => c.Id == id);
                return card is not null ? Results.Ok(card) : Results.NotFound();
            });

            app.MapGet("/api/cards/rarity/{rarity}", async (string rarity, AppDb db) =>
            {
                var cards = await db.Cards.Where(c => c.Rarity == rarity).ToListAsync();
                return Results.Ok(cards);
            });

            app.MapGet("/api/cards/search/{term}", async (string term, AppDb db) =>
            {
                var cards = await db.Cards
                    .Where(c => c.Name.Contains(term) || (c.SetName != null && c.SetName.Contains(term)))
                    .ToListAsync();
                return Results.Ok(cards);
            });

            app.MapGet("/api/cards/filter", async (
                HttpContext http,
                AppDb db) =>
            {
                var query = db.Cards.AsQueryable();

                var rarities = http.Request.Query["rarity"].ToArray();
                var types = http.Request.Query["type"].ToArray();
                var setNames = http.Request.Query["setName"].ToArray();
                var minPrice = http.Request.Query["minPrice"].FirstOrDefault();
                var maxPrice = http.Request.Query["maxPrice"].FirstOrDefault();

                if (rarities.Length > 0)
                    query = query.Where(c => rarities.Contains(c.Rarity));

                if (types.Length > 0)
                    query = query.Where(c => types.Contains(c.Type));

                if (setNames.Length > 0)
                    query = query.Where(c => setNames.Contains(c.SetName));

                if (decimal.TryParse(minPrice, out var min))
                    query = query.Where(c => c.Price >= min);

                if (decimal.TryParse(maxPrice, out var max))
                    query = query.Where(c => c.Price <= max);

                return Results.Ok(await query.ToListAsync());
            });

            app.MapGet("/api/cards/types", async (AppDb db) =>
                Results.Ok(await db.Cards.Select(c => c.Type).Distinct().ToListAsync()));

            app.MapGet("/api/cards/rarities", async (AppDb db) =>
                Results.Ok(await db.Cards.Select(c => c.Rarity).Distinct().ToListAsync()));

            app.MapGet("/api/cards/expansions", async (AppDb db) =>
                Results.Ok(await db.Cards.Select(c => c.SetName).Distinct().ToListAsync()));
        }
    }
}