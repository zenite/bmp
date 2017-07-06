using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("BpmJob")]
    public class BpmJob : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(50)]
        public string Code { get; set; }
        [StringLength(50)]
        public string LangName { get; set; }
        //2 为用户型岗位 32为组织型岗位
        [StringLength(50)]
        public string Type { get; set; }
        [StringLength(50)]
        public string EnumJobLevel { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsLeader { get; set; }
        [StringLength(50)]
        public string GroupId { get; set; }
        [StringLength(50)]
        public string ParentJobId { get; set; }
        [StringLength(50)]
        public string SubGroupId { get; set; }
        public int? DisplayOrder { get; set; }
        [StringLength(50)]
        public string EnterpriseId { get; set; }
        public void EmptyGroupJobFields()
        {
            this.SubGroupId = null;
            this.LangName = null;
            this.Code = null;
            this.EnumJobLevel = null;
        }
    }
}