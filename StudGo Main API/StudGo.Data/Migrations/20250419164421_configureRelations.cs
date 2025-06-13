using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudGo.Data.Migrations
{
    /// <inheritdoc />
    public partial class configureRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_StudentActivities_StudentActivityId",
                table: "Activities");

            migrationBuilder.DropForeignKey(
                name: "FK_Contents_Activities_ActivityId",
                table: "Contents");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_StudentActivities_StudentActivityId",
                table: "Activities",
                column: "StudentActivityId",
                principalTable: "StudentActivities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Contents_Activities_ActivityId",
                table: "Contents",
                column: "ActivityId",
                principalTable: "Activities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_StudentActivities_StudentActivityId",
                table: "Activities");

            migrationBuilder.DropForeignKey(
                name: "FK_Contents_Activities_ActivityId",
                table: "Contents");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_StudentActivities_StudentActivityId",
                table: "Activities",
                column: "StudentActivityId",
                principalTable: "StudentActivities",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Contents_Activities_ActivityId",
                table: "Contents",
                column: "ActivityId",
                principalTable: "Activities",
                principalColumn: "Id");
        }
    }
}
