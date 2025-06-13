using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudGo.Data.Migrations
{
    /// <inheritdoc />
    public partial class alterInternshipTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "YearsOfExperience",
                table: "InternShips",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "YearsOfExperience",
                table: "InternShips");
        }
    }
}
