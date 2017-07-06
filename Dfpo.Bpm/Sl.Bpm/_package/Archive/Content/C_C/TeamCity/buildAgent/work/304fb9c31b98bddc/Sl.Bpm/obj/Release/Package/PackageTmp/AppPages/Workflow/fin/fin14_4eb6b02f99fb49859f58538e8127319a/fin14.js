
function controller(base, form, program) {
    //alert(JSON.stringify(base)); alert(JSON.stringify(form));
    form.import = {}; 
    form.delete = function () {   //删除行
        var evens = _.remove(form.fin14d, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
    }
    //3行的行内合计|列的合计 
    form.sum = function (data) {
        for (var i = 0; i < form.fin14d.length; i++) { 
            //每类4行 第四行=前三行的合计 
            if (i % 4 == 3) {
                var item1 = form.fin14d[i-3];
                var item2 = form.fin14d[i-2];
                var item3 = form.fin14d[i - 1];
                var item4 = form.fin14d[i]; 
                item4.monthA = _$.getInt(item2.monthA,  item3.monthA);
                item4.monthB = _$.getInt(item2.monthB,  item3.monthB);
                item4.monthC = _$.getInt(item2.monthC,  item3.monthC);
                item4.monthD = _$.getInt(item2.monthD,  item3.monthD);
                item4.monthE = _$.getInt(item2.monthE,  item3.monthE);
                item4.monthF = _$.getInt(item2.monthF,  item3.monthF);
                item4.monthG = _$.getInt(item2.monthG,  item3.monthG);
                item4.monthH = _$.getInt(item2.monthH,  item3.monthH);
                item4.monthI = _$.getInt(item2.monthI,  item3.monthI);
                item4.monthJ = _$.getInt(item2.monthJ,  item3.monthJ);
                item4.monthK = _$.getInt(item2.monthK,  item3.monthK);
                item4.monthL = _$.getInt(item2.monthL,  item3.monthL);
            } 
            var item = form.fin14d[i]; //每行的结尾列合计的计算
            item.monthSum = _$.getInt(
                item.monthA,item.monthB,item.monthC,item.monthD,item.monthE,item.monthF,
                item.monthG,item.monthH,item.monthI,item.monthJ,item.monthK,item.monthL); 
        } 
    }
    //--update yfivc_md_costaccount set 
    //--monthA=b.monthA, monthB=b.monthB, monthC=b.monthC, monthD=b.monthD, monthE=b.monthE, monthF=b.monthF,
    //--monthG=b.monthG, monthH=b.monthH, monthI=b.monthI, monthJ=b.monthJ, monthK=b.monthK, monthL=b.monthL  from  
    //--yfivc_md_costaccount  a  join  (  
    //--select  m.CreationTime,costCenter,Account,
    //--monthA,monthB,monthC,monthD,monthE,monthF,
    //--monthG,monthH,monthI,monthJ,monthK,monthL 
    //--from  yfvic_fin14_mstr  m  join  yfvic_fin14_det n on  m.TaskId=n.TaskId  and n.ClassCode='NewApproval'
    //--where m.TaskId=<%sysTaskID%> ) b on a.costCenter=b.costCenter and  a.Account=b.Account  and  a.CostYear=year(b.CreationTime)
    form.checkfin14d = function (ind) {  
        var checked = form.fin14d[ind - 1].checked;  
        form.fin14d[ind].checked = checked;
        form.fin14d[ind+1].checked = checked;
        form.fin14d[ind + 2].checked = checked; 
    }
    form.add = function (acc, cct, accch, accen,cctch,ccten) {
        var len = form.fin14d.length + 1; 
        for (var i = len; i < len + 4; i++) {
            var classcode = "";
            var classname = "";
            var per = form.fin14d.length% 4;
            if (per == "0") { classcode = "Original"; classname = "原预算"; }
            if (per == "1") { classcode = "Last"; classname = "上次审批限额"; }
            if (per == "2") { classcode = "Adjust"; classname = "调整金额"; }
            if (per == "3") { classcode = "NewApproval"; classname = "新审批限额"; }
            form.fin14d.push({
                $edit: true,
                gridOrder: i,feeId:null,
                account: acc, costCenter: cct,
                accountCH: accch, accountEN: accen, costCenterCH: cctch, costCenterEN: ccten,
                classCode: classcode,
                className: classname, 
                monthA:0,monthB:0,monthC:0,monthD:0,monthE:0,monthF:0,
                monthG:0,monthH:0,monthI:0,monthJ:0,monthK:0,monthL:0  
            }); 
        }  
    }
    form.blurCostCenterOrAccount = function (row, item) { //ind 第几行 从1开始  
        //alert(111);  
        //alert(JSON.stringify(form.fin14d)); 
        var ind = item.gridOrder; 
        if (ind % 4 == 1 && row[0] != null) {
            form.clearline(ind);
            var account    = row[0].account;
            var costCenter = row[0].costCenter;
            var accountCH = row[0].accountDesc;
            var accountEN = accountCH;
            var costCenterCH = row[0].costcenterDesc;
            var costCenterEN = costCenterCH;
            var feeId = row[0].id;
            //alert('accountCH' + accountCH + 'costCenterCH' + costCenterCH);

            form.fin14d[ind - 1].account = account; //默认每四行都是一样的
            form.fin14d[ind + 0].account = account;
            form.fin14d[ind + 1].account = account;
            form.fin14d[ind + 2].account = account; 
            form.fin14d[ind - 1].costCenter = costCenter;
            form.fin14d[ind + 0].costCenter = costCenter;
            form.fin14d[ind + 1].costCenter = costCenter;
            form.fin14d[ind + 2].costCenter = costCenter;
            form.fin14d[ind - 1].feeId = feeId;    
            form.fin14d[ind + 0].feeId = feeId;
            form.fin14d[ind + 1].feeId = feeId;
            form.fin14d[ind + 2].feeId = feeId;

            form.fin14d[ind - 1].accountCH = accountCH;
            form.fin14d[ind + 0].accountCH = accountCH;
            form.fin14d[ind + 1].accountCH = accountCH;
            form.fin14d[ind + 2].accountCH = accountCH;
            form.fin14d[ind - 1].accountEN = accountEN;
            form.fin14d[ind + 0].accountEN = accountEN;
            form.fin14d[ind + 1].accountEN = accountEN;
            form.fin14d[ind + 2].accountEN = accountEN;
            form.fin14d[ind - 1].costCenterCH = costCenterCH;
            form.fin14d[ind + 0].costCenterCH = costCenterCH;
            form.fin14d[ind + 1].costCenterCH = costCenterCH;
            form.fin14d[ind + 2].costCenterCH = costCenterCH;
            form.fin14d[ind - 1].costCenterEN = costCenterEN;
            form.fin14d[ind + 0].costCenterEN = costCenterEN;
            form.fin14d[ind + 1].costCenterEN = costCenterEN;
            form.fin14d[ind + 2].costCenterEN = costCenterEN;
          
            var data = program('GetCostAccount', { costCenter: costCenter, account: account }); //返回的值是object对象 不需要再做joson转换
            if (data.length > 0) {
                var dsource = data[0];
                //alert(ind + "获取的数据值" + JSON.stringify(dsource));
                var lind = ind - 1;//维护的预算 原预算
                form.fin14d[lind].monthA = dsource.monthA;
                form.fin14d[lind].monthB = dsource.monthB;
                form.fin14d[lind].monthC = dsource.monthC;
                form.fin14d[lind].monthD = dsource.monthD;
                form.fin14d[lind].monthE = dsource.monthE;
                form.fin14d[lind].monthF = dsource.monthF;
                form.fin14d[lind].monthG = dsource.monthG;
                form.fin14d[lind].monthH = dsource.monthH;
                form.fin14d[lind].monthI = dsource.monthI;
                form.fin14d[lind].monthJ = dsource.monthJ;
                form.fin14d[lind].monthK = dsource.monthK;
                form.fin14d[lind].monthL = dsource.monthL;

                lind = ind;//上次审批限额 
                form.fin14d[lind].monthA = dsource.lastMonthA;
                form.fin14d[lind].monthB = dsource.lastMonthB;
                form.fin14d[lind].monthC = dsource.lastMonthC;
                form.fin14d[lind].monthD = dsource.lastMonthD;
                form.fin14d[lind].monthE = dsource.lastMonthE;
                form.fin14d[lind].monthF = dsource.lastMonthF;
                form.fin14d[lind].monthG = dsource.lastMonthG;
                form.fin14d[lind].monthH = dsource.lastMonthH;
                form.fin14d[lind].monthI = dsource.lastMonthI;
                form.fin14d[lind].monthJ = dsource.lastMonthJ;
                form.fin14d[lind].monthK = dsource.lastMonthK;
                form.fin14d[lind].monthL = dsource.lastMonthL;
            } else {
                lind = ind;//上次审批限额 
                form.fin14d[lind].monthA = null;
                form.fin14d[lind].monthB = null;
                form.fin14d[lind].monthC = null;
                form.fin14d[lind].monthD = null;
                form.fin14d[lind].monthE = null;
                form.fin14d[lind].monthF = null;
                form.fin14d[lind].monthG = null;
                form.fin14d[lind].monthH = null;
                form.fin14d[lind].monthI = null;
                form.fin14d[lind].monthJ = null;
                form.fin14d[lind].monthK = null;
                form.fin14d[lind].monthL = null;
            }

        }
        form.sum(); 
    }
    //清空非调整行的金额数据
    form.clearline = function (grid) {
        if (grid % 4 == 1 || grid % 4 == 2) {
            var lineindex = grid - 1;
            var defalut = 0;
            if (grid % 4 == 2) { defalut = null; }
            form.fin14d[lineindex].monthA = defalut;
            form.fin14d[lineindex].monthB = defalut;
            form.fin14d[lineindex].monthC = defalut;
            form.fin14d[lineindex].monthD = defalut;
            form.fin14d[lineindex].monthE = defalut;
            form.fin14d[lineindex].monthF = defalut;
            form.fin14d[lineindex].monthG = defalut;
            form.fin14d[lineindex].monthH = defalut;
            form.fin14d[lineindex].monthI = defalut;
            form.fin14d[lineindex].monthJ = defalut;
            form.fin14d[lineindex].monthK = defalut;
            form.fin14d[lineindex].monthL = defalut;
        }
    }
    form.getlength = function (data) { 
        form.fin14d.length = 0;    //清空数据行
        form.$timeout(function () {
            if (!!data && data.length > 0) { 
                for (var i = 0; i < data.length; i++) {
                    var acc = data[i].account;
                    var cct = data[i].costCenter;
                    var cctch = data[i].costCenterDesc;
                    var ccten = cctch;
                    var accch = data[i].accountDesc;
                    var accen = accch; 
                    form.add(acc, cct, accch, accen, cctch, ccten);

                    var lind = (i * 4) + 2; //调整行存导入的值
                    var dsource = data[i]; 
                    form.fin14d[lind].monthA = dsource.monthA;
                    form.fin14d[lind].monthB = dsource.monthB;
                    form.fin14d[lind].monthC = dsource.monthC;
                    form.fin14d[lind].monthD = dsource.monthD;
                    form.fin14d[lind].monthE = dsource.monthE;
                    form.fin14d[lind].monthF = dsource.monthF;
                    form.fin14d[lind].monthG = dsource.monthG;
                    form.fin14d[lind].monthH = dsource.monthH;
                    form.fin14d[lind].monthI = dsource.monthI;
                    form.fin14d[lind].monthJ = dsource.monthJ;
                    form.fin14d[lind].monthK = dsource.monthK;
                    form.fin14d[lind].monthL = dsource.monthL; 
                  
                    var datafrom = program('GetCostAccount', { costCenter: cct, account: acc }); //返回的值是object对象 不需要再做joson转换
                    if (datafrom.length > 0) {
                        var dsource = datafrom[0];
                        var lind = (i * 4) + 0;//维护的预算 原预算
                        form.fin14d[lind].monthA = dsource.monthA;
                        form.fin14d[lind].monthB = dsource.monthB;
                        form.fin14d[lind].monthC = dsource.monthC;
                        form.fin14d[lind].monthD = dsource.monthD;
                        form.fin14d[lind].monthE = dsource.monthE;
                        form.fin14d[lind].monthF = dsource.monthF;
                        form.fin14d[lind].monthG = dsource.monthG;
                        form.fin14d[lind].monthH = dsource.monthH;
                        form.fin14d[lind].monthI = dsource.monthI;
                        form.fin14d[lind].monthJ = dsource.monthJ;
                        form.fin14d[lind].monthK = dsource.monthK;
                        form.fin14d[lind].monthL = dsource.monthL;

                        lind = (i * 4) + 1;//上次审批限额 
                        form.fin14d[lind].monthA = dsource.lastMonthA;
                        form.fin14d[lind].monthB = dsource.lastMonthB;
                        form.fin14d[lind].monthC = dsource.lastMonthC;
                        form.fin14d[lind].monthD = dsource.lastMonthD;
                        form.fin14d[lind].monthE = dsource.lastMonthE;
                        form.fin14d[lind].monthF = dsource.lastMonthF;
                        form.fin14d[lind].monthG = dsource.lastMonthG;
                        form.fin14d[lind].monthH = dsource.lastMonthH;
                        form.fin14d[lind].monthI = dsource.lastMonthI;
                        form.fin14d[lind].monthJ = dsource.lastMonthJ;
                        form.fin14d[lind].monthK = dsource.lastMonthK;
                        form.fin14d[lind].monthL = dsource.lastMonthL;
                    } else {
                        lind = (i * 4) + 1;//上次审批限额 
                        form.fin14d[lind].monthA = null;
                        form.fin14d[lind].monthB = null;
                        form.fin14d[lind].monthC = null;
                        form.fin14d[lind].monthD = null;
                        form.fin14d[lind].monthE = null;
                        form.fin14d[lind].monthF = null;
                        form.fin14d[lind].monthG = null;
                        form.fin14d[lind].monthH = null;
                        form.fin14d[lind].monthI = null;
                        form.fin14d[lind].monthJ = null;
                        form.fin14d[lind].monthK = null;
                        form.fin14d[lind].monthL = null;
                    }

                }
            } 
           form.sum();
        }); 
    }

    //form.getlength = function (data) { 
    //    form.$timeout(function () {
    //        if (!!data && data.length > 0) {
    //            for (var i = 0; i < data.length; i++) {
    //                alert(111111);
    //                var result = program('GetCostCenterAndAccount', { id: data[i].costCenter });
    //                if (result == "" || result == null) {
    //                    mabp.notify.warn("第" + (i + 1) + "成本中心数据格式不正确！");
    //                    break;
    //                }
    //                data[i].costCenter = result;  
    //            }
    //        }
    //    });
    //} 
    //var totalUnitPrice;
    form.$page_load = function () {
        form.sum();
        //displayAttachment：上传的附件是否展示，默认不展示
        //validateAll：在导入面板中的数据是否通过所有基础验证才可以保存，默认是
        //form.import.base = {
        //    name: "yfvic_fin14_det",
        //    displayAttachment: true,
        //    template: "Template.xls",
        //    allowPaged: true,
        //    pageSize: 10,
        //    validateAll: true,
        //    buttonName: "模版下载导入"
        //}; 
        ////columnName：展示列名
        ////columnSource：对应数据库名称
        ////dataSourceType：数据源类型：1：普通input 2：基础数据 3：数据视图
        ////basicDataType：如果数据源dataSourceType为2-基础数据，这个地方用于标识该字段所需要返回的值类型：1：Id，2：Value，3：Text
        ////required：是否必填
        ////dataType:数据类型，用于检测导入的数据是否出现值类型错误：1：Int，2：Nvarchar，3：Real，4：Bit，5：Decimal，6：DateTime
        //form.import.columns = [
        //          { columnName: form.$pageLang.CostCenter, columnSource: "CostCenter", dataSourceType: 3, basicDataType:3, required: true, dataType: 2 },
        //          { columnName: form.$pageLang.Account, columnSource: "Account", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 },
        //          { columnName: form.$pageLang.Month1, columnSource: "monthA", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 },
        //          { columnName: form.$pageLang.Month2, columnSource: "monthB", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 },
        //          { columnName: form.$pageLang.Month3, columnSource: "monthC", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 },
        //          { columnName: form.$pageLang.Month4, columnSource: "monthD", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 },
        //          { columnName: form.$pageLang.Month5, columnSource: "monthE", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 },
        //          { columnName: form.$pageLang.Month6, columnSource: "monthF", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 },
        //          { columnName: form.$pageLang.Month7, columnSource: "monthG", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 },
        //          { columnName: form.$pageLang.Month8, columnSource: "monthH", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 },
        //          { columnName: form.$pageLang.Month9, columnSource: "monthI", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 },
        //          { columnName: form.$pageLang.Month10, columnSource: "monthJ", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 },
        //          { columnName: form.$pageLang.Month11, columnSource: "monthK", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 },
        //          { columnName: form.$pageLang.Month12, columnSource: "monthL", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 }
        //];
    } 
    form.importD = function (importData) {
        form.fin14d.length = 0;    //清空数据行
        for (var i = 0; i < importData.length; i++) {
            if (importData[i]._ValidateError != "" && importData[i]._ValidateError != null) {
                continue;
            }
            var acc = importData[i].account;
            var cct = importData[i].costCenter;
            var accCH = importData[i].accountDesc;
            var accEN = accCH;
            var cctCH = importData[i].costCenterDesc;
            var cctEN= cctCH;
            form.add(acc, cct, accCH, accEN, cctCH, cctEN);
            var lind = (i * 4) + 2; //调整行存导入的值
            var dsource = importData[i];
            form.fin14d[lind].monthA = dsource.monthA;
            form.fin14d[lind].monthB = dsource.monthB;
            form.fin14d[lind].monthC = dsource.monthC;
            form.fin14d[lind].monthD = dsource.monthD;
            form.fin14d[lind].monthE = dsource.monthE;
            form.fin14d[lind].monthF = dsource.monthF;
            form.fin14d[lind].monthG = dsource.monthG;
            form.fin14d[lind].monthH = dsource.monthH;
            form.fin14d[lind].monthI = dsource.monthI;
            form.fin14d[lind].monthJ = dsource.monthJ;
            form.fin14d[lind].monthK = dsource.monthK;
            form.fin14d[lind].monthL = dsource.monthL; 
        }
        form.sum();
    } 
}