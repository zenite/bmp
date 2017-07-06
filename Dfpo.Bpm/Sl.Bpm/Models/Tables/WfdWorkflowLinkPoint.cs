using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("WfdWorkflowLinkPoint")]
    public class WfdWorkflowLinkPoint : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(100)]
        public string WfdWorkflowLinkId { get; set; }
        public int? DisplayOrder { get; set; }
        public float? X { get; set; }
        public float? Y { get; set; }
        [StringLength(100)]
        public string WfdWorkflowId { get; set; }
        [StringLength(50)]
        public string EnterpriseId { get; set; }
    }
}
