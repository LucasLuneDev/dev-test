using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueDocumentToClient : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("a1b2c3d4-e5f6-7890-1234-567890abcdef"),
                column: "PasswordHash",
                value: "$2a$11$qr31.4Xs3B7pznYQ.JcfE.GkrJ9iVKIJ2LrHs6lDnn4BJqRZJyrMy");

            migrationBuilder.CreateIndex(
                name: "IX_Client_DocumentNumber",
                table: "Client",
                column: "DocumentNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Client_DocumentNumber",
                table: "Client");

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("a1b2c3d4-e5f6-7890-1234-567890abcdef"),
                column: "PasswordHash",
                value: "$2a$11$XOhRr4FD4L9RM9mJZwRg6.5qAZ7NoxuscyZUgD.Io4BXciDlbOdYO");
        }
    }
}
