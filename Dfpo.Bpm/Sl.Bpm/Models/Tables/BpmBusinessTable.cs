using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("BpmBusinessTable")]
    public class BpmBusinessTable : CreationEntity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }

        [StringLength(100)]
        public string Type { get; set; }
        [StringLength(100)]
        public string SchemaName { get; set; }
        public int DisplayOrder { get; set; }
        [StringLength(50)]
        public string LangName { get; set; }
        [StringLength(2000)]
        public string LangDescription { get; set; }
        [StringLength(50)]
        public string ParentBusinessTableId { get; set; }

        [StringLength(50)]
        public string EnterpriseId { get; set; }
    }
}