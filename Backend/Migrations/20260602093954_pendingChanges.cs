using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class pendingChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Card_seller_id",
                table: "Card",
                column: "seller_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Card_User_seller_id",
                table: "Card",
                column: "seller_id",
                principalTable: "User",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Card_User_seller_id",
                table: "Card");

            migrationBuilder.DropIndex(
                name: "IX_Card_seller_id",
                table: "Card");
        }
    }
}
