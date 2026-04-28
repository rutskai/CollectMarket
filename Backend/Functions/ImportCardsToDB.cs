using System.Text.Json;
using Dapper;
using Models;
using MySql.Data.MySqlClient;

namespace Services
{
    public class CardImportService
    {
        private readonly string _connectionString;

        public CardImportService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

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

                await using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();

                const string sql = """
                INSERT IGNORE INTO Card
                (name, set_name, rarity, type, image_url, description, price, stock)
                VALUES
                (@Name, @SetName, @Rarity, @Type, @ImageUrl, @Description, @Price, @Stock);
                """;

                using var client = new HttpClient();
                client.Timeout = TimeSpan.FromSeconds(200);
                client.DefaultRequestHeaders.Add("User-Agent", "TCGdexImporter/1.0");

                foreach (var setId in sets.Keys)
                {
                    // Paso 1: Obtener lista básica de cartas
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
                            // Paso 2: Obtener detalles completos de cada carta
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

                            // Construir descripción
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

                            // Determinar rareza (ahora viene del detalle)
                            string rarity = fullCard.Rarity ?? "Common";

                            await connection.ExecuteAsync(sql, new
                            {
                                Name = fullCard.Name,
                                SetName = sets.GetValueOrDefault(setId, "Unknown"),
                                Rarity = rarity,
                                Type = fullCard.Types != null ? string.Join(", ", fullCard.Types) : "Sin tipo",
                                ImageUrl = fullCard.Image ?? basicCard.Image,
                                Description = description,
                                Price = GeneratePrice(rarity),
                                Stock = GenerateStock(rarity)
                            });

                            totalInserted++;
                            
                            // Pequeña pausa para no sobrecargar la API
                            await Task.Delay(50);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"❌ Error procesando carta {basicCard.Id}: {ex.Message}");
                        }
                    }
                    Console.WriteLine($"✅ {setId} → {basicCards.Count} cartas procesadas");
                }

                await connection.CloseAsync();
                return (true, $"✔ Cartas insertadas: {totalInserted}", totalInserted);
            }
            catch (Exception ex)
            {
                return (false, $"Error durante la importación: {ex.Message}", 0);
            }
        }

        private static decimal GeneratePrice(string rarity)
        {
            return rarity switch
            {
                "Common" => 0.50m,
                "Uncommon" => 1.50m,
                "Rare" => 5.00m,
                "Rare Holo" => 15.00m,
                _ => 1.00m
            };
        }

        private static int GenerateStock(string? rarity)
        {
            rarity ??= "Unknown";

            return rarity switch
            {
                "Common" => Random.Shared.Next(50, 100),
                "Uncommon" => Random.Shared.Next(30, 60),
                "Rare" => Random.Shared.Next(10, 30),
                "Rare Holo" => Random.Shared.Next(5, 15),
                "Promo" => Random.Shared.Next(5, 10),
                _ => 20
            };
        }
    }
}