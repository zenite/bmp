
function controller(base, form, program) {
    form.$page_load = function () {
        debugger;
        if (form.$pageRight.RetryNode == "normal") {
            $scope.operate = "normal" 
        }
        else{
            $scope.operate = "disabled"
        }
        if (base.pageState == 1 && form.hr04d.length==0) {
              form.add()
        }
        if ((form.$pageRight.StartNode == 'normal' && base.pageState == 2) || base.pageState == 1) {
            var date = new Date;
            var year = date.getFullYear();
            var month = date.getMonth() + 1
            var result = program('GetRemainingOvertime', { userID: base.applicant.userId, Year: year, Month: month })
            form.hr04.remainingOvertime = result;
            form.hr04.status = 1;
        }
        if(form.hr04.area == "" || form.hr04.area == null){
            result = program('GetArea', { userID: base.applicant.userId, groupId: base.applicant.groupId });
            form.hr04.area = result;
            form.hr04.groupId = base.applicant.groupId
            if (result == "SHTC") {
                result = program('GetGroupID', { groupId: base.applicant.groupId });
                if (result == "DEPT0045JWTE" || base.applicant.groupId == "DEPT0045JWTE") {
                    form.hr04.groupId = "DEPT0045JWTE";
                }

            }
        }

        if (form.hr04.actAll == "" || form.hr04.actAll == null) {
            form.hr04.actAll = 0;
            form.hr04.actRemain = form.hr04.remainingOvertime;
        }
    }

   
    form.$event_submit_before = function (context) {
        debugger;

        if (form.hr04d.length == 0) {
            mabp.notify.warn("请填写明细数据");
            return context.$stop();
        }

        form.hr04.status = 3;
        form.hr04.isSendMail = "";
        return context.$continue();
    }
    form.$event_agree_before = function (context) {
        debugger;
        var result = program('GetNodeName', { nodeId: base.nodeId });
        if (result == "直接经理") {

            form.hr04.status = 1;
        }
        if (result == "HR") {

            form.hr04.status = 2;
        }
        form.hr04.isSendMail = "";
        return context.$continue()
    }


    form.$event_reject_before = function (context) {
        debugger;

        form.hr04.status = 0;

        return context.$continue();
    }


    form.$event_delete_before = function (context) {
        debugger;
        form.hr04.status = 0;
        //program('UpdateTaskID', { TaskId: base.taskId });
        return context.$continue();
    }

    form.EstStart = function (data) {
          data.estOtHours = "";
          getEstHours(data,"date") 
    }

    function getEstHours(data,type) {
        if (data.estStartOtDate != "" && data.estStartOtDate != null) { 
            var now = new Date();
            //var date = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
            //if (data.estStartOtDate < date) {
            //    data.estStartOtDate = "";
            //    mabp.notify.warn("预估开始加班日期不能小于当前日期");
            //    return false;
            //}
            var date2 = new Date(data.estStartOtDate)
            debugger;
            if (now.getFullYear() != date2.getFullYear() || now.getMonth() != date2.getMonth()) {
                data.estStartOtDate = "";
                mabp.notify.warn("预估开始加班日期只能为当前月");
                return false;
            }
        }
        if (data.estStartOtDate == "" || data.estStartOtDate == null) { 
            return false;
        }
        var returnvalue=true;
        var result = program('GetIsWorkDay', { date: data.estStartOtDate });
        if (data.estStartTime != "" || data.estStartTime != null) {

            
            if (result == true) {
                if (data.estStartTime < 35 && data.estStartTime > 18) {
                    data.estStartTime = "";
                    mabp.notify.warn("工昨日预估开始加班时间只能早于早上8:30以及17:00之后");
                    returnvalue=false;
                }
            }
        }

        if (data.estEndOtTime != "" || data.estEndOtTime != null) { 
            if (result == true) {
                if (data.estEndOtTime < 35 && data.estEndOtTime > 18) {
                    data.estEndOtTime = "";
                    mabp.notify.warn("工昨日预估结束加班时间只能早于早上8:30以及17:00之后");
                    returnvalue = false;
                }
            }
        }
        if (!returnvalue) {
            return true;
        }
        if (data.estStartTime != "" && data.estStartTime != null && data.estEndOtTime != "" && data.estEndOtTime != null) {
            if (parseFloat(data.estEndOtTime) <= parseFloat(data.estStartTime)) {
                mabp.notify.warn("预估开始加班时间不得大于预估结束加班时间");
                if (type == "start") {
                    data.estStartTime = "";
                }
                else if (type == "end") {
                    data.estEndOtTime = "";
                }
                else {
                    data.estStartTime = "";
                    data.estEndOtTime = "";
                }
                return false;
            }
            if (result == true) { 
                if (data.estEndOtTime >= 35 && data.estStartTime <= 18) {
                    if (type == "start") {
                        data.estStartTime = "";
                    }
                    else if (type == "end") {
                        data.estEndOtTime = "";
                    }
                    mabp.notify.warn("工昨日加班时间段不能包括工作时间");
                    return false;
                }

            }
            if (parseFloat(data.estEndOtTime) - parseFloat(data.estStartTime) < 2) {
                mabp.notify.warn("加班时间必须大于等于1小时");
                if (type == "start") {
                    data.estStartTime = "";
                }
                else if (type == "end") {
                    data.estEndOtTime = "";
                }
                return false;
            }

            var checkselect = program('CheckSelect', { userID: base.applicant.userId, startDate: data.estStartOtDate, startTime: data.estStartTime, endTime: data.estEndOtTime });
            if (checkselect == "false") {
                mabp.notify.warn("所选加班日期时间段已存在");
                if (type == "start") {
                    data.estStartTime = "";
                }
                else if (type == "end") {
                    data.estEndOtTime = "";
                }
                else {
                    data.estStartOtDate = "";
                }
            }

            var checkSameNum = 0;
            for (var i = 0; i < form.hr04d.length; i++) {
               
                if (form.hr04d[i].estStartTime == "" || form.hr04d[i].estStartTime == null || form.hr04d[i].estEndOtTime == "" || form.hr04d[i].estEndOtTime == null || form.hr04d[i].estStartOtDate == "" || form.hr04d[i].estStartOtDate==null)
                {        
                    continue;
                } 
                
                if (form.hr04d[i].estStartTime == data.estStartTime && form.hr04d[i].estEndOtTime == data.estEndOtTime && form.hr04d[i].estStartOtDate == data.estStartOtDate) {
                    checkSameNum++;
                    if (checkSameNum == 2) {
                        mabp.notify.warn("所选加班日期时间段已填写");
                        if (type == "start") {
                            data.estStartTime = "";
                        }
                        else if (type == "end") {
                            data.estEndOtTime = "";
                        }
                        else {
                            data.estStartOtDate = "";
                        }
                        break;
                    }
                }
                else if (form.hr04d[i].estStartOtDate == data.estStartOtDate &&
                    ((parseInt(data.estStartTime) >= parseInt(form.hr04d[i].estStartTime) && parseInt(data.estEndOtTime) <= parseInt(form.hr04d[i].estEndOtTime))
                    || (parseInt(data.estStartTime) <= parseInt(form.hr04d[i].estStartTime) && parseInt(data.estEndOtTime) >= parseInt(form.hr04d[i].estEndOtTime))
                    || (parseInt(data.estStartTime) >= parseInt(form.hr04d[i].estStartTime) && parseInt(data.estStartTime) < parseInt(form.hr04d[i].estEndOtTime))
                    || (parseInt(data.estEndOtTime) > parseInt(form.hr04d[i].estStartTime) && parseInt(data.estEndOtTime) <= parseInt(form.hr04d[i].estEndOtTime)))) {
                    mabp.notify.warn("所选加班日期时间段已填写");
                    if (type == "start") {
                        data.estStartTime = "";
                    }
                    else if (type == "end") {
                        data.estEndOtTime = "";
                    }
                    else {
                        data.estStartOtDate = "";
                    }
                    break;
                }
            }



            data.estOtHours = (parseFloat(data.estEndOtTime) - parseFloat(data.estStartTime)) / 2
            getEstLeftHours();
        } 
    }





    form.SelectEstStartTime = function (data, row) {
        debugger
        row.estOtHours = "";
        getEstHours(row,"start")

        //17 35 
    }
    form.SelectEstEndTime = function (data, row) {
        debugger
        row.estOtHours = "";
        getEstHours(row, "end")

        //17 35 
    }
    //grid删除
    form.delete = function () {
        debugger;
        var evens = _.remove(form.hr04d, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        else {
            getEstLeftHours();
        }
        
    }

    function getEstLeftHours() {
        var nowleft = form.hr04.remainingOvertime;
        var EctAll = 0
        var EctRemain = 0;
        for (i = 0; i < form.hr04d.length; i++) {
            if (!isNaN(form.hr04d[i].estOtHours)) {
                nowleft = nowleft - form.hr04d[i].estOtHours;
                EctAll = EctAll + parseFloat(form.hr04d[i].estOtHours)
                EctRemain = nowleft;  
                if (nowleft == "0") {
                    nowleft = "0.0";
                }
                form.hr04d[i].estLeftOtTime = nowleft; 
            } 
        }
        form.hr04.ectAll = EctAll;
        form.hr04.ectRemain = EctRemain;
    }



    form.add = function () { 
        form.hr04d.push({
            $edit: true,
            estStartOtDate: null,
            estStartTime: null,
            estEndOtTime: null,
            estOtHours: null,
            estLeftOtTime: null,
            actStartOtDate: null,
            actStartTime: null,
            actEndTime: null,
            actualOtHours: null,
            actualLeftOtTime: null,
            courseApplyType: null,
            mainReason: null,
            epNo: null,
            isContainMeal: null,
            isOffInLieu: null,
            isActOver: 'D17A7445-9082-4A80-80E4-F47B4D19049E'
        });
    }

     
    form.CheckMobile = function () { 
        if (form.hr04.applyMobile.length != 11 && form.hr04.applyMobile != "" && form.hr04.applyMobile != null) {
            form.hr04.applyMobile = "";
            mabp.notify.warn("请输入正确的发起人手机号");
        }
    }




    form.ActStart = function (data) {
        data.actualOtHours = "";
        getActHours(data, "date")
    }
   
     

    function getActHours(data, type) {
        if (data.actStartOtDate != "" && data.actStartOtDate != null) {  
            var date1 = new Date(base.applyDate.replace('T',' '));
            var date = date1.getFullYear() + "-" + ((date1.getMonth() + 1) < 10 ? "0" : "") + (date1.getMonth() + 1) + "-" + (date1.getDate() < 10 ? "0" : "") + date1.getDate();
            //if (data.actStartOtDate < date) {
            //    data.actStartOtDate = "";
            //    mabp.notify.warn("实际开始加班日期不能小于填表日期");
            //    return false;
            //}
            var date2 = new Date(data.actStartOtDate)
            if (date1.getFullYear() != date2.getFullYear() || date1.getMonth() != date2.getMonth()) {
                data.actStartOtDate = "";
                mabp.notify.warn("实际开始加班日期只能为当前月");
                return false;
            }
        }
        if (data.actStartOtDate == "" || data.actStartOtDate == null) {
            return false;
        }
        var returnvalue = true;
        var result = program('GetIsWorkDay', { date: data.actStartOtDate });
        if (data.actStartTime != "" || data.actStartTime != null) {


            if (result == true) {
                if (data.actStartTime < 35 && data.actStartTime > 18) {
                    data.actStartTime = "";
                    mabp.notify.warn("工昨日实际开始加班时间只能早于早上8:30以及17:00之后");
                    returnvalue = false;
                }
            }
        }

        if (data.actEndTime != "" || data.actEndTime != null) {
            if (result == true) {
                if (data.actEndTime < 35 && data.actEndTime > 18) {
                    data.actEndTime = "";
                    mabp.notify.warn("工昨日实际结束加班时间只能早于早上8:30以及17:00之后");
                    returnvalue = false;
                }
            }
        }
        if (!returnvalue) {
            return true;
        }
        if (data.actStartTime != "" && data.actStartTime != null && data.actEndTime != "" && data.actEndTime != null) {
            if (parseFloat(data.actEndTime) <= parseFloat(data.actStartTime)) {
                mabp.notify.warn("实际开始加班时间不得大于实际结束加班时间");
                if (type == "start") {
                    data.actStartTime = "";
                }
                else if (type == "end") {
                    data.actEndTime = "";
                }
                else if (type == "clear") {
                    data.actStartTime = "";
                    data.actStartOtDate = "";
                    data.actEndTime = "";
                }
                else {
                    data.actStartTime = "";
                    data.actEndTime = "";
                }
                return false;
            }
            if (result == true) {
                if (data.actEndTime >= 35 && data.actStartTime <= 18) {
                    if (type == "start") {
                        data.actStartTime = "";
                    }
                    else if (type == "end") {
                        data.actEndTime = "";
                    }
                    else if (type == "clear") {
                        data.actStartTime = "";
                        data.actStartOtDate = "";
                        data.actEndTime = "";
                    }
                    mabp.notify.warn("工昨日加班时间段不能包括工作时间");
                    return false;
                }

            }
            if (parseFloat(data.actEndTime) - parseFloat(data.actStartTime) < 2) {
                mabp.notify.warn("加班时间必须大于等于1小时");
                if (type == "start") {
                    data.actStartTime = "";
                }
                else if (type == "end") {
                    data.actEndTime = "";
                }
                else if (type == "clear") {
                    data.actStartTime = "";
                    data.actStartOtDate = "";
                    data.actEndTime = "";
                }
                return false;
            }

            var checkselect = program('CheckActSelect', { userID: base.applicant.userId, startDate: data.actStartOtDate, startTime: data.actStartTime, endTime: data.actEndTime, TaskId: base.taskId });
            if (checkselect == "false") {
                mabp.notify.warn("所选加班日期时间段已存在");
                if (type == "start") {
                    data.actStartTime = "";
                }
                else if (type == "end") {
                    data.actEndTime = "";
                }
                else if (type == "clear") {
                    data.actStartTime = "";
                    data.actStartOtDate = "";
                    data.actEndTime = "";
                }
                else {
                    data.actStartOtDate = "";
                }
            }



            var checkSameNum = 0;
            for (var i = 0; i < form.hr04d.length; i++) {

                if (form.hr04d[i].actStartTime == "" || form.hr04d[i].actStartTime == null || form.hr04d[i].actEndTime == "" || form.hr04d[i].actEndTime == null || form.hr04d[i].actStartOtDate == "" || form.hr04d[i].actStartOtDate == null) {
                    continue;
                }

                if (form.hr04d[i].actStartTime == data.actStartTime && form.hr04d[i].actEndTime == data.actEndTime && form.hr04d[i].actStartOtDate == data.actStartOtDate) {
                    checkSameNum++;
                    if (checkSameNum == 2) {
                        mabp.notify.warn("所选加班日期时间段已填写");
                        if (type == "start") {
                            data.actStartTime = "";
                        }
                        else if (type == "end") {
                            data.actEndTime = "";
                        }
                        else if (type == "clear") {
                            data.actStartTime = "";
                            data.actStartOtDate = "";
                            data.actEndTime = "";
                        }
                        else {
                            data.actStartOtDate = "";
                        }
                        break;
                    }
                }
                else if (form.hr04d[i].actStartOtDate == data.actStartOtDate &&
                    ((parseInt(data.actStartTime) >= parseInt(form.hr04d[i].estStartTime) && parseInt(data.actEndTime) <= parseInt(form.hr04d[i].actEndTime))
                    || (parseInt(data.actStartTime) <= parseInt(form.hr04d[i].actStartTime) && parseInt(data.actEndTime) >= parseInt(form.hr04d[i].actEndTime))
                    || (parseInt(data.actStartTime) >= parseInt(form.hr04d[i].actStartTime) && parseInt(data.actStartTime) < parseInt(form.hr04d[i].actEndTime))
                    || (parseInt(data.actEndTime) > parseInt(form.hr04d[i].actStartTime) && parseInt(data.actEndTime) <= parseInt(form.hr04d[i].actEndTime)))) {
                    mabp.notify.warn("所选加班日期时间段已填写");
                    if (type == "start") {
                        data.actStartTime = "";
                    }
                    else if (type == "end") {
                        data.actEndTime = "";
                    }
                    else if (type == "clear") {
                        data.actStartTime = "";
                        data.actStartOtDate = "";
                        data.actEndTime = "";
                    }
                    else {
                        data.actStartOtDate = "";
                    }
                    break;
                }
            }




            data.actualOtHours = (parseFloat(data.actEndTime) - parseFloat(data.actStartTime)) / 2
            if (data.isContainMeal == "D17A7445-9082-4A80-80E4-F47B4D19049E") {
                data.actualOtHours = data.actualOtHours-0.5
            }
            getActLeftHours();
        }
    }


    function getActLeftHours() {
        var nowleft = form.hr04.remainingOvertime;
        var ActAll = 0
        var ActRemain = 0;
        for (i = 0; i < form.hr04d.length; i++) {
            if (form.hr04d[i].actualOtHours == "" || form.hr04d[i].actualOtHours == null) {
                form.hr04d[i].actualOtHours = 0;
            }
            if (!isNaN(form.hr04d[i].actualOtHours)) {
                nowleft = nowleft - form.hr04d[i].actualOtHours;
                ActAll = ActAll + parseFloat(form.hr04d[i].actualOtHours)
                ActRemain = nowleft;
                 if (nowleft == "0") {
                    nowleft = "0.0";
                }
                form.hr04d[i].actualLeftOtTime = nowleft; 
            }
        }
        form.hr04.actAll = ActAll;
        form.hr04.actRemain = ActRemain;
    }
    form.chooseAct = function (data, row) {
        if (data.id == "51B9F2E4-FBE9-400A-A789-A296E30177BF") {
            row.actStartOtDate= "";
            row.actStartTime="";
            row.actEndTime ="";
        }
        row.actualOtHours = "";
        getActHours(row, "clear")
        getActLeftHours()
    }

    form.SelectActStartTime = function (data, row) {
        debugger
        row.actualOtHours = "";
        getActHours(row, "start")

        //17 35 
    }
    form.SelectActEndTime = function (data, row) {
        debugger
        row.actualOtHours = "";
        getActHours(row, "end")

        //17 35 
    }
}