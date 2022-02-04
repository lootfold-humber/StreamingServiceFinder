namespace StreamingPlatformFinder.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddConstraintsToModels : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Movies", "Title", c => c.String(nullable: false, maxLength: 100));
            AlterColumn("dbo.Movies", "Director", c => c.String(nullable: false, maxLength: 100));
            AlterColumn("dbo.Movies", "Genre", c => c.String(nullable: false, maxLength: 50));
            AlterColumn("dbo.Platforms", "Name", c => c.String(nullable: false, maxLength: 100));
            CreateIndex("dbo.Platforms", "Name", unique: true);
        }
        
        public override void Down()
        {
            DropIndex("dbo.Platforms", new[] { "Name" });
            AlterColumn("dbo.Platforms", "Name", c => c.String());
            AlterColumn("dbo.Movies", "Genre", c => c.String());
            AlterColumn("dbo.Movies", "Director", c => c.String());
            AlterColumn("dbo.Movies", "Title", c => c.String());
        }
    }
}
