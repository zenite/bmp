using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("AppLanguage")]
    public class AppLanguage : Entity
    {
        [System.ComponentModel.DataAnnotations.Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(512)]
        public string Key { get; set; }
        [StringLength(512)]
        public string Value { get; set; }
        [Required]
        [StringLength(50)]
        public string LanguageCulture { get; set; }
        [StringLength(50)]
        public string EnterpriseId { get; set; }
    }
}
