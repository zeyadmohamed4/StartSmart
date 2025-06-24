using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StartUP.Data.Migrations
{
    /// <inheritdoc />
    public partial class daysleft : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DaysLeft",
                table: "fundingDetails");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "fundingDetails",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "fundingDetails");

            migrationBuilder.AddColumn<int>(
                name: "DaysLeft",
                table: "fundingDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
