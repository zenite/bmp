using System;
using System.ComponentModel.DataAnnotations;
using MiniAbp.Domain;
using Yooya.Bpm.Models.Enum;
using MiniAbp.DataAccess.Dapper;

namespace Yooya.Bpm.Models.Table
{
    [Table("InstDataOperateLog")]
    public class InstDataOperateLog : Entity
    {
        [System.ComponentModel.DataAnnotations.Key]
        [StringLength(50)]
        public override string Id { get; set; } 
        [StringLength(50)]
        public DataOperateType  OperateType { get; set; }
        [StringLength(50)]
        public string UserId { get; set; }
        [StringLength(50)]
        public DateTime? Datetime { get; set; }
        [StringLength(50)]
        public string DataId { get; set; }
        [StringLength(500)]
        public string DataContent { get; set; }
        [StringLength(500)]
        public string DataMemo { get; set; }
    }
}