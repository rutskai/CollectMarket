using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace Api
{
    public static class Recover
    {
        /**
         * Registra todos los endpoints de recuperación de contraseña.
         *
         * @param app Aplicación principal ASP.NET.
         */
        public static void RecoverEndpoints(this WebApplication app)
        {
            /**
             * Solicita recuperación de contraseña.
             * Genera una contraseña temporal de 8 caracteres,
             * la hashea y la guarda en la BD con expiración de 24 horas.
             * Envía la contraseña temporal por email.
             *
             * @param request Email del usuario
             * @param db Contexto de base de datos
             * @param emailService Servicio para enviar emails
             * @return 200 OK con mensaje genérico
             */
            app.MapPost("/api/auth/recover", async (RecoverRequest request, AppDb db, [FromServices] EmailService emailService) =>
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

                if (user != null)
                {
                    var tempPassword = GenerateTempPassword();

                    var resetToken = new PasswordResetToken
                    {
                        UserId = user.Id,
                        Token = tempPassword,
                        ExpiresAt = DateTime.UtcNow.AddDays(1)
                    };

                    db.PasswordResetTokens.Add(resetToken);

                    user.Password = BCrypt.Net.BCrypt.HashPassword(tempPassword);
                    user.UpdatedAt = DateTime.UtcNow;

                    await db.SaveChangesAsync();

                    var body = $@"
                        <h2>Recuperación de contraseña - CollectMarket</h2>
                        <p>Hemos generado una contraseña temporal para tu cuenta:</p>
                        <h3 style='background:#f4f4f4;padding:12px;border-radius:8px;letter-spacing:2px;'>{tempPassword}</h3>
                        <p>Esta contraseña expira en <strong>24 horas</strong>.</p>
                        <p>Una vez que inicies sesión, ve a tu perfil y cambia la contraseña.</p>
                        <p>Si no solicitaste esto, ignora este mensaje.</p>
                    ";

                    await emailService.SendEmailAsync(user.Email, "Contraseña temporal - CollectMarket", body);
                }

                return Results.Ok(new { message = "Si el email existe, recibirás una contraseña temporal." });
            });

            /**
             * Genera una contraseña temporal aleatoria de 8 caracteres.
             *
             * @return Contraseña temporal.
             */
            static string GenerateTempPassword()
            {
                const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
                var random = new Random();
                return new string(Enumerable.Range(0, 8).Select(_ => chars[random.Next(chars.Length)]).ToArray());
            }
        }
    }
}