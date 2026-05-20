using Microsoft.EntityFrameworkCore;

namespace Api
{
    public static class Favorites
    {   
        /**
         * Registra todos los endpoints de favoritos.
         *
         * @param app Aplicación principal ASP.NET.
         */
        public static void FavoritesEndpoints(this WebApplication app)
        {
            /**
             * Obtiene todas las cartas favoritas
             * de un usuario.
             *
             * Incluye la información completa
             * de cada carta.
             *
             * @param userId ID del usuario.
             * @param db Contexto de base de datos.
             *
             * @return 200 OK con la lista de favoritos.
             */
            app.MapGet("/api/users/{userId}/favorites", async (int userId, AppDb db) =>
            {
                var favorites = await db.UserFavorites
                    .Where(f => f.UserId == userId)
                    .Include(f => f.Card)
                    .Select(f => f.Card)
                    .ToListAsync();

                return Results.Ok(favorites);
            });

            /**
             * Agrega una carta a favoritos.
             *
             * Validaciones:
             * - Evita duplicados
             * - Verifica existencia de usuario
             * - Verifica existencia de carta
             *
             * @param userId ID del usuario.
             * @param cardId ID de la carta.
             * @param db Contexto de base de datos.
             *
             * @return 201 Created si se agrega correctamente.
             * @return 404 NotFound si usuario o carta no existen.
             * @return 409 Conflict si ya existe en favoritos.
             */
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

             /**
             * Elimina una carta de favoritos.
             *
             * @param userId ID del usuario.
             * @param cardId ID de la carta.
             * @param db Contexto de base de datos.
             *
             * @return 204 NoContent si se elimina correctamente.
             * @return 404 NotFound si el favorito no existe.
             */
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

            /**
             * Verifica si una carta se encuentra
             * en favoritos del usuario.
             *
             * @param userId ID del usuario.
             * @param cardId ID de la carta.
             * @param db Contexto de base de datos.
             *
             * @return 200 OK con el estado del favorito (true o false).
             */
            app.MapGet("/api/users/{userId}/favorites/{cardId}/check", async (int userId, int cardId, AppDb db) =>
            {
                var isFavorite = await db.UserFavorites
                    .AnyAsync(f => f.UserId == userId && f.CardId == cardId);

                return Results.Ok(new { isFavorite });
            });
        }
    }
}