
function controller(base, form, program) {
    $scope.leavetypeHours = "天";

    var daysorHour = 0;
    var loadcount = 0;
    var loadcount2 = 0;
    form.$page_load = function () {
        form.hr01.groupId = base.applicant.groupId
        if (form.hr01.leaveType == "" || form.hr01.leaveType == null) {
            form.hr01.leaveType = '1';
        }
        if (form.hr01.area == "" || form.hr01.area == null) {
            result = program('GetArea', { userID: base.applicant.userId, groupId: base.applicant.groupId });
            form.hr01.area = result;
        }
    }

    form.$event_submit_before = function (context) {
        debugger; 

        if (form.hr01.detailType == "8" && form.hr01.overTimeHours < form.hr01.leaveHours) {
            mabp.notify.warn("所填调休时间已超过可请假时间,今年剩余调休小时数:" + form.hr01.overTimeHours + "h");
            return context.$stop();
        }

        if (form.hr01.detailType == "1" && form.hr01.overTimeHours < form.hr01.leaveHours) {
            mabp.notify.warn("所填休假时间已超过可休假时间,今年剩余休假天数:" + form.hr01.overTimeHours + "天");
            return context.$stop();
        }

        if (form.hr01.detailType == "11" && form.hr01.overTimeHours < form.hr01.leaveHours) {
            mabp.notify.warn("所填事假时间已超过可事假时间,今年剩余事假天数:" + form.hr01.overTimeHours + "天");
            return context.$stop();
        }

        form.hr01.status = 3;

        return context.$continue();
    }
    form.$event_agree_before = function (context) {
        debugger;
        var result = program('GetNodeName', { nodeId: base.nodeId });
        if (result == "直属经理") {

            form.hr01.status = 1;
        } 
        else if ((result == "HR-考勤@auto" || result == "HR-考勤") && form.hr01.area == "SHTC") {

            form.hr01.status = 2;
        }
        //else if (result == "HR" && form.hr01.area == "NJTC") {
        //    form.hr01.status = 2;
        //}
        else if (result == "HR-考勤" && form.hr01.area != "SHTC" && form.hr01.area != "NJTC") {
            form.hr01.status = 2;
        }
        else if (result == "HR Manager" && form.hr01.area == "NJTC") {
            form.hr01.status = 2;
        }
        else if (result == "HR" && form.hr01.area == "NJTC" && ((form.hr01.detailType == '8' && form.hr01.leaveHours <= 24) || (form.hr01.detailType != '8' && form.hr01.leaveHours <= 3))) {
            form.hr01.status = 2;
        }
        return context.$continue()
    }


 
    form.$event_delete_before = function (context) {
        debugger; 
        //program('UpdateTaskID', { TaskId: base.taskId });
        form.hr01.status = 0;
        return context.$continue();
    } 

 
    //请假类型选择
    form.$watch('form.hr01.leaveType', function () {
        if (form.hr01.leaveType == 2) {
            form.hr01.detailType = '11';
            
        }
        
    });

    //请假类型选择
    form.$watch('form.hr01.detailType', function () {
        if (form.hr01.detailType == '8') {
            $scope.leavetypeHours = "小时";
        }
        else {
            $scope.leavetypeHours = "天";
        }
        debugger;
        if (base.pageState == 3 || ((base.pageState == 2 && form.$pageRight.StartNode != 'normal'))) {
            return false;
        } 
        if ((base.pageState == 2 || (base.pageState == 1 && base.snNumber!=null)) && form.$pageRight.StartNode == 'normal' && loadcount2 < 2) {
            loadcount2 = 1 + loadcount2;
            return false;
        }
        if (form.hr01.detailType != "10") {
            form.hr01.otherLeaveType = '';
        }

        //休假
        if (form.hr01.detailType == "1") {
            var result = program('GetVaction', { userID: base.applicant.userId });
            form.hr01.overTimeHours = result[0].remainTime;
            if (base.language == "zh-CN") {
                debugger;
                mabp.message.info("Vacation休假<br/>今年可休假总天数为:" + result[0].allTime + "天<br/>今年已用休假天数为:" + result[0].useTime + "天<br/>今年剩余休假天数为:" + result[0].remainTime + "天<br/>备注：<br/>1.今年可休假总天数=今年实有休假天数-公司预留天数<总部2天，工厂0天><br/>申请流程：<br/>1. 申请年休假的最小单位为0.5天，不足0.5天的按0.5天计，大于0.5天不满1天的按1天计。<br/>2.请假时间在3个工作日及以内的，须提前1个工作日申请，请假时间超过3个工作日的，须提前1周申请。", "提示")

            }
            else {
                mabp.message.info("Vacation:<br/>Total available vacations(this year):" + result[0].allTime + "d<br/>Already used vacations(this year):" + result[0].useTime + "d<br/>Left vacations(this year):" + result[0].remainTime + "d<br/>Remarks:<br/>1. Total available vacations = total vacations - company reserved vacations(HQ-2d, Fudian-0d)<br/>Procedures:<br/>1. Vacations must be applied at the minimum unit of 0.5d. If less than 0.5d, it will be count as 0.5d. If less than 1d but more than 0.5d, it will be count as 1d.<br/>2. You must apply at least one day ahead if the vacations are within 3 working days. You must apply at least one week ahead if the vacations are longer than 3 working days.", "Prompt")
            }

        }//婚假
        else if (form.hr01.detailType == "2") {
            if (base.language == "zh-CN") {

                mabp.message.info("1.入公司后开具结婚证书的员工（以结婚证书上登记日期为准），符合法定结婚年龄的员工可享受10天婚假；遇国家法定节假日顺延。<br/>2. 婚假须在领取结婚证之日12个月内一次使用。<br/>申请流程：<br/>提前1个月申请，并提供结婚证书原件及提交复印件至部门考勤员处。", "提示")

            }
            else {
                mabp.message.info("1. If marriage certificate date is after the employee onboarding date and the employee is older than the minimun legal marriage age, the employee can enjoy 10d marriage leave. State-mandated annual leaves are not counted in the marriage leave.<br/>2. Marriage leave must be used within 12 months after the marriage certificate has been issued.<br/>Procedures:<br/>Employee must apply at least one month ahead and provide original copy and copy of the marriage certificate to related department attendance clerk.", "Prompt")
            }

        }//产假
        else if (form.hr01.detailType == "3") {
            if (base.language == "zh-CN") {

                mabp.message.info("1、 符合国家计划生育规定的女性员工单胎产假为98天。<br/>1) 难产的，增加15天。<br/>2) 多胞胎生育的，每多生育一个，增加15天。 <br/>3) 增加享受生育假30天，遇国家法定节假日顺延。<br/>2、 因流产引起的产假休假政策按国家相关规定执行。<br/>3、 须一次使用。<br/>申请流程：<br/>1. 女性员工获知怀孕后，应提前告知直接经理，以便经理做好工作安排。<br/>2. 提供《孕妇健康手册》至医务室医生处转批《病假说明单》，首次假期为产前15天。生产后凭医院开具的《生育医学证明》至医务室医生处转批产后83天、难产、多胞胎、生育假。<br/>3. 需提供《病假说明单》及相关证明至部门考勤员。", "提示")

            }
            else {
                mabp.message.info("1. Female employees who meet the family planning criteria can enjoy 98d maternity leave.<br/>1) Difficult labour can enjoy more 15d of maternity leave.<br/>2) Multiple birth can enjoy more 15d of maternity leave per child.<br/>3) Employee can enjoy more 30d of the legal maternity leave. State-mandated annual leaves are not counted in the 30d maternity leave.<br/>2. Miscarriage maternity leave is conducted according to the state related regulations.<br/>3. Must be used all in once.<br/>Procedures:<br/>1. If the employee knows that she is pregnant, she should inform her direct supervisor to make corresponding arrangements.<br/>2. Please provide 'Maternal Health Book' to the clinic to issue 'Sick Leave Declaration' . First leave can be taken 15d before the labour day. After giving birth, please provide the 'Birth Certificate' issued by the hospital to the clinic to approve the left 83d maternity leave, dystocia leave, multi-birth leave or birth leave.<br/> 3. Please provide the 'Sick Leave Declaration' and related certifications to department attendance clerk.", "Prompt")
            }
        }//丧假
        else if (form.hr01.detailType == "4") {
            if (base.language == "zh-CN") {

                mabp.message.info("员工遇父母、岳父母、公婆、配偶、子女去世给假3个工作日，遇祖父母、外祖父母去世给假1个工作日。丧假须一次使用。<br/>申请流程：<br/>1、需提供相关亲属死亡证明复印件、相关亲属的关系证明至部门考勤员处。", "提示")

            }
            else {
                mabp.message.info("If the employee's parents, his/her spouse parents, his/her spouse or his/her child passed away,Case of grandparents to grandparents to leave a working day. the employee can have 3d bereavement leave, The leave must be used all in once.<br/> Procedures:<br/> 1. Please provide the death certificate, relation certifications to department attendance clerk.", "Prompt")
            }
        }//探亲假
        else if (form.hr01.detailType == "5") {
            if (base.language == "zh-CN") {

                mabp.message.info("1、入公司连续工作满1年的合同制员工，若居住地与父母或配偶不在一起的，又不能通过搭乘火车、轮船、汽车等交通工具双休日内在家居住1晚和半个白天的，经提交相关证明，可按下述享受公司探亲假：<br/>1) 未婚员工探望父母：一年一次，每次3个工作日；<br/>2) 已婚员工探望配偶：一年两次，每次3个工作日。(探望配偶时双方只能有一方探亲)。<br/>3) 已婚员工探望父母：四年一次，每次3个工作日。<br/>2、 公司探亲假必须与法定假日合并使用。<br/>3、 公司探亲假不可跨年度使用。<br/>申请流程：<br/>提前1周申请，并提供户口证明、往返交通工具票务复印件、与探亲者的关系证明等相关材料证明至部门考勤员处。", "提示")

            }
            else {
                mabp.message.info("1. If the employee is a contract employee and has joined the company for over a year and does not live within the same city as his/her parents or spouse, can enjoy company family visit leave:<br/>1) Unmarried employee can visit his/her parents once a year, each time 3 working days.<br/>2) Married employee can visit his/her spouse twice a year, each time 3 working days. (Only one person can enjoy the family visit).<br/>3) Married employee can visit his/her parents once in 4 years, each time 3 working days.<br/>2. Company family visits must be taken with the state-mandated holidays.<br/> 3. Compnay family visits can not be taken across years.<br/>Procedures:<br/>Family visits must be applied one week ahead and must provide residence booklet, round-trip vouchers copy and relation certificates or other papers to department attendance clerk.", "Prompt")
            }
        }//病假
        else if (form.hr01.detailType == "6") {
            form.checkDate()
            if (base.language == "zh-CN") {

                mabp.message.info("申请流程：<br/>1. 申请病假的最小单位为0.5天。<br/>2.填写请假单后，需将医务室医生开具的《病假证明单》提交至考勤员处（若是外诊需提供医院病假单及病历卡，由医务室医生审核后批转《病假证明单》）。", "提示")

            }
            else {
                mabp.message.info("Procedures:<br/>1. Sick leave must be taken at the minimum unit of 0.5d.<br/>2. After applied the sick leave, please provide the 'Sick Leave Certificate' to the attendance clerk. If the employee has gone to other hospitals, please provide the sick leave delaration and medical record of the other hospitals to the clinic to issue 'Sick Leave Certificate' .", "Prompt")
            }
        }//PMT妇女陪护假
        else if (form.hr01.detailType == "7") {
            if (base.language == "zh-CN") {

                mabp.message.info("符合国家生育规定的男性员工，可在配偶生育前1周或后2周内享受共10天的配偶陪产假，遇国家法定节假日顺延。<br/>申请流程：<br/>1、需提供子女出生证明复印件至部门考勤员处。", "提示")

            }
            else {
                mabp.message.info("The male employee who meets the family planning criteria can enjoy 10d PMT leave one week before his spouse giving birth or 2 weeks after his spouse giving birth. The state-mandated annual leaves are not counted in the PMT leave.<br/>Procedures:<br/> 1. Please provide the child birth certificate copy to department attendance clerk.", "Prompt")
            }
        }//调休
        else if (form.hr01.detailType == "8") {
            var result = program('GetLeaveHours', { userID: base.applicant.userId });
            form.hr01.overTimeHours = result;
            if (base.language == "zh-CN") {

                mabp.message.info("今年剩余调休小时数:" + form.hr01.overTimeHours + "h", "提示")

            }
            else {
                mabp.message.info("Left off in lieu(this year): " + form.hr01.overTimeHours + "h", "Prompt")
            }
        }//产前假
        else if (form.hr01.detailType == "9") {
            if (base.language == "zh-CN") {

                mabp.message.info("若工作条件许可，经区县级及以上医院证明有习惯性流产史、严重的妊娠综合症、妊娠合并症等可能影响正常生育的，经本人提出，公司批准，可请最多2个半月的产前假。<br/> 申请流程：<br/>1、申请2个半月产前假的，提前1周申请，提供《孕妇健康手册》及医院相关证明至医务室医生处开具或转批证明，并填写纸本请假申请单。", "提示")

            }
            else {
                mabp.message.info("If the work permits, and the employee can provide related certifications that are issued by hospitals above  country/district level and the certificates can prove that she has syndromes that may affect normal labour like RSA, severe pregnancy syndrome, pregnancy complications etc, the employee can have at most two and a half months prenatal leave after applied by herself and the company approves.<br/> Procedure:<br/> 1. The employee must apply one week ahead if she needs to take two and  a half months prenatal leave and must provide the 'Maternal Health Book' and related hospital certificates to clinic to issue/approve certifications and fill in sick leave paper applications.", "Prompt")
            }
        }
        else  if (form.hr01.detailType == "11")
        {
            if (base.language == "zh-CN") {
                var result = program('GetCompassionate', { userID: base.applicant.userId });
                form.hr01.overTimeHours = result[0].remainTime;
                mabp.message.info("全年事假累计不超过15个工作日<br/> 今年已用事假天数为:" + result[0].useTime + "天<br/>申请流程：<br/>1、事假申请的最小单位为0.5天，不足0.5天的按0.5天计，大于5天不满1天的按1天计。<br/>2.请假时间在3个工作如以内的，需提前1个工作日申亲，超过3个工作日的，需提前一周申亲。", "提示")

            }
            else {
                mabp.message.info("The annual leave a total of not more than 15 working days.<br/> 今年已用事假天数为:" + result[0].useTime + "天<br/>Procedure:<br/>1.leave the minimum unit for 0.5 days, less than 0.5 days by 0.5 days, more than 5 days less than 1 day by 1 day.<br/>2. Leave time in 3 work, such as within one working day to be pro-pro, more than 3 working days, to be a week in advance pro-pro.", "Prompt")
            } 
        }
        comDate()
    });


   
    function comDate() {
        if (base.pageState == 3 || ((base.pageState == 2 && form.$pageRight.StartNode != 'normal'))) {
            return false;
        }
        //if ((base.pageState == 2 || (base.pageState == 1 && base.snNumber != null)) && form.$pageRight.StartNode == 'normal' && loadcount < 2) {
        //    loadcount = 1 + loadcount;
        //    return false;
        //}
        if (form.hr01.leaveDateFrom != null && form.hr01.leaveDateFrom != "" && form.hr01.leaveDateTo != null && form.hr01.leaveDateTo != "") {
            debugger;
            var oDate1 = new Date(form.hr01.leaveDateFrom);
            var oDate2 = new Date(form.hr01.leaveDateTo);
            if (oDate1.getTime() > oDate2.getTime()) {
                mabp.notify.warn("请假开始日期不可早于请假结束日期");
                form.hr01.leaveHours = 0;
                return false;
            }
            var days = oDate2.getTime() - oDate1.getTime();
            var time = parseInt(days / (1000 * 60 * 60 * 24)) + 1


            result = program('GetHolidayCount', { start: form.hr01.leaveDateFrom, end: form.hr01.leaveDateTo });

            //if (form.hr01.detailType == "2") {
            //    if (time - parseInt(result) > 10) {
            //        mabp.notify.warn("婚嫁只有10天！");
            //        form.hr01.leaveHours = 0;
            //        return false;
            //    }
            //}
            if (form.hr01.detailType == "8") {

                form.hr01.leaveHours = (time - parseInt(result))*8;
                daysorHour = (time - parseInt(result)) * 8;
            }
            else {
                form.hr01.leaveHours = (time - parseInt(result));
                daysorHour = (time - parseInt(result));
            }

        }
        return true;
    }
    //开始日期
    form.Start = function (data) {
        debugger;
         if (base.pageState == 3 || ((base.pageState == 2 && form.$pageRight.StartNode != 'normal'))) {
            return false;
         }
         if (form.hr01.leaveDateFrom != null && form.hr01.leaveDateFrom != "") {
             //婚假
             //if (form.hr01.detailType == "2") {
             //    debugger;
             //    var d = new Date(form.hr01.leaveDateFrom);
             //    var now = new Date();
             //    if (parseInt(d.getFullYear()) - parseInt(now.getFullYear()) < 0) {
             //        form.hr01.leaveDateFrom = null;
             //        mabp.notify.warn("婚嫁需要提前一个月申请");
             //        form.hr01.leaveHours = 0;
             //        return false;
             //    }
             //    if (parseInt(d.getMonth()) - parseInt(now.getMonth()) <= 0 && (parseInt(d.getFullYear()) - parseInt(now.getFullYear()) == 0)) {
             //        form.hr01.leaveDateFrom = null;
             //        mabp.notify.warn("婚嫁需要提前一个月申请");
             //        form.hr01.leaveHours = 0;
             //        return false;
             //    }
             //    if (parseInt(d.getDate()) - parseInt(now.getDate()) < 0 && (parseInt(d.getFullYear()) - parseInt(now.getFullYear()) == 0) && (parseInt(d.getMonth()) - parseInt(now.getMonth()) == 1)) {
             //        form.hr01.leaveDateFrom = null;
             //        mabp.notify.warn("婚嫁需要提前一个月申请");
             //        form.hr01.leaveHours = 0;
             //        return false;
             //    }
             //}
             if (!comDate()) {
                 form.hr01.leaveDateFrom = null;
             }
         }
    };

     
    //议结束日期
    form.End = function (data) {
        if (base.pageState == 3 || ((base.pageState == 2 && form.$pageRight.StartNode != 'normal'))) {
            return false;
        }
        if (form.hr01.leaveDateTo != null && form.hr01.leaveDateTo != "") {
            //婚假
            //if (form.hr01.detailType == "2") {
            //    debugger;
            //    var d = new Date(form.hr01.leaveDateTo);
            //    var now = new Date();
            //    if (parseInt(d.getFullYear()) - parseInt(now.getFullYear()) < 0) {
            //        form.hr01.leaveDateTo = null;
            //        mabp.notify.warn("婚嫁需要提前一个月申请");
            //        form.hr01.leaveHours = 0;
            //        return false;
            //    }
            //    if (parseInt(d.getMonth()) - parseInt(now.getMonth()) <= 0 && (parseInt(d.getFullYear()) - parseInt(now.getFullYear()) == 0)) {
            //        form.hr01.leaveDateTo = null;
            //        mabp.notify.warn("婚嫁需要提前一个月申请");
            //        form.hr01.leaveHours = 0;
            //        return false;
            //    }
            //    if (parseInt(d.getDate()) - parseInt(now.getDate()) < 0 && (parseInt(d.getFullYear()) - parseInt(now.getFullYear()) == 0) && (parseInt(d.getMonth()) - parseInt(now.getMonth()) == 1)) {
            //        form.hr01.leaveDateTo = null;
            //        mabp.notify.warn("婚嫁需要提前一个月申请");
            //        form.hr01.leaveHours = 0;
            //        return false;
            //    }
            //}
            debugger
            if (!comDate()) {
                form.hr01.leaveDateTo = null;
            }
        }

    };


    form.CheckMobile = function () {
        if (form.hr01.tel.length != 11 && form.hr01.tel != "" && form.hr01.tel != null) {
            form.hr01.tel = "";
            mabp.notify.warn("请输入正确的发起人手机号");
        }
    }

    form.CheckDay = function (data) {
        debugger; 
        form.checkDate()
    }


    form.checkDate = function () {
        if (form.hr01.leaveHours == null || form.hr01.leaveHours == "") {
            return false;
        }
        if (base.pageState == 3 || ((base.pageState == 2 && form.$pageRight.StartNode != 'normal'))) {
            return false;
        }
        if (form.hr01.detailType == "8") { 
            var re = /^[1-9]+[0-9]*]*$/;
            var result = re.test(form.hr01.leaveHours)
            if (!result) {
                form.hr01.leaveHours = null;
                return false;
            }
        }
        else {
            var re = /^\d*(\.(5|0))?$/;
            var result = re.test(parseFloat(form.hr01.leaveHours));
            if (!result) {
                form.hr01.leaveHours = null;
                return false;
            }
        }
        if (daysorHour < form.hr01.leaveHours) {
            mabp.notify.warn("请假时间超长！");
            form.hr01.leaveHours = null;
        }
    }

}