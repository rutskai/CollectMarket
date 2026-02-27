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

                foreach (var setId in sets.Keys)
                {


                    var url = $"https://api.tcgdex.net/v2/en/cards?set={setId}";
                    var response = await client.GetAsync(url);

                    if (!response.IsSuccessStatusCode)
                    {
                        return (false, $"Error al llamar a la API TCGdex: {response.StatusCode} - {response.ReasonPhrase}", totalInserted);
                    }

                    var json = await response.Content.ReadAsStringAsync();
                    var cards = JsonSerializer.Deserialize<List<TCGdexCard>>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (cards == null || cards.Count == 0) continue;

                    foreach (var card in cards)
                    {


                        // Construimos la descripción combinando ataques + flavor text
                        string description = card.Description ?? "";

                        if (card.Attacks != null)
                        {
                            foreach (var atk in card.Attacks)
                            {
                                description = string.Join("\n", card.Attacks.Select(atk => $"{atk.Name} - {atk.Effect}"));
                            }
                        }
                        description = description.Trim();

                        totalInserted += await connection.ExecuteAsync(sql, new
                        {
                            Name = card.Name,
                            SetName = sets.GetValueOrDefault(setId, "Unknown"),
                            Rarity = card.Rarity ?? "Common",
                            Type = card.Types != null ? string.Join(", ", card.Types) : "Sin tipo",
                            ImageUrl = card.Image,
                            Description = description.Trim(),
                            Price = GeneratePrice(card.Rarity ?? "Common"),
                            Stock = GenerateStock(card.Rarity ?? "Common")
                        });
                    }
                    Console.WriteLine($"{setId} → {cards.Count} cartas");
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