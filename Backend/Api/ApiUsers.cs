using Microsoft.EntityFrameworkCore;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Models;

namespace Api
{
    public static class Users
    {   
        /**
         * Registra todos los endpoints de usuarios.
         *
         * @param app Aplicación principal ASP.NET.
         */
        public static void UsersEndpoints(this WebApplication app)
        {
             /**
             * Obtiene todos los usuarios registrados.
             *
             * La respuesta utiliza la clase UserPublic
             * para evitar exponer la contraseña.
             *
             * @param db Contexto de base de datos.
             *
             * @return 200 OK con la lista de usuarios.
             */
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
            
             /**
             * Obtiene un usuario por ID.
             *
             * Devuelve únicamente información pública
             * mediante UserPublic.
             *
             * @param id ID del usuario.
             * @param db Contexto de base de datos.
             *
             * @return 200 OK si el usuario existe.
             * @return 404 NotFound si no existe.
             */
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

            /**
             * Actualiza el nombre de un usuario.
             *
             * @param id ID del usuario.
             * @param name Nuevo nombre.
             * @param db Contexto de base de datos.
             *
             * @return 200 OK si la actualización es exitosa.
             * @return 404 NotFound si el usuario no existe.
             */
            app.MapPut("/api/users/{id}/name", async (int id, string name, AppDb db) =>
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
                if (user == null) return Results.NotFound();

                user.Name = name;
                user.UpdatedAt = DateTime.Now;
                await db.SaveChangesAsync();

                return Results.Ok(new { user.Id, user.Name });
            });
            
            /**
             * Actualiza el avatar de un usuario.
             *
             * Funcionalidades:
             * - Validación de formato
             * - Validación de tamaño máximo
             * - Subida de imagen a Cloudinary
             * - Redimensionamiento automático
             *
             * Formatos permitidos: .jpg.jpeg.png.webp
             *
             * Tamaño máximo: 2 MB
             *
             * @param id ID del usuario.
             * @param file Archivo de imagen.
             * @param db Contexto de base de datos.
             * @param cloudinary Servicio Cloudinary.
             *
             * @return 200 OK si la imagen se actualiza.
             * @return 400 BadRequest si el archivo es inválido.
             * @return 404 NotFound si el usuario no existe.
             */
            app.MapPut("/api/users/{id}/avatar", async (int id, IFormFile file, AppDb db, Cloudinary cloudinary) =>
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
                if (user == null) return Results.NotFound();

     
                var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                var ext = Path.GetExtension(file.FileName).ToLower();
                if (!allowed.Contains(ext))
                    return Results.BadRequest("Formato no permitido.");

             
                if (file.Length > 2 * 1024 * 1024)
                    return Results.BadRequest("Imagen demasiado grande.");

               
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "avatars",
                    PublicId = $"user_{id}",
                    Overwrite = true,
                    Transformation = new Transformation().Width(200).Height(200).Crop("fill")
                };

                var uploadResult = await cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                    return Results.Problem(uploadResult.Error.Message);

                user.AvatarUrl = uploadResult.SecureUrl.ToString();
                user.UpdatedAt = DateTime.Now;
                await db.SaveChangesAsync();

                return Results.Ok(new { user.Id, user.AvatarUrl });
            }).DisableAntiforgery(); ;

        }
    }
}