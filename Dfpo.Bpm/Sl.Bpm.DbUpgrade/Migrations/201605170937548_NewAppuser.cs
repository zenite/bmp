namespace Sl.Bpm.DbUpgrade.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NewAppuser : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AppUser", "ErrorLoginTimes", c => c.Int(nullable: false));
            AddColumn("dbo.AppUser", "LastErrorLoginTime", c => c.DateTime());
            AddColumn("dbo.AppUser", "PhoneConfirmationCode", c => c.String(maxLength: 50));
            AddColumn("dbo.AppUser", "EmailConfirmationCode", c => c.String(maxLength: 50));
            AddColumn("dbo.AppUser", "IsPhoneConfirmed", c => c.Boolean(nullable: false));
            AddColumn("dbo.AppUser", "IsEmailConfirmed", c => c.Boolean(nullable: false));
            AddColumn("dbo.AppUser", "NickName", c => c.String(maxLength: 50));
            AddColumn("dbo.AppUser", "Birthday", c => c.DateTime());
            AddColumn("dbo.AppUser", "Location", c => c.String(maxLength: 100));
            AddColumn("dbo.AppUser", "LastModificationTime", c => c.DateTime());
            AddColumn("dbo.AppUser", "InitialPassword", c => c.String());
            AddColumn("dbo.AppUser", "IsAlreadyActivated", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AppUser", "IsAlreadyActivated");
            DropColumn("dbo.AppUser", "InitialPassword");
            DropColumn("dbo.AppUser", "LastModificationTime");
            DropColumn("dbo.AppUser", "Location");
            DropColumn("dbo.AppUser", "Birthday");
            DropColumn("dbo.AppUser", "NickName");
            DropColumn("dbo.AppUser", "IsEmailConfirmed");
            DropColumn("dbo.AppUser", "IsPhoneConfirmed");
            DropColumn("dbo.AppUser", "EmailConfirmationCode");
            DropColumn("dbo.AppUser", "PhoneConfirmationCode");
            DropColumn("dbo.AppUser", "LastErrorLoginTime");
            DropColumn("dbo.AppUser", "ErrorLoginTimes");
        }
    }
}
