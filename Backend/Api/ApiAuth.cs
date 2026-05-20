using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Api
{
    public static class Auth
    {
        /**
         * Registra todos los endpoints
         * de autenticación.
         *
         * @param app Aplicación principal ASP.NET.
         */
        public static void AuthEndpoints(this WebApplication app)
        {

            /**
             * Endpoint para iniciar sesión.
             *
             * Funcionalidades:
             * - Verificar existencia del email
             * - Validar contraseña encriptada
             * - Retornar información pública del usuario
             *
             * @param request Datos de login.
             * @param db Contexto de base de datos.
             *
             * @return 200 OK con mensaje y datos públicos del usuario si el login es correcto.
             * @return 401 Unauthorized con objeto (mensaje personalizado )si la contraseña es incorrecta.
             * @return 404 NotFound con mensaje personalizado si el email no existe.
             */
            app.MapPost("/api/login", async (LoginRequest request, AppDb db) =>
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (user == null) 
                    return Results.NotFound(new { message = "Email no encontrado." });

                bool validPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
                if (!validPassword) 
                    return  Results.Json(new { message = "Contraseña incorrecta." }, statusCode: 401);

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

            /**
             * Endpoint para registrar usuarios.
             *
             * Funcionalidades:
             * - Verificar email único
             * - Encriptar contraseña
             * - Guardar usuario en BD
             *
             * @param request Datos del usuario.
             * @param db Contexto de base de datos.
             *
             * @return 201 Created si el usuario se registra.
             * @return 409 Conflict con mensaje si el email ya existe.
             */
            app.MapPost("/api/register", async (RegisterRequest request, AppDb db) =>
            {
                var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (existingUser != null) return Results.Conflict(new { message = "Email ya en uso." });

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

            /**
             * Endpoint para cambiar contraseña.
             *
             * Validaciones:
             * - Usuario existente
             * - Contraseña actual correcta
             * - Coincidencia de nuevas contraseñas
             * - Longitud mínima
             *
             * @param id ID del usuario.
             * @param request Datos del cambio.
             * @param db Contexto de base de datos.
             *
             * @return 200 OK con mensaje si se actualiza correctamente.
             * @return 400 BadRequest con mensaje si falla una validación.
             * @return 404 NotFound si el usuario no existe.
             */
            app.MapPut("/api/users/{id}/password", async (int id, ChangePasswordRequest request, AppDb db) =>
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
                if (user == null) return Results.NotFound();

                bool validPassword = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.Password);
                if (!validPassword) return Results.BadRequest("La contraseña actual no es correcta.");

                if (request.NewPassword != request.ConfirmPassword)
                    return Results.BadRequest("Las contraseñas nuevas no coinciden.");


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