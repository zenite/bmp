using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("InstMail")]
    public class InstMail : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }

        [StringLength(50)]
        public string FromUserId { get; set; }

        [StringLength(50)]
        public string ToUserId { get; set; }

        [StringLength(500)]
        public string ToMail { get; set; }

        [StringLength(1000)]
        public string MailCc { get; set; }

        public int? MailType { get; set; }

        [StringLength(50)]
        public string WfdWorkflowId { get; set; }

        [StringLength(100)]
        public string FromNodeName { get; set; }

        [StringLength(100)]
        public string ToNodeName { get; set; }

        public string Memo { get; set; }


        [StringLength(200)]
        public string Subject { get; set; }

        public string Body { get; set; }

        [StringLength(200)]
        public string Attachment { get; set; }

        [StringLength(50)]
        public string FormProcId { get; set; }

        [StringLength(50)]
        public string ProcId { get; set; }

        [StringLength(50)]
        public string TaskId { get; set; }

        public DateTime? CreationTime { get; set; }
        public DateTime? SendTime { get; set; }
        public int? SendStatus { get; set; }
        [StringLength(50)]
        public string EnterpriseId { get; set; }

        public InstMail()
        {
            Id = Guid.NewGuid().ToString();
        }
    }
}