using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StartUP.Data.Migrations
{
    /// <inheritdoc />
    public partial class add_relation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CampaignDealType",
                table: "Projects");

            migrationBuilder.AddColumn<int>(
                name: "CompanyDealId",
                table: "Projects",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_CompanyDealId",
                table: "Projects",
                column: "CompanyDealId");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_CampaignDeals_CompanyDealId",
                table: "Projects",
                column: "CompanyDealId",
                principalTable: "CampaignDeals",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_CampaignDeals_CompanyDealId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_CompanyDealId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "CompanyDealId",
                table: "Projects");

            migrationBuilder.AddColumn<string>(
                name: "CampaignDealType",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
