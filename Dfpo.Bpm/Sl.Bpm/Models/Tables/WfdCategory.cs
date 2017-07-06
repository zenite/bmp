using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("WfdCategory")]
    public class WfdCategory : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(100)]
        public string Code { get; set; }
        [StringLength(100)]
        public string LangType { get; set; }
        [StringLength(100)]
        public string LangName { get; set; }
        public int DisplayOrder { get; set; }   

        public string FromUserId { get; set; }
        [StringLength(50)]
        public string EnterpriseId { get; set; }

        [StringLength(50)]
        public string CreatorUserId { get; set; }
        
        public WfdCategory()
        {
            DisplayOrder = 0;
        }

        public WfdCategory CopyNew()
        {
            var catg = (WfdCategory)MemberwiseClone();
            catg.RefreshId();
            return catg;
        }
    }
}
