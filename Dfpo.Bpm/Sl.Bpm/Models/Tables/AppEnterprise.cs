using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;
using System;

namespace Yooya.Bpm.Models.Tables
{
    [Table("AppEnterprise")]
    public class AppEnterprise : CreationEntity
    {
        [StringLength(100)]
        public string LangName { get; set; }
        [StringLength(100)]
        public string Code { get; set; }
        [StringLength(100)]
        public string Address { get; set; }
        [StringLength(100)]
        public string Contact { get; set; }
        [StringLength(100)]
        public string CellPhone { get; set; }
        [StringLength(100)]
        public string Email { get; set; }
        [StringLength(500)]
        public string Memo { get; set; }
        public bool? IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public int? DisplayOrder { get; set; }

        public override DateTime? CreationTime { get; set; }
        [StringLength(50)]

        public override string CreatorUserId { get; set; }
    }
}
