using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StartUP.Data.Migrations
{
    /// <inheritdoc />
    public partial class investment_status : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "InvestmentStatus",
                table: "Investments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "Invest");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InvestmentStatus",
                table: "Investments");
        }
    }
}
