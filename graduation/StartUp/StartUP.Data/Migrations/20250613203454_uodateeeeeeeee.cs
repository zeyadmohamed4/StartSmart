using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StartUP.Data.Migrations
{
    /// <inheritdoc />
    public partial class uodateeeeeeeee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectDetails_Projects_ProjectId",
                table: "ProjectDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_SuccessStories_Projects_ProjectId",
                table: "SuccessStories");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectDetails_Projects_ProjectId",
                table: "ProjectDetails",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SuccessStories_Projects_ProjectId",
                table: "SuccessStories",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectDetails_Projects_ProjectId",
                table: "ProjectDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_SuccessStories_Projects_ProjectId",
                table: "SuccessStories");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectDetails_Projects_ProjectId",
                table: "ProjectDetails",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SuccessStories_Projects_ProjectId",
                table: "SuccessStories",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
