using Models;

public class CartItem
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CardId { get; set; }
    public int Quantity { get; set; }
    public DateTime AddedAt { get; set; }
    public User User { get; set; } = null!;
    public Card Card { get; set; } = null!;
}