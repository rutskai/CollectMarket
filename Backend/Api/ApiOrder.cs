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
                var orders = await db.Orders
                    .Where(o => o.UserId == userId)
                    .Include(o => o.Items)
                    .ThenInclude(i => i.Card)
                    .OrderByDescending(o => o.CreatedAt)
                    .ToListAsync();

                return Results.Ok(orders);
            });
        }
    }
}