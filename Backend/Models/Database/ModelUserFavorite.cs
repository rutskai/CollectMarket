using System.ComponentModel.DataAnnotations.Schema;
using Models;

[Table("UserFavorite")]
public class UserFavorite
{
    [Column("id")]
    public int Id { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("card_id")]
    public int CardId { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // Navegación
    public User User { get; set; } = null!;
    public Card Card { get; set; } = null!;
}