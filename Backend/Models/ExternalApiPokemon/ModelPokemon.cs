using System.Text.Json.Serialization;

namespace Models
{
    public class ApiResponse
    {
        [JsonPropertyName("data")]
        public List<PokemonCard> Data { get; set; } = new();
    }

    public class PokemonCard
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = "";

        [JsonPropertyName("name")]
        public string Name { get; set; } = "";

        [JsonPropertyName("rarity")]
        public string? Rarity { get; set; }

        [JsonPropertyName("types")]
        public List<string>? Types { get; set; }

        [JsonPropertyName("set")]
        public CardSet Set { get; set; } = new();

        [JsonPropertyName("images")]
        public CardImages Images { get; set; } = new();
    }

    public class CardSet
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = "";

        [JsonPropertyName("name")]
        public string Name { get; set; } = "";
    }

    public class CardImages
    {
        [JsonPropertyName("small")]
        public string Small { get; set; } = "";

        [JsonPropertyName("large")]
        public string Large { get; set; } = "";
    }
}
