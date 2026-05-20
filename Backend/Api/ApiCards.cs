using Microsoft.EntityFrameworkCore;

namespace Api
{
    public static class Cards
    {
         /**
         * Registra todos los endpoints de cartas.
         *
         * @param app Aplicación principal ASP.NET.
         */
        public static void CardsEndpoints(this WebApplication app)
        {

            /**
             * Obtiene todas las cartas disponibles.
             *
             * @param db Contexto de base de datos.
             *
             * @return 200 OK con la lista de cartas.
             */
            app.MapGet("/api/cards", async (AppDb db) =>
            {
                var cards = await db.Cards.ToListAsync();
                return Results.Ok(cards);
            });

            /**
             * Obtiene una carta por su ID.
             *
             * @param id ID de la carta.
             * @param db Contexto de base de datos.
             *
             * @return 200 OK si la carta existe.
             * @return 404 NotFound si no existe.
             */
            app.MapGet("/api/cards/{id}", async (int id, AppDb db) =>
            {
                var card = await db.Cards.FirstOrDefaultAsync(c => c.Id == id);
                return card is not null ? Results.Ok(card) : Results.NotFound();
            });

            /**
             * Obtiene cartas filtradas por rareza.
             *
             * @param rarity Rareza de las cartas.
             * @param db Contexto de base de datos.
             *
             * @return 200 OK con las cartas encontradas.
             */
            app.MapGet("/api/cards/rarity/{rarity}", async (string rarity, AppDb db) =>
            {
                var cards = await db.Cards.Where(c => c.Rarity == rarity).ToListAsync();
                return Results.Ok(cards);
            });
            
            /**
             * Busca cartas por nombre o expansión.
             *
             * La búsqueda se realiza usando coincidencias
             * parciales mediante Contains().
             *
             * @param term Texto de búsqueda.
             * @param db Contexto de base de datos.
             *
             * @return 200 OK con las cartas coincidentes.
             */
            app.MapGet("/api/cards/search/{term}", async (string term, AppDb db) =>
            {
                var cards = await db.Cards
                    .Where(c => c.Name.Contains(term) || (c.SetName != null && c.SetName.Contains(term)))
                    .ToListAsync();
                return Results.Ok(cards);
            });

            /**
             * Filtra cartas utilizando parámetros query.
             *
             * Filtros soportados:
             * - rarity
             * - type
             * - setName
             * - minPrice
             * - maxPrice
             *
             * @param http Contexto HTTP.
             * @param db Contexto de base de datos.
             *
             * @return 200 OK con las cartas filtradas.
             */
            app.MapGet("/api/cards/filter", async (
                HttpContext http,
                AppDb db) =>
            {
                var query = db.Cards.AsQueryable();

                var rarities = http.Request.Query["rarity"].ToArray();
                var types = http.Request.Query["type"].ToArray();
                var setNames = http.Request.Query["setName"].ToArray();
                var minPrice = http.Request.Query["minPrice"].FirstOrDefault();
                var maxPrice = http.Request.Query["maxPrice"].FirstOrDefault();

                if (rarities.Length > 0)
                    query = query.Where(c => rarities.Contains(c.Rarity));

                if (types.Length > 0)
                    query = query.Where(c => types.Contains(c.Type));

                if (setNames.Length > 0)
                    query = query.Where(c => setNames.Contains(c.SetName));

                if (decimal.TryParse(minPrice, out var min))
                    query = query.Where(c => c.Price >= min);

                if (decimal.TryParse(maxPrice, out var max))
                    query = query.Where(c => c.Price <= max);

                return Results.Ok(await query.ToListAsync());
            });

            /**
             * Obtiene todos los tipos de cartas disponibles.
             *
             * Los resultados son únicos usando Distinct().
             *
             * @param db Contexto de base de datos.
             *
             * @return 200 OK con la lista de tipos.
             */
            app.MapGet("/api/cards/types", async (AppDb db) =>
                Results.Ok(await db.Cards.Select(c => c.Type).Distinct().ToListAsync()));

             /**
             * Obtiene todas las rarezas disponibles.
             *
             * @param db Contexto de base de datos.
             *
             * @return 200 OK con la lista de rarezas.
             */
            app.MapGet("/api/cards/rarities", async (AppDb db) =>
                Results.Ok(await db.Cards.Select(c => c.Rarity).Distinct().ToListAsync()));

            /**
             * Obtiene todas las expansiones disponibles.
             *
             * @param db Contexto de base de datos.
             *
             * @return 200 OK con la lista de expansiones.
             */
            app.MapGet("/api/cards/expansions", async (AppDb db) =>
                Results.Ok(await db.Cards.Select(c => c.SetName).Distinct().ToListAsync()));
        }
    }
}