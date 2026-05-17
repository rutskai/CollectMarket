using Microsoft.EntityFrameworkCore;
using Models;

namespace Api
{
    public static class Auth
    {
        public static void AuthEndpoints(this WebApplication app)
        {

            app.MapPost("/api/login", async (LoginRequest request, AppDb db) =>
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (user == null) return Results.Unauthorized();

                bool validPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
                if (!validPassword) return Results.Unauthorized();

                return Results.Ok(new
                {
                    message = "Login exitoso!",
                    user = new
                    {
                        id = user.Id,
                        name = user.Name,
                        email = user.Email
                    }
                });
            });

            app.MapPost("/api/register", async (RegisterRequest request, AppDb db) =>
            {
                var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (existingUser != null) return Results.Conflict("Email ya en uso");

                var user = new User
                {
                    Name = request.Name,
                    Email = request.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                db.Users.Add(user);
                await db.SaveChangesAsync();

                return Results.Created($"/api/users/{user.Id}", new UserPublic
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt
                });
            });

            // PUT - Cambiar contraseña
        app.MapPut("/api/users/{id}/password", async (int id, ChangePasswordRequest request, AppDb db) =>
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return Results.NotFound();

            // Verificar contraseña actual
            bool validPassword = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.Password);
            if (!validPassword) return Results.BadRequest("La contraseña actual no es correcta.");

            // Verificar que las nuevas coinciden
            if (request.NewPassword != request.ConfirmPassword)
                return Results.BadRequest("Las contraseñas nuevas no coinciden.");

            // Validar longitud mínima
            if (request.NewPassword.Length < 6)
                return Results.BadRequest("La contraseña debe tener al menos 6 carácteres.");

            user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.Now;
            await db.SaveChangesAsync();

            return Results.Ok(new { message = "Contraseña actualizada correctamente." });
        });

        }
    }
}