using System.Net;
using System.Net.Mail;

/**
 * Servicio encargado de enviar emails.
 *
 * Utiliza SMTP de Gmail para el envío.
 */
public class EmailService
{
    private readonly string smtpServer;
    private readonly int smtpPort;
    private readonly string senderEmail;
    private readonly string senderPassword;
    private readonly string senderName;

    /**
     * Obtiene la configuración de email
     * desde appsettings.json.
     *
     * @param configuration Configuración global.
     */
    public EmailService(IConfiguration configuration)
    {
        smtpServer    = configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
        smtpPort      = int.TryParse(configuration["EmailSettings:SmtpPort"], out var port) ? port : 587;
        senderEmail   = configuration["EmailSettings:SenderEmail"] ?? "";
        senderPassword = configuration["EmailSettings:SenderPassword"] ?? "";
        senderName    = configuration["EmailSettings:SenderName"] ?? "CollectMarket";
    }

    /**
     * Envía un email HTML.
     *
     * @param to Destinatario.
     * @param subject Asunto.
     * @param body Cuerpo HTML.
     */
    public async Task SendEmailAsync(string to, string subject, string body)
    {
        using var smtp = new SmtpClient(smtpServer)
        {
            Port        = smtpPort,
            Credentials = new NetworkCredential(senderEmail, senderPassword),
            EnableSsl   = true,
        };

        var mail = new MailMessage
        {
            From       = new MailAddress(senderEmail, senderName),
            Subject    = subject,
            Body       = body,
            IsBodyHtml = true,
        };

        mail.To.Add(to);
        await smtp.SendMailAsync(mail);
    }
}