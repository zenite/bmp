function controller(base, form, program) { 
    form.$page_load = function () { 
        //默认值 
        if (base.taskId == "" || base.taskId == null) {
            form.fin13u.currency = "CNY";
            form.fin13u.sopYearlyTax = "1.00";
        } 
    } 
   var ss= base.$getBasicData("Finance>FinItems>ProfitsItems", function () {

   }); 
    form.intapptype = 0; 
    if (form.fin13u.appType == "1") {//01ecfe70-1ffc-44e5-8667-6fc8c6483c7f
        form.intapptype = 1;
    }
    else if (form.fin13u.appType == '2') {//63b7af54-2177-4959-b384-a188260a397c
        form.intapptype = 2;
    }
    else if (form.fin13u.appType == '3') {//54001b52-6ade-4597-9f16-24ca5b0e4e1d
        form.intapptype = 3;
    } 
    //默认三行数据  
    var arrItemCodeKey = ["H", "I", "S010"];  
    var arrCatKey = ["Tooling", "Plantfixture", "Engineeringexpense"]; //多语言Key
    var arrCat = [ form.$pageLang.Tooling,form.$pageLang.Plantfixture,form.$pageLang.Engineeringexpense];// "Tooling (模具)", "Plant fixture (工厂夹具)", "Engineering expense (工程费用)"];
    form.fin13udaddone = function () {
        form.fin13ud.push({
            $edit: true,
            usdAmountA: null
        }); 
    }
    if (form.fin13ud.length == 0) {
        for (var i = 0; i < 3; i++) {
            form.fin13udaddone();
            form.fin13ud[i].itemCode = arrItemCodeKey[i];
            form.fin13ud[i].category = arrCatKey[i];
            form.fin13ud[i].categoryDes = arrCat[i];

            form.fin13ud[i].rmbAmountA = 0;
            form.fin13ud[i].rmbAmountB = 0;
            form.fin13ud[i].rmbAmountC = 0;
            form.fin13ud[i].usdAmountA = 0;
            form.fin13ud[i].usdAmountB = 0;
            form.fin13ud[i].usdAmountC = 0; 
        }
        form.fin13u.rmbAmountA = 0;
        form.fin13u.usdAmountA = 0;
        form.fin13u.rmbAmountB = 0;
        form.fin13u.usdAmountB = 0;
        form.fin13u.rmbAmountC = 0;
        form.fin13u.usdAmountC = 0;
        form.fin13u.rmbAmountSum = 0;
        form.fin13u.usdAmountSum = 0;

        form.fin13u.startYear = new Date().getFullYear();
         
    }  
    //3行的行内合计|列的合计 
    form.sum = function (data) {
        var sopYearlyTax = form.fin13u.sopYearlyTax;
        if (sopYearlyTax == 0) { sopYearlyTax = 1; } //防止除0  

        for (var i = 0; i < form.fin13ud.length; i++) {
            if (form.fin13u.currency == "USD") {
                //打开美元输入 人民币关闭 
                form.fin13ud[i].rmbAmountA = form.fin13ud[i].usdAmountA * sopYearlyTax;
                form.fin13ud[i].rmbAmountB = form.fin13ud[i].usdAmountB * sopYearlyTax;
                form.fin13ud[i].rmbAmountC = form.fin13ud[i].usdAmountC * sopYearlyTax;
            } else {
                form.fin13ud[i].usdAmountA = form.fin13ud[i].rmbAmountA / sopYearlyTax;
                form.fin13ud[i].usdAmountB = form.fin13ud[i].rmbAmountB / sopYearlyTax;
                form.fin13ud[i].usdAmountC = form.fin13ud[i].rmbAmountC / sopYearlyTax;
            }

            form.fin13ud[i].rmbAmountSum = _$.getInt(form.fin13ud[i].rmbAmountA, form.fin13ud[i].rmbAmountB, form.fin13ud[i].rmbAmountC);
            form.fin13ud[i].usdAmountSum = _$.getInt(form.fin13ud[i].usdAmountA, form.fin13ud[i].usdAmountB, form.fin13ud[i].usdAmountC);
        }
        form.fin13u.rmbAmountA = _$.getSumOfArray(form.fin13ud, 'rmbAmountA');
        form.fin13u.usdAmountA = _$.getSumOfArray(form.fin13ud, 'usdAmountA');
        form.fin13u.rmbAmountB = _$.getSumOfArray(form.fin13ud, 'rmbAmountB');
        form.fin13u.usdAmountB= _$.getSumOfArray(form.fin13ud, 'usdAmountB');
        form.fin13u.rmbAmountC = _$.getSumOfArray(form.fin13ud, 'rmbAmountC');
        form.fin13u.usdAmountC = _$.getSumOfArray(form.fin13ud, 'usdAmountC');
        form.fin13u.rmbAmountSum = _$.getSumOfArray(form.fin13ud, 'rmbAmountSum');
        form.fin13u.usdAmountSum = _$.getSumOfArray(form.fin13ud, 'usdAmountSum'); 
        //C = A + B;  对象C= _$.getInt(对象A,对象B);  行内加和 
        //C = A + A;  对象C= _$.getSumOfArray(对象A的来源,对象A的属性名);  列内加和  
    }
    //控制项目编号为可选或填写 
    form.funcAppType = function (data) {
        form.fin13u.projectNo = null; 
        if (form.fin13u.appType == "1") {//01ecfe70-1ffc-44e5-8667-6fc8c6483c7f
            form.intapptype = 1;
        }
        else if (form.fin13u.appType == '2') {//63b7af54-2177-4959-b384-a188260a397c
            form.intapptype = 2;
        }
        else if (form.fin13u.appType == '3') {//54001b52-6ade-4597-9f16-24ca5b0e4e1d
            form.intapptype = 3;
        }
    }
    //提交验证
    form.$event_submit_before = function (context) {
        var datasub = program('ChangeProjectStatus', {projectNo: form.fin13u.projectNo });
        return context.$continue();
    }
    //控制项目编号绑定 
    form.funcBindProjectInfo = function (data) { 
        if (form.fin13u.projectNo != null) {
            data = program('GetUseProjectInfo', { flag: 'FIN13', projectNo: form.fin13u.projectNo }); //返回的值是object对象 不需要再做joson转换
            //alert(JSON.stringify(data)) 
        } 
        if (!!data&&data.length > 0) {
            form.fin13u.projectName = data[0].projectName;
            form.fin13u.lumpSumAmount = data[0].lumpSumAmount;
            form.fin13u.lumpSumSchedule = data[0].lumpSumSchedule;
            form.fin13u.currency = data[0].currency;
            form.fin13u.sopYearlyTax = data[0].sopYearlyTax; 
            for (var i = 0; i < form.fin13ud.length; i++) {
                var diffy = form.fin13u.startYear - data[0].startYear;

                if (diffy == 0) {
                    form.fin13ud[i].rmbAmountA = data[i].rmbAmountA1;
                    form.fin13ud[i].rmbAmountB = data[i].rmbAmountB1;
                    form.fin13ud[i].rmbAmountC = data[i].rmbAmountC1;
                    form.fin13ud[i].usdAmountA = data[i].usdAmountA1;
                    form.fin13ud[i].usdAmountB = data[i].usdAmountB1;
                    form.fin13ud[i].usdAmountC = data[i].usdAmountC1;
                }
                if (diffy == 1) {
                    form.fin13ud[i].rmbAmountA = data[i].rmbAmountB1;
                    form.fin13ud[i].rmbAmountB = data[i].rmbAmountC1;  
                    form.fin13ud[i].usdAmountA = data[i].usdAmountB1;
                    form.fin13ud[i].usdAmountB = data[i].usdAmountC1;
                }
                if (diffy == 2) {
                    form.fin13ud[i].rmbAmountA = data[i].rmbAmountC1; 
                    form.fin13ud[i].usdAmountA = data[i].usdAmountC1; 
                }
            }
        } else {
            form.fin13u.projectName = null;
            form.fin13u.lumpSumAmount = null;
            form.fin13u.lumpSumSchedule = null;
            form.fin13u.currency = null;
            form.fin13u.sopYearlyTax = null;
            for (var i = 0; i < form.fin13ud.length; i++) {
                form.fin13ud[i].rmbAmountA = null;
                form.fin13ud[i].rmbAmountB = null;
                form.fin13ud[i].rmbAmountC = null;
                form.fin13ud[i].usdAmountA = null;
                form.fin13ud[i].usdAmountB = null;
                form.fin13ud[i].usdAmountC = null;
            }
        }
        form.sum(); 
    }

    //币种变更 
    form.changcurrency = function (data) {
        if (form.fin13u.currency == "CNY") {  //人民币永远是1
            form.fin13u.sopYearlyTax = "1.00";
        }
        form.sum();//计算金额  
    }
}