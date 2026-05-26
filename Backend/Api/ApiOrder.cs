using Microsoft.EntityFrameworkCore;
using Models;

namespace Api
{
    public static class Orders
    {
        public static void OrdersEndpoints(this WebApplication app)
        {
            app.MapPost("/api/orders", async (OrderPublic body, AppDb db) =>
            {
    
                foreach (var item in body.Items)
                {
                    var card = await db.Cards.FirstOrDefaultAsync(c => c.Id == item.CardId);
                    
                    if (card == null)
                    {
                        return Results.BadRequest($"La carta con ID {item.CardId} no existe");
                    }

                    if (card.Stock < item.Quantity)
                    {
                        return Results.BadRequest($"Stock insuficiente para {card.Name}. Disponible: {card.Stock}, Solicitado: {item.Quantity}");
                    }

                      card.Stock -= item.Quantity;
                }

                var order = new Order
                {
                    UserId = body.UserId,
                    FullName = body.FullName,
                    Address = body.Address,
                    City = body.City,
                    PostalCode = body.PostalCode,
                    Country = body.Country,
                    PaymentMethod = body.PaymentMethod,
                    CardNumber = body.CardNumber,
                    Total = body.Items.Sum(i => i.UnitPrice * i.Quantity),
                    Status = "pending",
                    CreatedAt = DateTime.UtcNow,
                    Items = body.Items.Select(i => new OrderItem
                    {
                        CardId = i.CardId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice
                    }).ToList()
                };

                db.Orders.Add(order);

                await db.SaveChangesAsync();
                return Results.Ok(new { order.Id, order.Total, order.Status });
            });

            app.MapGet("/api/orders/{userId}", async (int userId, AppDb db) =>
            {
                try
                {
                    var orders = await db.Orders
                        .Where(o => o.UserId == userId)
                        .Include(o => o.Items)
                            .ThenInclude(i => i.Card)
                        .OrderByDescending(o => o.CreatedAt)
                        .Select(o => new  // Objeto anónimo, no tiene referencias circulares
                        {
                            o.Id,
                            o.UserId,
                            o.FullName,
                            o.Address,
                            o.City,
                            o.PostalCode,
                            o.Country,
                            o.PaymentMethod,
                            o.Total,
                            o.Status,
                            o.CreatedAt,
                            Items = o.Items.Select(i => new
                            {
                                i.CardId,
                                i.Quantity,
                                i.UnitPrice,
                                Card = i.Card != null ? new { i.Card.Id, i.Card.Name, i.Card.Price } : null
                            })
                        })
                        .ToListAsync();

                    return Results.Ok(orders);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                    return Results.Problem(ex.Message);
                }
            });
        }
    }
}