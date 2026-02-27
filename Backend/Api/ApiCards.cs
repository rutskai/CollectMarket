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
        }
    }
}