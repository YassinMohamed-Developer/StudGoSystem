using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudGo.Data.Migrations
{
    /// <inheritdoc />
    public partial class InternshipTableAlter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeadlineDate",
                table: "InternShips");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "InternShips");

            migrationBuilder.DropColumn(
                name: "Duration",
                table: "InternShips");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "InternShips");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "InternShips");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "InternShips");

            migrationBuilder.DropColumn(
                name: "Salary",
                table: "InternShips");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "InternShips");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "InternShips");

            migrationBuilder.RenameColumn(
                name: "InternLinkUrl",
                table: "InternShips",
                newName: "Workplace");

            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "InternShips",
                newName: "JobUrl");

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "InternShips",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "CareerLevel",
                table: "InternShips",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "InternShips",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Company",
                table: "InternShips",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "InternShips",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JobDescription",
                table: "InternShips",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JobRequirements",
                table: "InternShips",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JobTitle",
                table: "InternShips",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JobType",
                table: "InternShips",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CareerLevel",
                table: "InternShips");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "InternShips");

            migrationBuilder.DropColumn(
                name: "Company",
                table: "InternShips");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "InternShips");

            migrationBuilder.DropColumn(
                name: "JobDescription",
                table: "InternShips");

            migrationBuilder.DropColumn(
                name: "JobRequirements",
                table: "InternShips");

            migrationBuilder.DropColumn(
                name: "JobTitle",
                table: "InternShips");

            migrationBuilder.DropColumn(
                name: "JobType",
                table: "InternShips");

            migrationBuilder.RenameColumn(
                name: "Workplace",
                table: "InternShips",
                newName: "InternLinkUrl");

            migrationBuilder.RenameColumn(
                name: "JobUrl",
                table: "InternShips",
                newName: "ImageUrl");

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "InternShips",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeadlineDate",
                table: "InternShips",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "InternShips",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "Duration",
                table: "InternShips",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "InternShips",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "InternShips",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "InternShips",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "Salary",
                table: "InternShips",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "InternShips",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "InternShips",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
