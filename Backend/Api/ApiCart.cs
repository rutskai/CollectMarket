using Microsoft.EntityFrameworkCore;

namespace Api
{
    public static class Cart
    {   
        /**
         * Registra todos los endpoints del carrito.
         *
         * @param app Aplicación principal ASP.NET.
         */
        public static void CartEndpoints(this WebApplication app)
        {
            /**
             * Obtiene todos los productos del carrito
             * de un usuario específico.
             *
             * Incluye la información completa de la carta.
             *
             * @param userId ID del usuario.
             * @param db Contexto de base de datos.
             *
             * @return 200 OK con los elementos del carrito.
             */
            app.MapGet("/api/users/{userId}/cart", async (int userId, AppDb db) =>
            {
                var items = await db.CartItems
                    .Where(c => c.UserId == userId)
                    .Include(c => c.Card)
                    .Select(c => new {
                        c.Id,
                        c.UserId,
                        c.CardId,
                        c.Quantity,
                        c.AddedAt,
                        Card = c.Card
                    })
                    .ToListAsync();

                return Results.Ok(items);
            });

           /**
             * Agrega una carta al carrito.
             *
             * Si la carta ya existe en el carrito,
             * incrementa automáticamente la cantidad.
             *
             * @param userId ID del usuario.
             * @param cardId ID de la carta.
             * @param db Contexto de base de datos.
             *
             * @return 201 Created si se crea el item.
             * @return 200 OK si se actualiza cantidad.
             * @return 404 NotFound si usuario o carta no existen.
             */
            app.MapPost("/api/users/{userId}/cart/{cardId}", async (int userId, int cardId, AppDb db) =>
            {
                var userExists = await db.Users.AnyAsync(u => u.Id == userId);
                var cardExists = await db.Cards.AnyAsync(c => c.Id == cardId);

                if (!userExists || !cardExists)
                    return Results.NotFound("Usuario o carta no encontrados.");

                var existing = await db.CartItems
                    .FirstOrDefaultAsync(c => c.UserId == userId && c.CardId == cardId);

                if (existing != null)
                {
                    existing.Quantity += 1;
                    await db.SaveChangesAsync();
                    return Results.Ok(existing);
                }

                var item = new CartItem
                {
                    UserId = userId,
                    CardId = cardId,
                    Quantity = 1,
                    AddedAt = DateTime.Now
                };

                db.CartItems.Add(item);
                await db.SaveChangesAsync();

                return Results.Created($"/api/users/{userId}/cart/{cardId}", item);
            });

           /**
             * Actualiza la cantidad de un producto
             * dentro del carrito.
             *
             * Si la cantidad es menor o igual a 0,
             * la carta se elimina automáticamente.
             *
             * @param userId ID del usuario.
             * @param cardId ID de la carta.
             * @param quantity Nueva cantidad.
             * @param db Contexto de base de datos.
             *
             * @return 204 NoContent si se actualiza correctamente.
             * @return 404 NotFound si el item no existe.
             */
            app.MapPut("/api/users/{userId}/cart/{cardId}", async (int userId, int cardId, int quantity, AppDb db) =>
            {
                var item = await db.CartItems
                    .FirstOrDefaultAsync(c => c.UserId == userId && c.CardId == cardId);

                if (item is null)
                    return Results.NotFound("Item no encontrado en el carrito.");

                if (quantity <= 0)
                {
                    db.CartItems.Remove(item);
                }
                else
                {
                    item.Quantity = quantity;
                }

                await db.SaveChangesAsync();
                return Results.NoContent();
            });

          /**
             * Elimina una carta específica del carrito.
             *
             * @param userId ID del usuario.
             * @param cardId ID de la carta.
             * @param db Contexto de base de datos.
             *
             * @return 204 NoContent si se elimina correctamente.
             * @return 404 NotFound si el item no existe.
             */
            app.MapDelete("/api/users/{userId}/cart/{cardId}", async (int userId, int cardId, AppDb db) =>
            {
                var item = await db.CartItems
                    .FirstOrDefaultAsync(c => c.UserId == userId && c.CardId == cardId);

                if (item is null)
                    return Results.NotFound("Item no encontrado en el carrito.");

                db.CartItems.Remove(item);
                await db.SaveChangesAsync();

                return Results.NoContent();
            });

            /**
             * Vacía completamente el carrito
             * de un usuario.
             *
             * @param userId ID del usuario.
             * @param db Contexto de base de datos.
             *
             * @return 204 NoContent si se eliminan los items.
             */
            app.MapDelete("/api/users/{userId}/cart", async (int userId, AppDb db) =>
            {
                var items = await db.CartItems
                    .Where(c => c.UserId == userId)
                    .ToListAsync();

                db.CartItems.RemoveRange(items);
                await db.SaveChangesAsync();

                return Results.NoContent();
            });

            /**
             * Verifica si una carta está presente
             * en el carrito del usuario.
             *
             * Devuelve:
             * - inCart → indica si existe
             * - quantity → cantidad actual
             *
             * @param userId ID del usuario.
             * @param cardId ID de la carta.
             * @param db Contexto de base de datos.
             *
             * @return 200 OK con el estado del item.
             */
            app.MapGet("/api/users/{userId}/cart/{cardId}/check", async (int userId, int cardId, AppDb db) =>
            {
                var item = await db.CartItems
                    .FirstOrDefaultAsync(c => c.UserId == userId && c.CardId == cardId);

                return Results.Ok(new { inCart = item != null, quantity = item?.Quantity ?? 0 });
            });
        }
    }
}