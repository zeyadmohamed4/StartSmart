using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StartUP.Data.Migrations
{
    /// <inheritdoc />
    public partial class add_contract : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "Investments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "Investments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Signature",
                table: "Investments",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FullName",
                table: "Investments");

            migrationBuilder.DropColumn(
                name: "Image",
                table: "Investments");

            migrationBuilder.DropColumn(
                name: "Signature",
                table: "Investments");
        }
    }
}
