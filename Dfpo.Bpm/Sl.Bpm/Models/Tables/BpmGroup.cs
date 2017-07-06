using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("BpmGroup")]
    public class BpmGroup : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(200)]
        public string LangName { get; set; }
        [StringLength(100)]
        public string ParentGroupId { get; set; }
        [StringLength(100)]
        public string EnumGroupType { get; set; }
        [StringLength(100)]
        public string Area { get; set; }
        [StringLength(1000)]
        public string Memo { get; set; }
        public int? DisplayOrder { get; set; }
        [StringLength(20)]
        public string Code { get; set; }
        [StringLength(20)]
        public string EnumGroupLevel { get; set; }
        [StringLength(100)]
        public string EnterpriseId { get; set; }
        public bool? IsRoot { get; set; }
    }
}
