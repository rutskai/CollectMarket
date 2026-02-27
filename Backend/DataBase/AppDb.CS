// AppDb.cs
using Microsoft.EntityFrameworkCore;
using Models;

class AppDb : DbContext
{
    public AppDb(DbContextOptions<AppDb> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Card> Cards => Set<Card>();

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

    entity.Property(u => u.PasswordHash)
        .IsRequired()
        .HasMaxLength(255);

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
    }
}