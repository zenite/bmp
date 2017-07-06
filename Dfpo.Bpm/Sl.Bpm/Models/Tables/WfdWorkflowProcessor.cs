using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("WfdWorkflowProcessor")]
    public class WfdWorkflowProcessor : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(100)]
        public string ProcessorLinkId { get; set; }
        /// <summary>
        ///0  Proposer: "申请人",
        ///1  BusinessMan: "业务相关人",
        ///2  Job: "岗位",
        ///3  Role: "角色",
        ///4  Department: "部门",
        ///5   JobLevel: "与某一步处理人相同",
        ///6   JobCodeFilterByPerson: "岗位代码按人过滤",
        ///7   JobLevelFilterByPerson: "岗位级别按人过滤",
        ///8   RoleFilterByDepartment: "角色按部门过滤",
        ///9   DepartmentLeader: "部门领导",
        ///10  SupervisorOfProposer: "直属主管",
        ///11  SupervisorOfPre: "前置步骤的直属主管",
        ///12  DepartmentOfPre: "前置步骤的部门领导",
        ///13  PersonOfSepecificOrganizationJobLevel: "某组织某岗位级别的人员"
        /// </summary>
        public int Type { get; set; }
        /// <summary>
        /// 0 选择数据源
        /// 1 数据字段
        /// 2 变量
        /// </summary>
        public int DataType { get; set; }
        /// <summary>
        /// 因 Type & DataType不同 含义不同
        /// <para>Type = 1 DataType = 0 这代表岗位Id</para> 
        /// <para>Type = 2 DataType = 0 代表角色Id</para> 
        /// <para>Type = 3 DataType = 0 代表组织Id</para> 
        /// <para>Type = 4 DataType = 0 代表节点Id</para> 
        /// <para>Type = 5 DataType = 0 代表岗位Code</para> 
        /// <para>Type = 6 DataType = 0 代表岗位级别Id 关联枚举表AppEnum  JobLevelType</para> 
        /// <para>Type = 7 DataType = 0 代表角色Id</para> 
        /// <para>Type = 13 DataType = 0 表示'组织Id.岗位级别Id'</para> 
        /// </summary>
        public string DataValue { get; set; }
        /// <summary>
        /// 基准处理人类型
        /// <para>0:申请人</para>
        /// <para>1:业务相关人（数据字段）</para>
        /// <para>2:业务相关人（变量）</para>
        /// </summary>
        public int BaseType { get; set; }
        /// <summary>
        /// 基准数据类型 为 数据字典 或者变量的值。
        /// </summary>
        public string BaseValue { get; set; }
        //是否启用生效条件
        public bool IsActiveConditionEnable { get; set; }
        [StringLength(1000)]
        public string ActiveCondition { get; set; }
        [StringLength(100)]
        public string EnterpriseId { get; set; }
    }
}
