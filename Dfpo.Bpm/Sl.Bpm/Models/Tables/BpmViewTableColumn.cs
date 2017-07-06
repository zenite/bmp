using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("BpmViewTableColumn")]
    public class BpmViewTableColumn : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(50)]
        public string LangName { get; set; }
        [StringLength(50)]
        public string SchemaName { get; set; }
        [StringLength(50)]
        public string Type { get; set; }
        [StringLength(50)]
        public string Alignment { get; set; }
        public bool IsDisplayEnable { get; set; }
        public bool IsLinkEnable { get; set; }
        public string WhereInputType { get; set; }
        public string WhereInputContent { get; set; }
        public bool IsWhereEnable { get; set; }
        public bool IsOrderByEnable { get; set; }
        public bool IsGroupByEnable { get; set; }
        public bool IsAggregateEnable { get; set; }
        public int? DisplayOrder { get; set; }
        public bool IsDelete { get; set; }
        [StringLength(50)]
        public string ViewTableId { get; set; }
        [StringLength(50)]
        public string EnterpriseId { get; set; }
    }
}