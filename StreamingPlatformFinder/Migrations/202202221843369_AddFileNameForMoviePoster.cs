namespace StreamingPlatformFinder.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddFileNameForMoviePoster : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Movies", "FileName", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Movies", "FileName");
        }
    }
}
