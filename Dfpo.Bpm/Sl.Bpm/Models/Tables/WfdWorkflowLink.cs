using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("WfdWorkflowLink")]

    public class WfdWorkflowLink : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(50)]
        public string StartNodeId { get; set; }
        [StringLength(50)]
        public string EndNodeId { get; set; }
        public bool? UseCondition { get; set; }
        [StringLength(500)]
        public string ConditionValue { get; set; }
        [StringLength(500)]
        public string LangMemo { get; set; }
        [StringLength(50)]
        public string WfdWorkflowId { get; set; }

        [StringLength(20)]

        public string LineType { get; set; }
        public float? M { get; set; }

        [StringLength(50)]
        public string EnterpriseId { get; set; }
        public WfdWorkflowLink()
        {
            Id = System.Guid.NewGuid().ToString();
        }

        public WfdWorkflowLink CopyNew()
        {
            var link = (WfdWorkflowLink)MemberwiseClone();
            link.Id = System.Guid.NewGuid().ToString();
            return link;
        }

    }
}
