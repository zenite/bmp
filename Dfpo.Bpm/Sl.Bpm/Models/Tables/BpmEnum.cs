using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("BpmEnum")]
    public class BpmEnum : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(512)]
        public string Name { get; set; }
        [StringLength(512)]
        public string Value { get; set; }
        [StringLength(512)]
        public string Enum { get; set; }
        [StringLength(100)]
        public string EnterpriseId { get; set; }
    }
}
