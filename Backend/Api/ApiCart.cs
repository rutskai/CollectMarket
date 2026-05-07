using Microsoft.EntityFrameworkCore;

namespace Api
{
    public static class Cart
    {
        public static void CartEndpoints(this WebApplication app)
        {
       
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

         
            app.MapDelete("/api/users/{userId}/cart", async (int userId, AppDb db) =>
            {
                var items = await db.CartItems
                    .Where(c => c.UserId == userId)
                    .ToListAsync();

                db.CartItems.RemoveRange(items);
                await db.SaveChangesAsync();

                return Results.NoContent();
            });

           
            app.MapGet("/api/users/{userId}/cart/{cardId}/check", async (int userId, int cardId, AppDb db) =>
            {
                var item = await db.CartItems
                    .FirstOrDefaultAsync(c => c.UserId == userId && c.CardId == cardId);

                return Results.Ok(new { inCart = item != null, quantity = item?.Quantity ?? 0 });
            });
        }
    }
}