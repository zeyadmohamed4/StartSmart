using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StartUP.Data.Migrations
{
    /// <inheritdoc />
    public partial class changes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_ProjectDetails_ProjectDetailsId",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_fundingDetails_FundingDetailsId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_FundingDetailsId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_ProjectDetailsId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "FundingDetailsId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ProjectDetailsId",
                table: "Projects");

            migrationBuilder.AddColumn<int>(
                name: "ProjectId",
                table: "ProjectDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProjectId",
                table: "fundingDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectDetails_ProjectId",
                table: "ProjectDetails",
                column: "ProjectId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_fundingDetails_ProjectId",
                table: "fundingDetails",
                column: "ProjectId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_fundingDetails_Projects_ProjectId",
                table: "fundingDetails",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectDetails_Projects_ProjectId",
                table: "ProjectDetails",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_fundingDetails_Projects_ProjectId",
                table: "fundingDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectDetails_Projects_ProjectId",
                table: "ProjectDetails");

            migrationBuilder.DropIndex(
                name: "IX_ProjectDetails_ProjectId",
                table: "ProjectDetails");

            migrationBuilder.DropIndex(
                name: "IX_fundingDetails_ProjectId",
                table: "fundingDetails");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "ProjectDetails");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "fundingDetails");

            migrationBuilder.AddColumn<int>(
                name: "FundingDetailsId",
                table: "Projects",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProjectDetailsId",
                table: "Projects",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_FundingDetailsId",
                table: "Projects",
                column: "FundingDetailsId",
                unique: true,
                filter: "[FundingDetailsId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ProjectDetailsId",
                table: "Projects",
                column: "ProjectDetailsId",
                unique: true,
                filter: "[ProjectDetailsId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_ProjectDetails_ProjectDetailsId",
                table: "Projects",
                column: "ProjectDetailsId",
                principalTable: "ProjectDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_fundingDetails_FundingDetailsId",
                table: "Projects",
                column: "FundingDetailsId",
                principalTable: "fundingDetails",
                principalColumn: "Id");
        }
    }
}
