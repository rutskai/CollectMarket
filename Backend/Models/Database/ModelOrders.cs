namespace Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; } = "";
        public string Address { get; set; } = "";
        public string City { get; set; } = "";
        public string PostalCode { get; set; } = "";
        public string Country { get; set; } = "";
        public string PaymentMethod { get; set; } = "";
        public string CardNumber { get; set; } = "";
        public decimal Total { get; set; }
        public string Status { get; set; } = "pending";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }
        public List<OrderItem> Items { get; set; } = new();
    }

    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int CardId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        public Order? Order { get; set; }
        public Card? Card { get; set; }
    }

     public class OrderPublic
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = "";
        public string Address { get; set; } = "";
        public string City { get; set; } = "";
        public string PostalCode { get; set; } = "";
        public string Country { get; set; } = "";
        public string PaymentMethod { get; set; } = "";
        public string CardNumber { get; set; } = "";
        public List<OrderItemPublic> Items { get; set; } = new();
    }

    public class OrderItemPublic
    {
        public int CardId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}