using Microsoft.EntityFrameworkCore;
using Models;

namespace Api
{
    public static class Users
    {
        public static void UsersEndpoints(this WebApplication app)
        {

            app.MapGet("/api/users", async (AppDb db) =>
            {
                var users = await db.Users
                    .Select(u => new UserPublic
                    {
                        Id = u.Id,
                        Name = u.Name,
                        Email = u.Email,
                        CreatedAt = u.CreatedAt,
                        UpdatedAt = u.UpdatedAt
                    })
                    .ToListAsync();
                return Results.Ok(users);
            });

            app.MapGet("/api/users/{id}", async (int id, AppDb db) =>
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
                if (user == null) return Results.NotFound();

                var userDto = new UserPublic
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt
                };
                return Results.Ok(userDto);
            });

        }
    }
}