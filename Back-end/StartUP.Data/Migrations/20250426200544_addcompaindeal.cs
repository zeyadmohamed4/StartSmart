using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StartUP.Data.Migrations
{
    /// <inheritdoc />
    public partial class addcompaindeal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IncomePreference",
                table: "Investments");

            migrationBuilder.DropColumn(
                name: "InvestmentHorizon",
                table: "Investments");

            migrationBuilder.DropColumn(
                name: "RiskTolerance",
                table: "Investments");

            migrationBuilder.DropColumn(
                name: "TermLength",
                table: "Investments");

            migrationBuilder.AlterColumn<decimal>(
                name: "InterestRate",
                table: "Investments",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AddColumn<decimal>(
                name: "EquityPercentage",
                table: "Investments",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RevenueShare",
                table: "Investments",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CampaignDeals",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DealType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RiskTolerance = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InvestmentHorizon = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IncomePreference = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RepaymentTerms = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OwnershipOffered = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    MaturityDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ValuationCap = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    DiscountRate = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RepaymentCap = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Colletral = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConversionTrigger = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CampaignDeals", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CampaignDeals");

            migrationBuilder.DropColumn(
                name: "EquityPercentage",
                table: "Investments");

            migrationBuilder.DropColumn(
                name: "RevenueShare",
                table: "Investments");

            migrationBuilder.AlterColumn<double>(
                name: "InterestRate",
                table: "Investments",
                type: "float",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IncomePreference",
                table: "Investments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "InvestmentHorizon",
                table: "Investments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RiskTolerance",
                table: "Investments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TermLength",
                table: "Investments",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
