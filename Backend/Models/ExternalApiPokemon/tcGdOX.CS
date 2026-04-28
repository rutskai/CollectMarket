using System.Text.Json.Serialization;

public class TCGdexCard
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = "";

    [JsonPropertyName("localId")]
    public string LocalId { get; set; } = "";

    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [JsonPropertyName("rarity")]
    public string? Rarity { get; set; }

    [JsonPropertyName("image")]
    public string? Image { get; set; }

    [JsonPropertyName("types")]
    public string[]? Types { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("attacks")]
    public Attack[]? Attacks { get; set; }
}

public class Attack
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [JsonPropertyName("cost")]
    public string[]? Cost { get; set; }

    [JsonPropertyName("damage")]
    public object? Damage { get; set; } 

    [JsonPropertyName("effect")]
    public string? Effect { get; set; }
    
    // Método helper para obtener el daño como string
    public string GetDamageString()
    {
        return Damage?.ToString() ?? "";
    }
}

public class TCGdexBasicInfo
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = "";

    [JsonPropertyName("localId")]
    public string LocalId { get; set; } = "";

    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [JsonPropertyName("image")]
    public string? Image { get; set; }
}