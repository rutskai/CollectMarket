using Microsoft.EntityFrameworkCore;
using Services;
using Api;

var builder = WebApplication.CreateBuilder(args);

// CONFIGURAR SERVICIOS
var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION") 
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

// Agregar Entity Framework con MySQL
builder.Services.AddDbContext<AppDb>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
    )
);

// Registrar servicio de importación
builder.Services.AddScoped<CardImportService>();

// CORS para Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:4201", "http://localhost:3000")
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
    db.Database.Migrate();
}

// ENDPOINTS: Cartas
Cards.CardsEndpoints(app);
// ENDPOINTS: Usuarios
Users.UsersEndpoints(app);

Auth.AuthEndpoints(app);
// Health check
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

 CardImportService importService= new CardImportService(builder.Configuration);
 await importService.ImportCardsFromPokemonAPI();


// EJECUTAR
app.Run("http://localhost:5000");