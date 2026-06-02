using System.ComponentModel.DataAnnotations.Schema;
using Models;

[Table("Card")]
public class Card
{
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("set_name")]
    public string? SetName { get; set; }

    [Column("rarity")]
    public string? Rarity { get; set; }

    [Column("type")]
    public string? Type { get; set; }

    [Column("image_url")]
    public string? ImageUrl { get; set; }

    [Column("price")]
    public decimal Price { get; set; } = 0;

    [Column("stock")]
    public int Stock { get; set; } = 0;

    [Column("description")]
    public string? Description { get; set; }

    [Column("seller_id")]          
    public int? SellerId { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    [ForeignKey("SellerId")]
    public virtual User? Seller { get; set; }
}

public class CardPublic
{
    public string Name { get; set; } = "";
    public string? SetName { get; set; }
    public string? Rarity { get; set; }
    public string? Type { get; set; }
    public string? ImageUrl { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string? Description { get; set; }
    public int? SellerId { get; set; }
    public string? SellerName { get; set; }
}