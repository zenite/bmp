using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("AppUser")]
    public class AppUser : CreationEntity
    {
        [System.ComponentModel.DataAnnotations.Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(50)]
        public string Account { get; set; }
        [StringLength(128)]
        public string Password { get; set; }
        [StringLength(100)]
        public string EmailAddress { get; set; }
        [StringLength(50)]
        public string LangName { get; set; }
        [StringLength(50)]
        public string Language { get; set; }
        [StringLength(50)]
        public string CellPhone { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsOut { get; set; }
        public bool? IsDeleted { get; set; }

        public override DateTime? CreationTime { get; set; }
        [StringLength(50)]

        public override string CreatorUserId { get; set; }
    }
}
