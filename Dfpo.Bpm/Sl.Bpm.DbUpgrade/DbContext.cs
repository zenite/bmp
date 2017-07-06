using System.Data.Entity;
using MiniAbp.Identity.Model.Table;
using Sl.Bpm.Model;
using Sl.Bpm.Model.Tables;


namespace Sl.Bpm.DbUpgrade
{
    public class DbContext : MDbContext
    {
        public DbContext() : base("Default")
        {
        }
    }
}
