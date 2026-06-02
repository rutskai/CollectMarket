using System.Text.Json;
using Dapper;
using Models;
using Helper;
using MySql.Data.MySqlClient;

namespace Services
{
    /**
     * Servicio encargado de importar cartas
     * desde la API pública TCGdex.
     *
     * Funcionalidades:
     * - Obtener cartas desde la API
     * - Procesar información
     * - Generar precios y stock automáticos
     * - Insertar datos en MySQL usando Dapper
     */
    public class CardImportService
    {
        private readonly string _connectionString;

        /**
         * Obtiene la cadena de conexión desde
         * la configuración de la aplicación.
         *
         * @param configuration Configuración global.
         */
        public CardImportService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        /**
         * Importa cartas desde la API TCGdex.
         *
         * Orden:
         * 1. Obtener listas básicas por expansión
         * 2. Obtener detalles completos de cada carta
         * 3. Construir descripción y datos
         * 4. Insertar en base de datos
         *
         * @return Tuple con:
         * - Success indica éxito o fallo
         * - Message mensaje descriptivo
         * - Inserted cantidad insertada
         */
        public async Task<(bool Success, string Message, int Inserted)> ImportCardsFromPokemonAPI()
        {
            try
            {
                var sets = new Dictionary<string, string>
                {
                    { "base1", "Base" },
                    { "base2", "Jungle" },
                    { "base3", "Fossil" }
                };

                int totalInserted = 0;
                
                // Abrir conexión MySQL
                await using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();

                 var count = await connection.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM Card");
                if (count > 0)
                {
                    Console.WriteLine($" Ya hay {count} cartas en la BD, se omite la importación");
                    return (true, $"Ya hay {count} cartas importadas", 0);
                }

                /**
                 * Consulta SQL de inserción.
                 *
                 * INSERT IGNORE evita duplicados.
                 */
                const string sql = """
                INSERT IGNORE INTO Card
                (name, set_name, rarity, type, image_url, description, price, stock, created_at, updated_at)
                VALUES
                (@Name, @SetName, @Rarity, @Type, @ImageUrl, @Description, @Price, @Stock, NOW(), NOW());
                """;

                using var client = new HttpClient();
                client.Timeout = TimeSpan.FromSeconds(200);
                client.DefaultRequestHeaders.Add("User-Agent", "TCGdexImporter/1.0");

                foreach (var setId in sets.Keys)
                {
                    // Obtener lista básica de cartas
                    var listUrl = $"https://api.tcgdex.net/v2/en/cards?set={setId}";
                    var listResponse = await client.GetAsync(listUrl);

                    if (!listResponse.IsSuccessStatusCode)
                    {
                        return (false, $"Error al llamar a la API TCGdex: {listResponse.StatusCode} - {listResponse.ReasonPhrase}", totalInserted);
                    }

                    var listJson = await listResponse.Content.ReadAsStringAsync();
                    var basicCards = JsonSerializer.Deserialize<List<TCGdexBasicInfo>>(listJson, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (basicCards == null || basicCards.Count == 0) continue;

                    Console.WriteLine($"Procesando {basicCards.Count} cartas del set {setId}...");

                    foreach (var basicCard in basicCards)
                    {
                        try
                        {
                        
                            var detailUrl = $"https://api.tcgdex.net/v2/en/cards/{basicCard.Id}";
                            var detailResponse = await client.GetAsync(detailUrl);

                            if (!detailResponse.IsSuccessStatusCode)
                            {
                                Console.WriteLine($"⚠ No se pudo obtener detalle de {basicCard.Id}: {detailResponse.StatusCode}");
                                continue;
                            }

                            var detailJson = await detailResponse.Content.ReadAsStringAsync();
                            var fullCard = JsonSerializer.Deserialize<TCGdexCard>(detailJson, new JsonSerializerOptions
                            {
                                PropertyNameCaseInsensitive = true
                            });

                            if (fullCard == null) continue;

                          
                            string description = fullCard.Description ?? "";
                            if (string.IsNullOrWhiteSpace(description) && fullCard.Attacks != null && fullCard.Attacks.Length > 0)
                            {
                                description = string.Join("\n", fullCard.Attacks.Select(atk => 
                                {
                                    var effect = atk.Effect ?? "";
                                    var damage = atk.Damage != null ? $" ({atk.Damage})" : "";
                                    return $"{atk.Name}{damage} - {effect}";
                                }));
                            }
                            description = description.Trim();

                            
                            string rarity = fullCard.Rarity ?? "Common";

                            await connection.ExecuteAsync(sql, new
                            {
                                Name = fullCard.Name,
                                SetName = sets.GetValueOrDefault(setId, "Unknown"),
                                Rarity = rarity,
                                Type = fullCard.Types != null ? string.Join(", ", fullCard.Types) : "Sin tipo",
                                ImageUrl = fullCard.Image ?? basicCard.Image,
                                Description = description,
                                Price = CardPriceHelper.GeneratePrice(rarity),
                                Stock = CardPriceHelper.GenerateStock(rarity)
                            });

                            totalInserted++;
                            
                            // Pequeña pausa para no sobrecargar la API
                            await Task.Delay(50);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error procesando carta {basicCard.Id}: {ex.Message}");
                        }
                    }
                    Console.WriteLine($"✔ {setId} → {basicCards.Count} cartas procesadas");
                }

                await connection.CloseAsync();
                return (true, $"✔ Cartas insertadas: {totalInserted}", totalInserted);
            }
            catch (Exception ex)
            {
                return (false, $"Error durante la importación: {ex.Message}", 0);
            }
        }
   
    }
}