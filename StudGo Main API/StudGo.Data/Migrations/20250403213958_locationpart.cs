using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudGo.Data.Migrations
{
    /// <inheritdoc />
    public partial class locationpart : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "City",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "Governorate",
                table: "Activities");

            migrationBuilder.RenameColumn(
                name: "Governorate",
                table: "StudentActivities",
                newName: "WebsiteUrl");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "StudentActivities",
                newName: "JoinFormUrl");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Students",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "FoundingDate",
                table: "StudentActivities",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "StudentActivities",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "StudentActivities",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "ActivityCategory",
                table: "Activities",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Activities",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Activities",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "StudentActivities");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "StudentActivities");

            migrationBuilder.DropColumn(
                name: "ActivityCategory",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Activities");

            migrationBuilder.RenameColumn(
                name: "WebsiteUrl",
                table: "StudentActivities",
                newName: "Governorate");

            migrationBuilder.RenameColumn(
                name: "JoinFormUrl",
                table: "StudentActivities",
                newName: "City");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "FoundingDate",
                table: "StudentActivities",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Activities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Governorate",
                table: "Activities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
