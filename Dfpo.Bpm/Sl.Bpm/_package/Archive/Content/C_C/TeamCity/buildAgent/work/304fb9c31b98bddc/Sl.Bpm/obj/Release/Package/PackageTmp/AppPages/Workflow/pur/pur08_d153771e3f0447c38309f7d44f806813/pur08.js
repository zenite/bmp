
function controller(base, form, program) {
    debugger;
    form.import = {};
    var areaCode;
    var columns = [
        { columnName: form.$pageLang.Mark, columnSource: "Checked", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 }, //是否标记
        { columnName: form.$pageLang.Supplier, columnSource: "Supplier", dataSourceType: 1, basicDataType: 2, required: false, dataType: 2 }, //供应商名称
        { columnName: form.$pageLang.SupplierCode, columnSource: "SupplierCode", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 }, //供应商QAD编码
        { columnName: form.$pageLang.PartNumber, columnSource: "PartNumber", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 }, //品号
        { columnName: form.$pageLang.PartDescription, columnSource: "PartDescription", dataSourceType: 1, basicDataType: 2, required: false, dataType: 2 }, //品号描述
        { columnName: form.$pageLang.Currency, columnSource: "Currency", dataSourceType: 3, basicDataType: 2, required: true, dataType: 2 }, //币种
        { columnName: form.$pageLang.UnitPrice, columnSource: "UnitPrice", dataSourceType: 1, basicDataType: 2, required: true, dataType: 4 }, //单价
        { columnName: form.$pageLang.LeadTime, columnSource: "LeadTime", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 }, //交期
        { columnName: form.$pageLang.Mpq, columnSource: "Mpq", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 }, //最小包装
        { columnName: form.$pageLang.Moq, columnSource: "Moq", dataSourceType: 1, basicDataType: 2, required: false, dataType: 2 }, //最小订购
        { columnName: form.$pageLang.ToolLing, columnSource: "ToolLing", dataSourceType: 1, basicDataType: 2, required: false, dataType: 4 } //模具费用
    ];
    var formx = 0;
// ReSharper disable once NativeTypePrototypeExtending

    form.$page_load = function () {
     
        debugger;
        form.normalType = base.pageState !== 1,
            form.pur08.projectText = "",
            form.pur08.buyer = base.initiator.userName,
            form.projectNumbers = false; //选择松江工厂blank按钮不显示
        for (var i = 0; i < form.pur08s.length; i++) {
            form.pur08s[i].checked = form.pur08s[i].checked === 'true' ? true : false;
        }
        if (base.pageState === 1) {
            form.projectCode();
        }
        
        program("StartDate", { id: 1 },
            function(startDate) {
                form.pur08.workSopTime = startDate;
            });
    }
    form.projectCode=function () {
        //阻止事件冒泡
        formx++;
        if (!base.taskId) {
            if (formx === 1) {
                form.pur08s.push({
                    checked: true,
                    currency: "CNY"
                });
            }
        }
        if (base.pageState === 1 && formx === 2) {
            form.pur08.projectCode = '';
            form.pur08.projectCodeText = '';
            form.pur08.projectName = '';
        }
        areaCode = base.initiator.areaCode;
        form.pur08.selectCompany = areaCode;
        form.import.base = {
            name: "yfvic_pur08_schedulepo_details",
            displayAttachment: true,
            template: "SOPR模板.xls",
            allowPaged: true,
            pageSize: 10,
            validateAll: true,
            buttonName: "Schedule PO零件数据导入模板下载 ",
            validateFunc: function(data,dataIndex) { //是否调用自定义验证方法
                form.validateFunc(data, dataIndex);
            }
        };
        if (areaCode === 'YFVIC' || areaCode === 'YFVAY') {
            //删除修模或新开模
            if (columns.length === 12) {
                columns.pop();
            }
            //var cleanout = document.getElementById("cleanout"),
            //    blank = document.getElementById("blank"),
            //    cclassName = cleanout.className,
            //    bclassName = blank.className;
            //if (!!bclassName && cclassName.indexOf(" ng-hide") > -1) {
            //    cleanout.className = cclassName.replace(" ng-hide", "");
            //    blank.className = bclassName + " ng-hide";

            //}
            form.projectNumbers = false;
        }

        if (areaCode === 'YFVSJ') {
            if (columns.length === 11) {
                //增加修模或新开模
                columns.push({
                    columnName: form.$pageLang.OpenModle,
                    columnSource: "MMR",
                    dataSourceType: 2,
                    basicDataType: 2,
                    required: false,
                    dataType: 2
                });
                form.projectNumbers = form.isProject();
            }
        }
        form.calar();
        form.import.columns = columns;
    };

    //清空按钮事件
    form.calar = function() {
        form.pur08.projectName = "";
        form.pur08.projectCodeText = "";
        form.pur08.projectCode = "";
        form.pur08.projectText = "";

    }
    form.validateFunc = function (data, dataIndex) {
        var supplierKeyIndex = form._stringindexkey(data, "supplierCode");
        var dt = program('GetSupperNot', { supplierKey: supplierKeyIndex, areaCode: base.areaCode });//同步调用后台方法
        for (var i = 0; i < data.length; i++) {
            //判断供应商是否有重复字段
            //var validateError = form._arrayequalcount(data, { supplierCode: data[i].supplierCode }) > 1 ? "供应商编号重复;" : "";
            //data[i]._ValidateError = validateError + data[i]._ValidateError;
            // ReSharper disable once JsUnreachableCode
            for (var j = 0; j < dt.length; j++) {
                if ((data[i].supplierCode) === dt[j].qadCode) {
                    data[i]["supplierKey"] = dt[j].supplierKey;
                    data[i]._ValidateError += !!dt[j].validateError ? dt[j].validateError : "";
                    if (dt[j].validateError) {
                        data[i].supplier = data[i].supplier;
                        dataIndex[i].supplier = dataIndex[i].supplier;
                    } else {
                        data[i].supplier = !!dt[j].supplicerName ? dt[j].supplicerName : "";
                        dataIndex[i].supplier = !!dt[j].supplicerName ? dt[j].supplicerName : "";
                    }
                    break;
                } 
            }
        }
    }
     
     


    //抽离对应的数组
    //传入
    //d对应数组对象[{a:1,b:1},{a:2,b:3},{a:4,b:2}]   
    //k对应对象Key a
    //返回A对象数组[1,2,4]
    form._arryeindexkey = function(d, k) {
        var arry = [];
                for (var i = 0; i < d.length; i++) {
                    arry[i] = d[i][k];
                }
        return arry;
    }
    //拼接字符串
    form._stringindexkey= function(d, k) {
        var str="";
        for (var i = 0; i < d.length; i++) {
            str += i === d.length - 1 ? $.trim(d[i][k]) :  $.trim(d[i][k]) + ";";
        }
        return str;
    }

//获取数组对象中相同的count
    form._arrayequalcount = function (d, v) {
        var count = 0, key, value;
        for (var k in v) {
            if (v.hasOwnProperty(k)) {
                key = k;                      //获取属性
                value = v[k];               //获取属性值
            }
        }
        for (var i = 0; i < d.length; i++) {
            // ReSharper disable once UsageOfPossiblyUnassignedValue
            if (d[i][key] === value) {
                count++;
            }
        }
        return count;
    }
    //松江公司模具费有值时
    form.projectGetIFuc= function() {
        form.pur08.projectName = 'blank';
        form.pur08.projectCodeText = 'blank';
        form.pur08.projectCode = 'blank';
        form.pur08.projectText = 'blank';
    }

    //松江工厂判断是否含有模具费用
    form.projectItem = function(item) {
        // ReSharper disable once JsUnreachableCode
        if (base.areaCode === 'YFVSJ') {
            form.projectNumbers = form.isProject();
            //原生JS处理显示清空与blank显示与展示问题
            var cleanout = document.getElementById("cleanout"),
                  blank = document.getElementById("blank"),
                  cclassName = cleanout.className,
                  bclassName = blank.className;
            if (form.isProject() && !!bclassName && bclassName.indexOf(" ng-hide") > -1) {
                blank.className = bclassName.replace(" ng-hide", "");
                cleanout.className = cclassName + " ng-hide";
            } else {
                if (!!bclassName && cclassName.indexOf(" ng-hide") > -1 && !form.isProject()) {
                    cleanout.className = cclassName.replace(" ng-hide", "");
                    blank.className = bclassName + " ng-hide";
                    if (form.pur08.projectCodeText === 'blank') {
                        form.calar();
                    }
                }
            }
                form.pur08.projectCodeText = form.pur08.projectText;
        }
    }
    form.$event_submit_before = function (context) {
        var acrlen = form.pur08s.length;
        if (acrlen < 1) {
            form.$toast("PO单信息至少填写一条！");
            return false;
        }
        return context.$continue();
    }
    //验证是否含模具费用
    form.isProject = function () {
        for (var i = 0; i < form.pur08s.length; i++) {
            if (!!form.pur08s[i].toolLing) {
                return true;
            } 
        }
       return false;
    }
    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
        //if (isNaN(val) || val > this.length) {
        //    return false;
        //}
        //for (var i = 0, n = 0; i < this.length; i++) {
        //    if (this[i] !== this[val]) {
        //        this[n++] = this[i];
        //    }
        //}
        //this.length -= 1;
    }
      form.remove=function(array, index) {
        if (index <= (array.length - 1)) {
            for (var i = index; i < array.length; i++) {
                array[i] = array[i + 1];
            }
        }
        else {
            throw new Error('超出最大索引！');
        }
        array.length = array.length - 1;
        return array;
    }
    Array.prototype.insert = function (index, item) {
        this.splice(index, 0, item);
    };
    form.importD = function (importData) {
        for (var j = 0; j < form.pur08s.length; j++) {
            for (var n = 0; n < importData.length; n++) {
                var supplierCode = importData[n].supplierKey;
                if (form.pur08s[j].supplierCode === supplierCode) {
                    form.pur08s[j].checked = importData[n].checked === "Y" ? true : false;
                    form.pur08s[j].currency = importData[n].currency;
                    form.pur08s[j].leadTime = importData[n].leadTime;
                    if (importData[n].mmr === "1") {
                        importData[n].mmr = "738D1B38-0627-49B1-8151-1EEDE7819AA8";
                    }
                    if (importData[n].mmr === "2") {
                        importData[n].mmr = "CD0B3095-E209-4CE1-BC9C-2D9C4A4921AD";
                    }
                    form.pur08s[j].moq = importData[n].moq;
                    form.pur08s[j].mpq = importData[n].mpq;
                    form.pur08s[j].partDescription = importData[n].partDescription;
                    form.pur08s[j].partNumber = importData[n].partNumber;
                    form.pur08s[j].supplier = importData[n].supplier;
                    form.pur08s[j].supplierCode = supplierCode;
                    form.pur08s[j].toolLing = importData[n].toolLing;
                    form.pur08s[j].unitPrice = importData[n].unitPrice;
                    importData.remove(n);
                    break;
                }
            }

        }

        for (var i = importData.length; i--;) {
            if (importData[i].mmr === "1") {
                importData[i].mmr = "738D1B38-0627-49B1-8151-1EEDE7819AA8";
            }
            if (importData[i].mmr === "2") {
                importData[i].mmr = "CD0B3095-E209-4CE1-BC9C-2D9C4A4921AD";
            }
            form.pur08s.insert(0, {
                checked: importData[i].checked === 'Y' ? true : false,
                supplier: importData[i].supplier,
                supplierCode: importData[i].supplierKey,
                partNumber: importData[i].partNumber,
                partDescription: importData[i].partDescription,
                unitPrice: importData[i].unitPrice,
                currency: importData[i].currency,
                leadTime: importData[i].leadTime,
                mpq: importData[i].mpq,
                moq: importData[i].moq,
                toolLing: importData[i].toolLing,
                mmr: importData[i].mmr
            });
            //form.pur08s.push({
            //    checked: importData[i].checked === 'Y' ? true : false,
            //    supplier: importData[i].supplier,
            //    supplierCode: importData[i].supplierCode,
            //    partNumber: importData[i].partNumber,
            //    partDescription: importData[i].partDescription,
            //    unitPrice: importData[i].unitPrice,
            //    currency: importData[i].currency,
            //    leadTime: importData[i].leadTime,
            //    mpq: importData[i].mpq,
            //    moq: importData[i].moq,
            //    toolLing: importData[i].toolLing,
            //    mmr: importData[i].mmr
            //});
        }
        for (var k = 0; k < form.pur08s.length; k++) {
            if (form.pur08s[k].supplierCode === undefined) {
                form.remove(form.pur08s, k);
            }
        }
    }
    //选择项目编号带出项目名信息
    form.getProjectName = function (item) {
        if (!!item && item[0] != null) {
            var row = item[0];
            form.pur08.projectName = row.projectDesc;
            form.pur08.projectText = row.text;
            return;
        }
    }
    //选择供应商Code带出供应商信息
    form.chooseSupplier = function (selectItem, item) {
        if (!!selectItem && selectItem[0] != null) {
            var row = selectItem[0];
            item.supplier = row.qadSupplicerName;
        }
    }
    //所属公司必填
    form.$doValidation = function() {

        if (base.areaCode === undefined) {
            form.$alert("请选择所属公司");
            return false;
        }
        return true;
    }
    //form.number = function (item) {
    //    item.unitPrice = form.tonumber(item.unitPrice);
    //    item.toolLing=form.tonumber(item.toolLing);
    //}

    ////单价数据格式化不计入四省五入   例如0121.001200  格式化121.0012
    form.tonumber = function (v) {
        if (!!v) {
            var str = v.split('.'),n;
            
            if (str[0].length > 1) {
                v =  form.zero(str[0]);
            }
      
            if (str.length > 1) {
                n = str[1];
                if (str[1].length > 2)
                {
                    n= form.decimalZero(str[1]);
                }
                v = v + "." + n;
            }
        }
        return v;
    }
    ///整数前位清零
    form.zero = function (v)
    {
        if (v.substring(0, 1) === '0') {
            v = v.substring(1, v.length);
            return form.zero(v);
        }
        return v;
    }
    //小数位两位后位清零
    form.decimalZero = function (v){
        if(v.length>2){
            var str=v.substring(2,v.length);
            if (str.charAt(str.length - 1)==='0') {
                v = v.substring(0, v.length - 1);
                return form.decimalZero(v);
            }
        }
        return v;
    }
    form.add = function () {

        form.pur08s.push({
            checked: true,
            currency: "CNY"
        });
    }
    form.delete = function () {
        var evens = _.remove(form.pur08s, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }
}
