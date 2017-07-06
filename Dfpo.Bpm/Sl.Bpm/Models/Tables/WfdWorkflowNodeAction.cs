using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("WfdWorkflowNodeAction")]
    public class WfdWorkflowNodeAction : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(100)]
        public string Type { get; set; }
        [StringLength(100)]
        public string LangName { get; set; }
        public bool? IsEnable { get; set; }
        [StringLength(2000)]
        public string ReturnToNodes { get; set; }
        [StringLength(100)]
        public string ActionLinkId { get; set; }
        public int? DisplayOrder { get; set; }
        [StringLength(100)]
        public string EnterpriseId { get; set; }
    }
}
