
function controller(base, form, program) {
    base.isApproveAll = true;
    base.submit = function (btn) {
        if (form.$pageRight.StartNode == 'normal') {
            var isValidate = that.validate($scope);
            if (!isValidate) return;
            if (form.hr02d.length == 0 && form.hr02.courseApplyType == '2') {
                mabp.notify.warn("请填写明细数据");
                return false;
            }
            var result = program('GetRate', { currency: form.hr02.currency })
            form.hr02.sumFeeCny = parseFloat(form.hr02.expectedExpenses) * parseFloat(result)
              
            var result = program('GetParticipantSupervisor', { userID: base.applicant.userId }) 
            var Data = eval('(' + result + ')')
            form.hr02.directManger = Data.Table1[0].UserId

            if (form.hr02.area == 'YFVSJ') {
                mabp.message.confirm('我已读过并了解关于公司培训管理程序的大致说明。', '员工义务', function (confirmed) {
                    if (!confirmed)
                        return;
                    that.submit(btn, $scope, function () {
                        base.close(true);
                    });
                });
            }
            else {
                mabp.message.confirm('我已读过并了解关于公司培训管理程序的大致说明，并将主动在课后一周内完成“员工外读反馈表”', '员工义务', function (confirmed) {
                    if (!confirmed)
                        return;
                    that.submit(btn, $scope, function () {
                        base.close(true);
                    });
                });
            }
        }
        else {
            that.submit(btn, $scope, function () {
                base.close(true);
            });
        }
       
    }

    form.$customeButtons = [{
        type: "event_Print", id: "3", name: "打印", func: function () {
            window.print();
        }
    }];


    form.$page_load = function () {
        debugger;
        form.hr02.area = base.areaCode;
        form.hr02.autograph = base.applicant.userName;
        form.hr02.applicationGroupId = base.applicant.groupId;

        //if (form.hr02.area == "" || form.hr02.area == null) {
            //result = program('GetArea', { userID: base.applicant.userId, groupId: base.applicant.groupId });
            //form.hr02.area = result;
            //if (result == "YFVIC") {
            //    result = program('GetGroup', { GroupId: base.applicant.groupId });
            //    form.hr02.applicationGroupId = result;
            //}
        //}
        if (form.hr02.courseApplyType == null || form.hr02.courseApplyType == '') {
            form.hr02.courseApplyType = '1';
        }
        //if (form.hr02.tuition == "" || form.hr02.tuition == null) {
        //    form.hr02.tuition =0;
        //}
        //if (form.hr02.materialFees == "" || form.hr02.materialFees == null) {
        //    form.hr02.materialFees = 0;
        //}
        //if (form.hr02.otherFees == "" || form.hr02.otherFees == null) {
        //    form.hr02.otherFees = 0;
        //}
        //if (form.hr02.expectedExpenses == "" || form.hr02.expectedExpenses == null) {
        //    form.hr02.expectedExpenses = 0;
        //}
        //if (form.hr02.courseApplyType == "" || form.hr02.courseApplyType == null) {
        //    form.hr02.courseApplyType ='1';
        //}
        if (form.hr02.currency == "" || form.hr02.currency == null) {
            form.hr02.currency = 'CNY';
        }

    }

    form.$event_submit_before = function (context) {
        debugger;
       
        //if (form.hr02d.length == 0 && form.hr02.courseApplyType == '2') {
        //    mabp.notify.warn("请填写明细数据");
        //    return false;
        //}
        //var result = program('GetRate', { currency: form.hr02.currency })
        //form.hr02.sumFeeCny = parseFloat(form.hr02.expectedExpenses) * parseFloat(result)



        //var result = program('GetParticipantSupervisor', { userID: base.applicant.userId })
        //var Data = eval('(' + result + ')')
        //form.hr02.directManger = Data.Table1[0].UserId

        
        
      
       

        //var result = program('GetParticipantSupervisor', { userID: form.hr02.directManger })
        //var Data = eval('(' + result + ')')
        //form.hr02.inDirectManger = Data.Table1[0].UserId 
        return context.$continue()
    }






    form.CheckDay = function (data) { 
        if (form.hr02.courseDuration == null || form.hr02.courseDuration == "") {
            return false;
        }
        if (base.pageState == 3 || ((base.pageState == 2 && form.$pageRight.StartNode != 'normal'))) {
            return false;
        }
        var re = /^\d*(\.(5|0))?$/;
        var result = re.test(parseFloat(form.hr02.courseDuration));
        if (!result) {
            form.hr02.courseDuration = null;
        }
    }




    function comDate() {
        if (form.hr02.startDate != null && form.hr02.endDate != null && form.hr02.startDate != '' && form.hr02.endDate != '') {
            debugger; 
            var oDate1 = new Date(form.hr02.startDate);
            var oDate2 = new Date(form.hr02.endDate); 
            if (oDate1.getTime() >oDate2.getTime()) {
                mabp.notify.warn("结束日期必须大于等于起始日期");
                return false;
            }
            return true;
        }
        return true;
    }

    form.$watch('form.hr02.startDate', function () {
        debugger;
        if (!comDate()) {
            form.hr02.startDate = null;
        }
    });


    form.$watch('form.hr02.endDate', function () {
        if (!comDate()) {
            form.hr02.endDate = null;
        }

    });


    form.sum = function (data) {
        if (base.pageState == 3 || ((base.pageState == 2 && form.$pageRight.StartNode != 'normal'))) {
            return false;
        }
        if (form.hr02.tuition == "" || form.hr02.tuition == null) {
            form.hr02.tuition = 0;
        }

        if (form.hr02.materialFees == "" || form.hr02.materialFees == null) {
            form.hr02.materialFees = 0;
        }
        if (form.hr02.otherFees == "" || form.hr02.otherFees == null) {
            form.hr02.otherFees = 0;
        }
        try{
            form.hr02.expectedExpenses = parseFloat(form.hr02.tuition) + parseFloat(form.hr02.materialFees) + parseFloat(form.hr02.otherFees)
        }
        catch(e){
            form.hr02.expectedExpenses =null;
        }
    }


    form.ExcelOut = function () {
        window.open("/AppPages/Workflow/hr02_7120347c524f4f2fbcbe49c66fdcce29/个人发展计划表模板.xlsx")
    }

    //grid删除
    form.delete = function () {
        var evens = _.remove(form.hr02d, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }


    form.chooseEmp = function (data, row) {
        debugger
        if (data[0]) {
            row.partName = data[0].name;
            row.partDept = data[0].groupName;
            row.partJob = data[0].jobName;


            var result = program('GetParticipantSupervisor', { userID: data[0].userid })
            var Data = eval('(' + result + ')')
            row.partSupervisor = Data.Table1[0].Name
        }
    }
}