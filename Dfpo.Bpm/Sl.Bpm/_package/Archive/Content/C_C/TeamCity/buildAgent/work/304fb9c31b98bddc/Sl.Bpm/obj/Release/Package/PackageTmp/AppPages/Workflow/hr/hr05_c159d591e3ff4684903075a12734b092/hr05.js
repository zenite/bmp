
function controller(base, form, program) {
    form.$page_load = function () {
        debugger;
        program("StartDate", { id: 1 },
          function (startDate) {
              debugger;
              if (parseInt(startDate.substring(4)) < 8) {
                  form.hr05.yearsFront = (parseInt(startDate.substring(0, 4)) - 1).toString() + "年末";
                 
                  form.hr05.yearsMid = (parseInt(startDate.substring(0, 4)) - 1).toString() + "年中";
                  form.hr05.yearsEnd = (parseInt(startDate.substring(0, 4)) - 2).toString() + "年末";
              }
              else
              {
                  form.hr05.yearsFront = startDate.substring(0, 4) + "年中";
                 
                  form.hr05.yearsMid = (parseInt(startDate.substring(0, 4)) - 1).toString() + "年末";
                  form.hr05.yearsEnd = (parseInt(startDate.substring(0, 4)) - 1).toString() + "年中";
              }
            
          });
       
    }
    //选择工号带出员工姓名，员工组织，员工岗位，员工邮箱
    form.chooseEmployeeNumber = function (item) {
        debugger;
        if (!!item && item[0] != null) {
            var row = item[0];
            form.hr05.staffName = row.uName;
            form.hr05.staffOrganization = row.companyName + ">" + row.groupName + ">" + row.jobName;
            form.hr05.groupId = item.groupid;
            form.hr05.staffPosition = row.jobid;
            form.hr05.staffMail = row.emailAddress
        }
    }
    form.sum = function (data)
    {
      
        if (form.hr05.onboardDate != "" && form.hr05.contractExpirationDate!="")
        {
            if (CompareDate(form.hr05.contractExpirationDate, form.hr05.onboardDate))
            {
                form.$alert("合同到期时间必须大于加入公司日期");
                form.hr05.contractExpirationDate = null;
                form.hr05.onboardDate = null;
                return;
            }
          var  value = (Math.floor(new Date(form.hr05.contractExpirationDate).getTime() / (24 * 3600 * 1000)) - Math.floor(new Date(form.hr05.onboardDate).getTime() / (24 * 3600 * 1000))) / 365;
          form.hr05.joinYears = parseFloat(value).pushZero(1);
        };
        debugger;
    }
    form.$event_agree_before = function (context) {
        if (form.$pageRight.Hr05Node2 == 'normal' && base.pageState == 2)
        {
            if (form.hr05.deptIsExtending != 'D17A7445-9082-4A80-80E4-F47B4D19049E')
            {
                form.hr05.deptContractTerm = null;
                form.hr05.deptTermRemark = null;
                form.hr05.deptExtendTerm = null;
                if (form.hr05.deptExtendTerm != "A3B79251-E863-4786-9356-70D9813120D8") {
                    form.hr05.deptOthersRemark = null;
                }
            }
        }
        if ((form.$pageRight.Hr05Node3 == 'normal' && base.pageState == 2)) {
            if (form.hr05.hrIsExtending != 'D17A7445-9082-4A80-80E4-F47B4D19049E')
            {
                form.hr05.hrExtendTerm = null;
                form.hr05.hrContractTerm = null;
                form.hr05.hrTermRemark = null;
                if (form.hr05.hrExtendTerm != "A3B79251-E863-4786-9356-70D9813120D8") {
                    form.hr05.hrOthersRemark = null;
                }
            }
        }
        return context.$continue();
    }
    form.$event_submit_before = function (context) {
        debugger;
        if (form.hr05.joinYears<=0)
        {
            form.$alert("司龄必须大于0年");
            return context.$stop();
        }
       
       
        
      
        return context.$continue();
    }
    form.clearexoatrateDueDate = function ()
    {
        if (form.hr05.isDispatch != 'D17A7445-9082-4A80-80E4-F47B4D19049E') {
            form.hr05.exoatrateDueDate = null;
        }
    }
    form.cleartrainingDueDate = function () {
        if (form.hr05.hasTraining != 'D17A7445-9082-4A80-80E4-F47B4D19049E') {
            form.hr05.trainingDueDate = null;
        }
    }
    form.cleardeptExtendTerm = function () {
        if (form.hr05.deptIsExtending != 'D17A7445-9082-4A80-80E4-F47B4D19049E') {
            form.hr05.deptContractTerm = null;
            form.hr05.deptTermRemark = null;
            form.hr05.deptExtendTerm = null;
            
        }
    }
    form.cleardeptOthersRemark = function () {
        if (form.hr05.deptExtendTerm != "A3B79251-E863-4786-9356-70D9813120D8") {
            form.hr05.deptOthersRemark = null;
        }
    }
    form.clearhrExtendTerm = function () {
        if (form.hr05.hrIsExtending != 'D17A7445-9082-4A80-80E4-F47B4D19049E') {
            form.hr05.hrExtendTerm = null;
            form.hr05.hrContractTerm = null;
            form.hr05.hrTermRemark = null;
            
        }
    }
    form.clearhrOthersRemark = function ()
    {
        if (form.hr05.hrExtendTerm != "A3B79251-E863-4786-9356-70D9813120D8") {
            form.hr05.hrOthersRemark = null;
        }
    }
    form.clearhrContractTerm = function ()
    {
        if (form.hr05.hrContractTerm != 'fa029542-bf0a-47a0-a7c0-83a8ee339754')
        {
            form.hr05.hrContractTerms = null;
        }
    }
    form.cleardeptContractTerms = function ()
    {
        if (form.hr05.deptContractTerm != 'fa029542-bf0a-47a0-a7c0-83a8ee339754')
        {
            form.hr05.deptContractTerms = null;
        }
    }
    function CompareDate(t1, t2) {
        var strs1 = new Array(); //定义一数组
        strs1 = t1.split("-"); //字符分割
        var strs2 = new Array(); //定义一数组
        strs2 = t2.split("-"); //字符分割
        if (strs1[0] > strs2[0]) { return false; }
        else if (strs1[0] < strs2[0]) { return true; }
        else { }
        if (strs1[1] > strs2[1]) { return false; }
        else if (strs1[1] < strs2[1]) { return true; }
        else { }
        if (strs1[2] > strs2[2]) { return false; }
        else if (strs1[2] < strs2[2]) { return true; }
        else { }
        return true;
    }
}