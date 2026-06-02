using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Services;
using Api;
using Helper;
using CloudinaryDotNet;

/**
 * Punto principal (main)de la aplicación.
 *
 * Funcionalidades:
 * - Configuración de servicios
 * - Configuración de Entity Framework
 * - Configuración de Cloudinary
 * - Configuración de CORS
 * - Ejecución de migraciones
 * - Ejecución de la importación de las cartas en segundo plano
 * - Registro de endpoints
 * - Inicialización del servidor web
 */

var builder = WebApplication.CreateBuilder(args);

/**
 * Configuración de Cloudinary.
 *
 * Se utiliza para:
 * - Subida de imágenes
 * - Gestión de avatars
 * - Almacenamiento en la nube
 */
var cloudinaryConfig = builder.Configuration.GetSection("Cloudinary");
var cloudinary = new Cloudinary(new Account(
    cloudinaryConfig["CloudName"],
    cloudinaryConfig["ApiKey"],
    cloudinaryConfig["ApiSecret"]
));
builder.Services.AddSingleton(cloudinary);

/**
 * Configuración de Entity Framework
 * usando MySQL.
 *
 * Características:
 * - MySQL 8
 * - Reintentos automáticos
 * - Inyección de dependencias
 */
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDb>(options =>
   options.UseMySql(
    connectionString,
    new MySqlServerVersion(new Version(8, 0, 45)),
    mysqlOptions => mysqlOptions.EnableRetryOnFailure()
));

/**
 * Registrar servicio de email.
 *
 */

builder.Services.AddScoped<EmailService>();

/**
 * Registrar servicio de importación
 * de cartas Pokémon.
 *
 */
builder.Services.AddScoped<CardImportService>();

/**
 * Configuración de CORS.
 *
 * Permite conexiones desde Angular
 * ejecutándose en localhost.
 */
builder.Services.AddCors(options =>
{
   
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost","http://localhost:4200", "http://localhost:4201", "http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

/**
 * Configuración de JWT ( Token).
 *
 * Se utiliza para:
 * - Autenticación
 * - Generación y validación de tokens
 * - Protección de endpoints
 *
 * La clave secreta debe coincidir con la usada en TokenHelper.GenerateToken()
 */
var Key = "CollectMarket2025-MiClave123354436478";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,           
            ValidateAudience = false,        
            ValidateLifetime = true,          
            ValidateIssuerSigningKey = true, 
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Key))
        };
    });

builder.Services.AddAuthorization();
var app = builder.Build();
app.UseCors("AllowAngular");

//Middleware autentificación
app.UseAuthentication();
app.UseAuthorization();


/**
 * Ejecutar migraciones automáticas
 * y carga inicial de datos.
 */
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDb>();
    try
    {
        await db.Database.MigrateAsync();
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error durante migración");
    }
}
StartCardImportInBackground(app);

/**
 * Inicia la importación de cartas en segundo plano.
 *
 * Se ejecuta de forma asíncrona para no bloquear
 * el arranque del servidor.
 *
 * Abre su propio contexto de base de datos
 * para poder ejecutarse independientemente.
 *
 * @param app Aplicación principal ASP.NET.
 */
static void StartCardImportInBackground(WebApplication app)
{
    Task.Run(async () =>
    {
        Console.WriteLine(" Iniciando importación de cartas...");
        using var scope = app.Services.CreateScope();
        var importService = scope.ServiceProvider.GetRequiredService<CardImportService>();
        var result = await importService.ImportCardsFromPokemonAPI();
        Console.WriteLine($" Importación finalizada: {result.Message}");
    });
}

/**
 * Registrar los endpoints de la aplicación.
 */
app.CardsEndpoints();
app.UsersEndpoints();
app.FavoritesEndpoints();
app.AuthEndpoints();
app.CartEndpoints();
app.OrdersEndpoints();
app.RecoverEndpoints();

/**
 * Endpoint Health Check.
 *
 * Permite verificar si la API
 * está funcionando correctamente.
 */
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));


/**
 * Iniciar aplicación web.
 */
app.Run();