namespace Models
{
    public class Pack
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int CardsInPack { get; set; }
        public string[]? PossibleRarities { get; set; }
        public bool IsLimited { get; set; }
        public decimal Discount { get; set; }
        public string CreatedAt { get; set; } = "";
        public string? UpdatedAt { get; set; }
    }
}