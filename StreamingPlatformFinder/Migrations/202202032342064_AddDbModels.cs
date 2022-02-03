namespace StreamingPlatformFinder.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddDbModels : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Movies",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Title = c.String(),
                        Director = c.String(),
                        Genre = c.String(),
                        ReleaseYear = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Platforms",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.PlatformMovies",
                c => new
                    {
                        Platform_Id = c.Int(nullable: false),
                        Movie_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Platform_Id, t.Movie_Id })
                .ForeignKey("dbo.Platforms", t => t.Platform_Id, cascadeDelete: true)
                .ForeignKey("dbo.Movies", t => t.Movie_Id, cascadeDelete: true)
                .Index(t => t.Platform_Id)
                .Index(t => t.Movie_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PlatformMovies", "Movie_Id", "dbo.Movies");
            DropForeignKey("dbo.PlatformMovies", "Platform_Id", "dbo.Platforms");
            DropIndex("dbo.PlatformMovies", new[] { "Movie_Id" });
            DropIndex("dbo.PlatformMovies", new[] { "Platform_Id" });
            DropTable("dbo.PlatformMovies");
            DropTable("dbo.Platforms");
            DropTable("dbo.Movies");
        }
    }
}
