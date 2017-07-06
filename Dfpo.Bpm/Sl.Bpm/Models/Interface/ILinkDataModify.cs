using System;
using System.Collections.Generic;
using System.EnterpriseServices.Internal;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Yooya.Bpm.Models.Interface
{
    public interface ILinkDataModify
    {
        string Id { get; set; }
        bool? UseCondition { get; set; }
        string ConditionValue { get; set; }
    }
}
