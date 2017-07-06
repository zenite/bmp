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
        ///0  Proposer: "������",
        ///1  BusinessMan: "ҵ�������",
        ///2  Job: "��λ",
        ///3  Role: "��ɫ",
        ///4  Department: "����",
        ///5   JobLevel: "��ĳһ����������ͬ",
        ///6   JobCodeFilterByPerson: "��λ���밴�˹���",
        ///7   JobLevelFilterByPerson: "��λ�����˹���",
        ///8   RoleFilterByDepartment: "��ɫ�����Ź���",
        ///9   DepartmentLeader: "�����쵼",
        ///10  SupervisorOfProposer: "ֱ������",
        ///11  SupervisorOfPre: "ǰ�ò����ֱ������",
        ///12  DepartmentOfPre: "ǰ�ò���Ĳ����쵼",
        ///13  PersonOfSepecificOrganizationJobLevel: "ĳ��֯ĳ��λ�������Ա"
        /// </summary>
        public int Type { get; set; }
        /// <summary>
        /// 0 ѡ������Դ
        /// 1 �����ֶ�
        /// 2 ����
        /// </summary>
        public int DataType { get; set; }
        /// <summary>
        /// �� Type & DataType��ͬ ���岻ͬ
        /// <para>Type = 1 DataType = 0 ������λId</para> 
        /// <para>Type = 2 DataType = 0 �����ɫId</para> 
        /// <para>Type = 3 DataType = 0 ������֯Id</para> 
        /// <para>Type = 4 DataType = 0 ����ڵ�Id</para> 
        /// <para>Type = 5 DataType = 0 �����λCode</para> 
        /// <para>Type = 6 DataType = 0 �����λ����Id ����ö�ٱ�AppEnum  JobLevelType</para> 
        /// <para>Type = 7 DataType = 0 �����ɫId</para> 
        /// <para>Type = 13 DataType = 0 ��ʾ'��֯Id.��λ����Id'</para> 
        /// </summary>
        public string DataValue { get; set; }
        /// <summary>
        /// ��׼����������
        /// <para>0:������</para>
        /// <para>1:ҵ������ˣ������ֶΣ�</para>
        /// <para>2:ҵ������ˣ�������</para>
        /// </summary>
        public int BaseType { get; set; }
        /// <summary>
        /// ��׼�������� Ϊ �����ֵ� ���߱�����ֵ��
        /// </summary>
        public string BaseValue { get; set; }
        //�Ƿ�������Ч����
        public bool IsActiveConditionEnable { get; set; }
        [StringLength(1000)]
        public string ActiveCondition { get; set; }
        [StringLength(100)]
        public string EnterpriseId { get; set; }
    }
}
