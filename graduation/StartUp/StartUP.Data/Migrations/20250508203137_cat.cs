using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StartUP.Data.Migrations
{
    /// <inheritdoc />
    public partial class cat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "SuccessStories");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "SuccessStories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
