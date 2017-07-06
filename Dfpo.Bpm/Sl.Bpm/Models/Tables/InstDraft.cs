using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("InstDraft")]
    public class InstDraft : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }

        //处理中保存的关联
        [StringLength(50)]
        public string ProcId { get; set; }

        //创建人
        [StringLength(50)]
        public string OwnerUserId { get; set; }

        //创建人身份
        [StringLength(50)]
        public string OwnerJobId { get; set; }

        //主题
        [StringLength(200)]
        public string Topic { get; set; }

        public DateTime? CreationTime { get; set; }
        public DateTime? LastModificationTime { get; set; }

        //提醒
        public int Priority { get; set; }

        [Column("FormData", TypeName = "text")]
        public string FormData { get; set; }
        //0 为保存草稿 1为保存模板
        public int? Type { get; set; }

        [StringLength(50)]
        public string WfdWorkflowId { get; set; }

        [StringLength(50)]
        public string WfdCategoryId { get; set; }
        [StringLength(50)]
        public string EnterpriseId { get; set; }

        public InstDraft()
        {
            Id = Guid.NewGuid().ToString();

        }

    }
}
