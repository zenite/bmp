using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("BpmRole")]
    public class BpmRole : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(100)]
        public string Code { get; set; }
        [StringLength(100)]
        public string LangName { get; set; }
        public int? DisplayOrder { get; set; }
        [StringLength(100)]
        public string EnterpriseId { get; set; }
        public DateTime? CreationTime { get; set; }
    }
}
