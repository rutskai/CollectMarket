using Microsoft.EntityFrameworkCore;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
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

            app.MapPut("/api/users/{id}/name", async (int id, string name, AppDb db) =>
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
                if (user == null) return Results.NotFound();

                user.Name = name;
                user.UpdatedAt = DateTime.Now;
                await db.SaveChangesAsync();

                return Results.Ok(new { user.Id, user.Name });
            });
            
            // PUT - Actualizar avatar
            app.MapPut("/api/users/{id}/avatar", async (int id, IFormFile file, AppDb db, Cloudinary cloudinary) =>
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
                if (user == null) return Results.NotFound();

                // Validar extensión
                var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                var ext = Path.GetExtension(file.FileName).ToLower();
                if (!allowed.Contains(ext))
                    return Results.BadRequest("Formato no permitido.");

                // Validar tamaño (2MB)
                if (file.Length > 2 * 1024 * 1024)
                    return Results.BadRequest("Imagen demasiado grande.");

                // Subir a Cloudinary
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