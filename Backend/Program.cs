using Microsoft.EntityFrameworkCore;
using Services;
using Api;

var builder = WebApplication.CreateBuilder(args);

// CONFIGURAR SERVICIOS
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Agregar Entity Framework con MySQL
builder.Services.AddDbContext<AppDb>(options =>
   options.UseMySql(
    connectionString,
    new MySqlServerVersion(new Version(8, 0, 45)),
    mysqlOptions => mysqlOptions.EnableRetryOnFailure()
));

// Registrar servicio de importación
builder.Services.AddScoped<CardImportService>();

// CORS para Angular
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

// -------------------------------------------------------------------------------------------------------------------------------------

var app = builder.Build();
app.UseCors("AllowAngular");

// Docker Migraciones Database
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

// ENDPOINTS: Cartas
Cards.CardsEndpoints(app);
// ENDPOINTS: Usuarios
Users.UsersEndpoints(app);

Auth.AuthEndpoints(app);
// Health check
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

// EJECUTAR
app.Run();