using Microsoft.EntityFrameworkCore;

namespace Api
{
    public static class Favorites
    {
        public static void FavoritesEndpoints(this WebApplication app)
        {
         
            app.MapGet("/api/users/{userId}/favorites", async (int userId, AppDb db) =>
            {
                var favorites = await db.UserFavorites
                    .Where(f => f.UserId == userId)
                    .Include(f => f.Card)
                    .Select(f => f.Card)
                    .ToListAsync();

                return Results.Ok(favorites);
            });

        
            app.MapPost("/api/users/{userId}/favorites/{cardId}", async (int userId, int cardId, AppDb db) =>
            {
           
                var exists = await db.UserFavorites
                    .AnyAsync(f => f.UserId == userId && f.CardId == cardId);

                if (exists)
                    return Results.Conflict("Esta carta ya está en favoritos.");

              
                var userExists = await db.Users.AnyAsync(u => u.Id == userId);
                var cardExists = await db.Cards.AnyAsync(c => c.Id == cardId);

                if (!userExists || !cardExists)
                    return Results.NotFound("Usuario o carta no encontrados.");

                var favorite = new UserFavorite
                {
                    UserId = userId,
                    CardId = cardId,
                    CreatedAt = DateTime.Now
                };

                db.UserFavorites.Add(favorite);
                await db.SaveChangesAsync();

                return Results.Created($"/api/users/{userId}/favorites/{cardId}", favorite);
            });

     
            app.MapDelete("/api/users/{userId}/favorites/{cardId}", async (int userId, int cardId, AppDb db) =>
            {
                var favorite = await db.UserFavorites
                    .FirstOrDefaultAsync(f => f.UserId == userId && f.CardId == cardId);

                if (favorite is null)
                    return Results.NotFound("Favorito no encontrado.");

                db.UserFavorites.Remove(favorite);
                await db.SaveChangesAsync();

                return Results.NoContent();
            });

         
            app.MapGet("/api/users/{userId}/favorites/{cardId}/check", async (int userId, int cardId, AppDb db) =>
            {
                var isFavorite = await db.UserFavorites
                    .AnyAsync(f => f.UserId == userId && f.CardId == cardId);

                return Results.Ok(new { isFavorite });
            });
        }
    }
}