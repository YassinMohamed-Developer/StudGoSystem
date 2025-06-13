using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudGo.Data.Migrations
{
    /// <inheritdoc />
    public partial class scoreAttribute : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentStudentActivity_StudentActivities_StudentActivitiesId",
                table: "StudentStudentActivity");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentStudentActivity_Students_StudentsId",
                table: "StudentStudentActivity");

            migrationBuilder.RenameColumn(
                name: "StudentsId",
                table: "StudentStudentActivity",
                newName: "StudentId");

            migrationBuilder.RenameColumn(
                name: "StudentActivitiesId",
                table: "StudentStudentActivity",
                newName: "StudentActivityId");

            migrationBuilder.RenameIndex(
                name: "IX_StudentStudentActivity_StudentsId",
                table: "StudentStudentActivity",
                newName: "IX_StudentStudentActivity_StudentId");

            migrationBuilder.AddColumn<string>(
                name: "Details",
                table: "StudentStudentActivity",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Score",
                table: "StudentStudentActivity",
                type: "float",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentStudentActivity_StudentActivities_StudentActivityId",
                table: "StudentStudentActivity",
                column: "StudentActivityId",
                principalTable: "StudentActivities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentStudentActivity_Students_StudentId",
                table: "StudentStudentActivity",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentStudentActivity_StudentActivities_StudentActivityId",
                table: "StudentStudentActivity");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentStudentActivity_Students_StudentId",
                table: "StudentStudentActivity");

            migrationBuilder.DropColumn(
                name: "Details",
                table: "StudentStudentActivity");

            migrationBuilder.DropColumn(
                name: "Score",
                table: "StudentStudentActivity");

            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "StudentStudentActivity",
                newName: "StudentsId");

            migrationBuilder.RenameColumn(
                name: "StudentActivityId",
                table: "StudentStudentActivity",
                newName: "StudentActivitiesId");

            migrationBuilder.RenameIndex(
                name: "IX_StudentStudentActivity_StudentId",
                table: "StudentStudentActivity",
                newName: "IX_StudentStudentActivity_StudentsId");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentStudentActivity_StudentActivities_StudentActivitiesId",
                table: "StudentStudentActivity",
                column: "StudentActivitiesId",
                principalTable: "StudentActivities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentStudentActivity_Students_StudentsId",
                table: "StudentStudentActivity",
                column: "StudentsId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
