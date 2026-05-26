// AppDb.cs
using Microsoft.EntityFrameworkCore;
using Models;

/**
 *  Entity Framework.
 *
 * Se encarga de:
 * - Gestionar la conexión con la base de datos
 * - Definir las tablas mediante DbSet
 * - Configurar relaciones y restricciones
 * - Mapear entidades a tablas SQL
 */
class AppDb : DbContext
{
    /**
     * Recibe las opciones de configuración
     * definidas en Program.cs.
     *
     * @param options Opciones de Entity Framework.
     */
    public AppDb(DbContextOptions<AppDb> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Card> Cards => Set<Card>();
    public DbSet<UserFavorite> UserFavorites => Set<UserFavorite>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();   
    public DbSet<OrderItem> OrderItems => Set<OrderItem>(); 

    /**
     * Configuración avanzada de entidades.
     *
     * Aquí se definen:
     * - Tablas
     * - Claves primarias
     * - Relaciones
     * - Índices
     * - Restricciones
     * - Valores por defecto
     *
     * @param modelBuilder Constructor de modelos Entity Framework.
     */
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);


        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("User");
            entity.HasKey(u => u.Id);

            entity.Property(u => u.Name)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(u => u.Password)
                .IsRequired()
                .HasMaxLength(255);
            entity.Property(u => u.AvatarUrl)  
                .HasMaxLength(500);

            entity.Property(u => u.CreatedAt);

            entity.Property(u => u.UpdatedAt);

            entity.HasIndex(u => u.Email)
                .IsUnique();
        });


        modelBuilder.Entity<Card>(entity =>
        {
            entity.ToTable("Card");
            entity.HasKey(c => c.Id);

            entity.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(c => c.SetName)
                .HasMaxLength(255);

            entity.Property(c => c.Rarity)
                .HasMaxLength(100);

            entity.Property(c => c.Type)
                .HasMaxLength(50);

            entity.Property(c => c.ImageUrl)
                .HasMaxLength(255);

            entity.Property(c => c.Price)
                .HasColumnType("decimal(10,2)")
                .HasDefaultValue(0);

            entity.Property(c => c.Stock)
                .HasDefaultValue(0);

            entity.Property(c => c.Description);

            entity.Property(c => c.CreatedAt);
            entity.Property(c => c.UpdatedAt);

            entity.HasIndex(c => c.Name);
            entity.HasIndex(c => c.Rarity);
            entity.HasIndex(c => c.SetName);
        });

        modelBuilder.Entity<UserFavorite>(entity =>
       {
           entity.ToTable("UserFavorite");
           entity.HasKey(f => f.Id);

           entity.HasIndex(f => new { f.UserId, f.CardId }).IsUnique();

           entity.Property(f => f.CreatedAt);

           entity.HasOne(f => f.User)
               .WithMany()
               .HasForeignKey(f => f.UserId)
               .OnDelete(DeleteBehavior.Cascade);

           entity.HasOne(f => f.Card)
               .WithMany()
               .HasForeignKey(f => f.CardId)
               .OnDelete(DeleteBehavior.Cascade);
       });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.ToTable("CartItem");
            entity.HasKey(c => c.Id);

            entity.Property(c => c.Quantity)
                .HasDefaultValue(1);

            entity.Property(c => c.AddedAt);

            entity.HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.Card)
                .WithMany()
                .HasForeignKey(c => c.CardId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("Order");
            entity.HasKey(o => o.Id);
            entity.Property(o => o.Total).HasColumnType("decimal(10,2)");
            entity.Property(o => o.CreatedAt);
            entity.HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.ToTable("OrderItem");
            entity.HasKey(o => o.Id);
            entity.Property(o => o.UnitPrice).HasColumnType("decimal(10,2)");
            entity.HasOne(o => o.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(o => o.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(o => o.Card)
                .WithMany()
                .HasForeignKey(o => o.CardId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}