using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("WfdWorkflowNodeCopyConfig")]
    public class WfdWorkflowNodeCopyConfig : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(100)]
        public string ActionType { get; set; }
        [StringLength(100)]
        public string CopyLinkId { get; set; }
        [StringLength(100)]
        public string ProcessorLinkId { get; set; }
        [StringLength(100)]
        public string EnterpriseId { get; set; }
    }
}
