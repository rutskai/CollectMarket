using Microsoft.EntityFrameworkCore;
using Services;
using Api;
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

var app = builder.Build();
app.UseCors("AllowAngular");


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

        var importService = scope.ServiceProvider.GetRequiredService<CardImportService>();
        await importService.ImportCardsFromPokemonAPI();
    }
    catch (MySqlConnector.MySqlException ex) when (ex.Number == 1050) // Tabla ya existe
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogWarning("TABLAS YA EXISTENTES - se omite migración: {Message}", ex.Message);
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error durante migración o importación de datos");
    }
}

/**
 * Registrar los endpoints de la aplicación.
 */
app.CardsEndpoints();
app.UsersEndpoints();
app.FavoritesEndpoints();
app.AuthEndpoints();
app.CartEndpoints();
app.PacksEndpoints();

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