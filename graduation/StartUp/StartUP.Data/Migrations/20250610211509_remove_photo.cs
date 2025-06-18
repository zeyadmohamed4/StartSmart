using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StartUP.Data.Migrations
{
    /// <inheritdoc />
    public partial class remove_photo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Photo",
                table: "Projects");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Photo",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
