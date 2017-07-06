var IsYellow = false;
function controller(base, form, program) {
    form.$page_load = function () {
        if (base.taskId == undefined && base.procId == undefined && base.draftId == undefined) {
            var NowDate = new Date().format('yyyy-MM-dd');
            var timestampa = Date.parse(new Date());  //时间戳单位为毫秒 1970年01月01日 08:00开始
            var real_time = timestampa / (1000 * 60 * 60); //小时
            var fen_time = new Date(timestampa) / (1000 * 60);   //分
            var Shi = (real_time % 24);
            Shi = Math.floor(Shi) + 8;
            Shi = Shi.toString();
            var Fen = fen_time % 60;
            Fen = Math.floor(Fen).toString();
            if (Shi.length == 1) Shi = "0" + Shi;
            if (Fen.length == 1) Fen = "0" + Fen;
            var time = NowDate.toString() + " " + Shi + ":" + Fen;
            time = time.replace(/-/g, "/");
            var NowDatetime = new Date(time);

            //new Date(time).format('yyyy-MM-dd hh:mm');
            form.mpl01rereportinfo.push({ okForDeliveryDate: NowDate });
            form.mpl01demand.push({})
            form.mpl01measures.push({ time: NowDatetime });
        }
        //默认值设置
        if (form.mpl01.priority == "" || form.mpl01.priority == null) {
            form.mpl01.priority = "D233EA83-5C2E-4230-8608-D3AF3A23CF2F";    //优先级默认为R
        }
        if (form.mpl01.issueDate == "" || form.mpl01.issueDate == null) {
            var NowDate = new Date().format("yyyy-MM-dd");
            form.mpl01.issueDate = NowDate;   //发布时间默认为当前日期
        }
        if (form.mpl01.dateofNextUpdate == "" || form.mpl01.dateofNextUpdate == null) {
            var NowDate = new Date().format("yyyy-MM-dd");
            var dd = new Date();
            dd.setDate(dd.getDate() + 1);//获取明天
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1;//获取当前月份的日期
            var d = dd.getDate();
            NowDate = y + "-" + m + "-" + d;
            form.mpl01.dateofNextUpdate = NowDate;   //再次更新时间默认为明天
        }
        if (form.mpl01.warningNo == "" || form.mpl01.warningNo == null) {
            form.mpl01.warningNo = "系统自动生成";
        }
        if (form.mpl01.snNumber != undefined) {
            form.mpl01.warningNo = form.mpl01.snNumber;
        }
        if (form.mpl01.priority == "A6407BAA-2ABC-44EB-AC0E-0AB60DB2F6D4") { IsYellow = true }

        if (form.$nodeCode == 'MPL01_MP003' || form.$nodeCode == 'MPL01_MP004') {
             form.addmeasures()
        }
        //实现牵扯措施按照time排序 最新更新显示在第一行
        if (form.$nodeCode == 'MPL01_MP003' || form.$nodeCode == 'MPL01_MP004') {
            var a = new Array();
            for (var i = 0; i < form.mpl01measures.length; i++) {
                a.push(form.mpl01measures[i]);
            }
            for (var i = 0; i < form.mpl01measures.length; i++) {
                var timeA = form.mpl01measures[i].time;
                var k = 0;
                for (var j = i + 1; j < form.mpl01measures.length; j++) {
                    var timeB = form.mpl01measures[j].time;
                    if (timeB > timeA) {
                        timeA = timeB;
                        k = j;
                    }
                }
                if (k != 0) {
                    var data = form.mpl01measures[i];
                    form.mpl01measures[i] = form.mpl01measures[k];
                    form.mpl01measures[k] = data;
                }
            }
        }
        //已有的牵扯措施不可编辑
        if (form.$nodeCode != 'Start' || (base.taskId != '' && base.taskId != undefined)) {
            for (var i = 1; i < form.mpl01measures.length; i++) {
                form.mpl01measures[i].isold = true;
            }
        }
    }
    form.$event_submit_before = function (context) {
        var compileDate = form.mpl01.issueDate.replace(/-/g, "/");
        compileDate = Date.parse(form.mpl01.issueDate);
        compileDate = new Date(form.mpl01.issueDate);
        form.mpl01.dateofNextUpdate = new Date(form.mpl01.dateofNextUpdate);
        //预警编号赋值（预警编号==流程单号）
        if (form.mpl01.snNumber != "" && form.mpl01.snNumber != null) {
            form.mpl01.warningNo = form.mpl01.snNumber;
        }
        var ToDate = new Date().format("yyyy-MM-dd");
        var IssDate = form.mpl01.issueDate.format("yyyy-MM-dd");
        //数据合理校验
        if (form.mpl01.dateofNextUpdate < compileDate) {
            form.$toast("再次更新日期不应小于发布日期");
            return context.$stop();
        }
        if (IssDate < ToDate) {
            form.$toast("发布日期小于当前日期");
            return context.$stop();
        }
        //工厂停线时间要早于客户停线时间
        for (var i = 0; i < form.mpl01rereportinfo.length; i++) {
            if (form.mpl01rereportinfo[i].stoppageDate > form.mpl01rereportinfo[i].customerLinedownDate) {
                form.$toast("工厂停线时间要早于客户停线时间");
                return context.$stop();
            }
            form.mpl01rereportinfo[i].stoppageDate = new Date(form.mpl01rereportinfo[i].stoppageDate);
            form.mpl01rereportinfo[i].customerLinedownDate = new Date(form.mpl01rereportinfo[i].customerLinedownDate);
        }
        //最小需求量Daily<= Weekly  Weekly < = Monthly 且为数值类型
        for (var i = 0; i < form.mpl01demand.length; i++) {
            var Day = parseInt(form.mpl01demand[i].daily);
            form.mpl01demand[i].daily = Day;
            var Week = parseInt(form.mpl01demand[i].weekly);
            form.mpl01demand[i].weekly = Week;
            var Monthly = parseInt(form.mpl01demand[i].monthly);
            form.mpl01demand[i].monthly = Monthly;
            if (Day > Week) {
                form.$toast("Daily不应该大于Weekly");
                return context.$stop();
            }
            if (Week > Monthly) {
                form.$toast("Weekly不应该大于Monthly");
                return context.$stop();
            }
        }
        return context.$continue()
    }
    form.$event_agree_before = function (context) {
        //工厂停线时间要早于客户停线时间
        for (var i = 0; i < form.mpl01rereportinfo.length; i++) {
            if (form.mpl01rereportinfo[i].stoppageDate > form.mpl01rereportinfo[i].customerLinedownDate) {
                form.$toast("工厂停线时间要早于客户停线时间");
                return context.$stop();
            }
        }
        //最小需求量Daily<= Weekly  Weekly < = Monthly 且为数值类型
        for (var i = 0; i < form.mpl01demand.length; i++) {
            if (form.mpl01demand[i].daily > form.mpl01demand[i].weekly) {
                form.$toast("Daily不应该大于Weekly");
                return context.$stop();
            }
            if (form.mpl01demand[i].weekly > form.mpl01demand[i].monthly) {
                form.$toast("Weekly不应该大于Monthly");
                return context.$stop();
            }
        }
        debugger
        //是否状态由黄色变红色
        if (IsYellow == true) {
            if (form.mpl01.priority == "D233EA83-5C2E-4230-8608-D3AF3A23CF2F") {
                form.mpl01.isYtoR = 1;
            }
        }
        //回到供应商工程师审批后 审批取值字段重新赋值
        if (form.$nodeCode == "MPL01_MP002") {
            form.mpl01.isYtoR = 0;
        }
        //牵制措施录入时间赋值
        if (form.$nodeCode == "MPL01_MP003" || form.$nodeCode == "MPL01_MP004") {
            for (var i = 0; i < form.mpl01measures.length; i++) {
                var a = form.mpl01measures[i];
                var myDate = new Date().format("yyyy-MM-dd hh:mm:ss");
                if (a.time == "" || a.time == undefined) {
                    a.time = myDate;
                }
            }
        }

        return context.$continue()
    }
    //点击解除供货风险
    form.clickDelivery = function (row) {
        var PartName = row.partName;
        if (row.okForDelivery) { //选中
            for (var i = 0; i < form.mpl01demand.length; i++) {
                if (form.mpl01demand[i].partName == PartName) {
                    form.mpl01demand[i].isRemove = 1;
                }
            }
        } else { //不再选中
            for (var i = 0; i < form.mpl01demand.length; i++) {
                if (form.mpl01demand[i].partName == PartName) {
                    form.mpl01demand[i].isRemove = 0;
                }
            }
        }
    }
    //优先级背景色
    form.setcolor = function (status) {
        var p = "";
        if ('D233EA83-5C2E-4230-8608-D3AF3A23CF2F' == status) {
            p = 'red';
        } else if ('A6407BAA-2ABC-44EB-AC0E-0AB60DB2F6D4' == status) {
            p = 'yellow';
        } else {
            p = 'green';
        }
        return { "background-color": p };
    }

    //物料模块 料件名称 焦点离开事件  给最小需求量物料名称赋值
    form.blur = function (row) {
        var index; //获取细表行下标
        for (var i = 0; i < form.mpl01rereportinfo.length; i++) {
            if (form.mpl01rereportinfo[i] == row) {
                index = i;
            }
        }
        form.mpl01demand[index].partName = row.partName;
    }

    form.addrereportinfo = function () {
        var NowDate = new Date().format('yyyy-MM-dd');
        form.mpl01rereportinfo.push({
            okForDeliveryDate: NowDate
        });
    }
    form.addmeasures = function () {
        debugger
        var NowDate = new Date().format('yyyy-MM-dd');
        var timestampa = Date.parse(new Date());  //时间戳单位为毫秒 1970年01月01日 08:00开始
        var real_time = timestampa / (1000 * 60 * 60); //小时
        var fen_time = new Date(timestampa) / (1000 * 60);   //分
        var Shi = (real_time % 24);
        Shi = Math.floor(Shi) + 8;
        Shi = Shi.toString();
        var Fen = fen_time % 60;
        Fen = Math.floor(Fen).toString();
        if (Shi.length == 1) Shi = "0" + Shi;
        if (Fen.length == 1) Fen = "0" + Fen;
        var time = NowDate.toString() + " " + Shi + ":" + Fen;
        time = time.replace(/-/g, "/");
        var NowDatetime = new Date(time);
        //var NowDatetime = new Date(time).format('yyyy-MM-dd hh:mm');
        form.mpl01measures.push({ time: NowDatetime })
        //实现每次新增新增在第一行
        var data1 = form.mpl01measures[(form.mpl01measures.length - 1)];
        for (var i = form.mpl01measures.length; i > 1 ; i--) {
            form.mpl01measures[(i - 1)] = form.mpl01measures[(i - 2)];
        }
        form.mpl01measures[0] = data1;
    }

    //报告信息明细表grid删除
    form.deletereportinfo = function () {
        debugger
        for (var i = 0; i < form.mpl01rereportinfo.length; i++) {
            if (form.mpl01rereportinfo[i].checked == true) {
                form.mpl01demand[i].checked = true;
            }
        }
        var evens = _.remove(form.mpl01rereportinfo, function (n) {
            return n.checked;
        });
        form.deleteDemand();
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }
    //最小需求量明细表grid删除
    form.deleteDemand = function () {
        var evens = _.remove(form.mpl01demand, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }
    //牵制措施明细表grid删除
    form.deleteMeasures = function () {
        var evens = _.remove(form.mpl01measures, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }

}