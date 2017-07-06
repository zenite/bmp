using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("BpmViewTable")]
    public class BpmViewTable : CreationEntity 
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(50)]
        public string SchemaName { get; set; }
        public int? DisplayOrder { get; set; }
        [StringLength(50)]
        public string LangName { get; set; }
        [StringLength(50)]
        public string LangDescription { get; set; }
        public string DataSql { get; set; }
        [StringLength(50)]
        public string ParentViewTableId { get; set; }
        [StringLength(50)]
        public string EnterpriseId { get; set; }
    }
}