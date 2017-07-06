
function controller(base, form, program) {
    debugger;
    //页面加载事件
    form.$page_load = function () {
        //设置申请开始时间为默认申请值
        program("StartDate",{id:1},
            function (startDate) {
                form.pur03.requestStartDate = startDate;
            });
        if (base.initiator.areaCode !== 'YFVIC') {
            switch (base.initiator.areaCode) {
                case 'YFVAY':
                    form.pur03.theCompany = "2d422dd3-1ec7-4026-94f4-2f50d973eb2b";
                    break;
                case 'NJTC':
                    form.pur03.theCompany = "38b962de-20bc-40b2-857f-0475f6147860";
                    break;
         
                case 'YFVSJ':
                    form.pur03.theCompany = "48b9c7ba-d540-41bb-ad8b-3dfc9c2c546d";
                    break;
                case 'YFVSX':
                    form.pur03.theCompany = "4eada96d-1dc8-4352-8690-25579ec3f35f";
                    break;
                case 'YFVCQ':
                    form.pur03.theCompany = "5bb9ed0f-8fe5-4a33-a027-195a763b7c77";
                    break;
                case 'YFVXZ':
                    form.pur03.theCompany = "7134eef4-17d2-4ccf-9a56-d0186aa5c78a";
                    break;
                case 'YFVCC':
                    form.pur03.theCompany = "919adba3-1d4e-4bdc-9e21-30dffbe10237";
                    break;
                case 'SHTC':
                    form.pur03.theCompany = "9a6aad63-4968-4ed4-a0f5-7afd0129d976";
                    break;
                case 'YFVSO':
                    form.pur03.theCompany = "b6071aca-188c-46e6-929c-5c7020acae95";
                    break;
            }
        }
    }




    //选择供应商Code带出供应商信息
    form.chooseSupplier = function (item) {
        
        if (!!item && item[0] != null) {
            var row = item[0];
            form.pur03.supplierName = row.registeredSupplierName;
            form.pur03.supplierCodeText = row.text;
 
        }
    }
    //选择项目编号带出项目名信息
    form.getProjectName = function (item) {
        
        if (!!item && item[0] != null) {
            var row = item[0];
            form.pur03.projectName = row.projectDesc;
            form.pur03.projectManager = row.projectManager;
        }
    }
    //选择所属公司赋值变量
    form.isCompanyName = function (itme) {
        
        if (!!itme && itme[0] != null) {
            var isCompanyName = itme[0].value;
            program("IsCompanyName", { isCompanyName: isCompanyName });
        }
       
    }
    //提示信息函数
    var pur03Y = new function () {
        var pur03Yes = " 是必填的";
        this.pur03_push = function (e, m) {
            form.$errors.push({ element: $("[name=" + e + "]"), msg: m + pur03Yes });
            return false;
        }
        this.pur03_push_v = function (v, e, m) {
            if (!v) {
                form.$errors.push({ element: $("[name=" + e + "]"), msg: m + pur03Yes });
                return false;
            }
        }
    }


    //提交前验证
    form.$doValidation = function () {
        var pur03S = form.pur03;
        var fpur = !pur03S;
        var istype = ["99d993bc-edba-49d4-b41a-71943079c831", "8f968c30-a8fe-4ddf-a693-344f7ea7446a"];
        
        //供应商代码和供应商名称两个至少填写一个
        if (fpur || (!pur03S.supplierCode && !pur03S.supplierName))
        {
            pur03Y.pur03_push("supplierCode", "供应商代码和供应商名称两个至少填写一个");
            return false;
        }
        //质量等级，供货等级，新供应商评审等级，财务等级，销售额占比，商务等级和客户指定进行至少一项内容！
        if (fpur || ((!pur03S.qualityLevel ||pur03S.qualityLevel===istype[1])&&
            !(pur03S.deliveryLevel || pur03S.deliveryLevel === istype[1]) &&
            !(pur03S.newSupplierAssessmentLevel || pur03S.newSupplierAssessmentLevel === istype[1]) &&
            !(pur03S.commLevel || pur03S.commLevel === istype[1]) &&
            !(pur03S.financialHealthRatingC || pur03S.financialHealthRatingC === istype[0]) &&
            !(pur03S.totoal || pur03S.totoal === istype[0]) &&
            !(pur03S.isSupplierCustomerDirected || pur03S.isSupplierCustomerDirected === istype[0])))
        {
            pur03Y.pur03_push("qualityLevel", "质量等级，供货等级，新供应商评审等级，财务等级，销售额占比，商务等级和供应商是否是客户指定至少一项内容！");
            return false;
        }
        return true;
    }

    //申请开始日期
    function comDate() {
        if (form.pur03.startDate != null && form.pur03.endDate != null) {
            
            var oDate1 = new Date(form.pur03.startDate);
            var oDate2 = new Date(form.pur03.endDate);
            if (oDate1.getTime() >= oDate2.getTime()) {
                mabp.notify.warn("申请结束时间不能早于申请开始时间");
                return false;
            }
            return true;
        }
        return true;
    }

    form.$watch('form.pur03.startDate', function () {
        
        if (!comDate()) {
            form.pur03.startDate = null;
        }
    });


    //申请结束时间
    form.$watch('form.pur03.endDate', function () {
        if (!comDate()) {
            form.pur03.endDate = null;
        }

    });

    form.$event_submit_before = function (context) {
        if (form.pur03.requestType === '83a31edd-298f-4832-bc53-1d6c17f6511f') {
            form.pur03.requestType = null;
        }
        if (form.pur03.qualityLevel === "99d993bc-edba-49d4-b41a-71943079c831") {
                form.pur03.qualityLevel = null;
            }
        if (form.pur03.deliveryLevel === "99d993bc-edba-49d4-b41a-71943079c831") {
                form.pur03.deliveryLevel = null;
            }
        if (form.pur03.newSupplierAssessmentLevel === "99d993bc-edba-49d4-b41a-71943079c831") {
                form.pur03.newSupplierAssessmentLevel = null;
            }
        if (form.pur03.commLevel === "99d993bc-edba-49d4-b41a-71943079c831") {
                form.pur03.commLevel = null;
            }
        if (form.pur03.financialHealthRatingC === "99d993bc-edba-49d4-b41a-71943079c831") {
                form.pur03.financialHealthRatingC = null;
            }
        if (form.pur03.totoal === "99d993bc-edba-49d4-b41a-71943079c831") {
                form.pur03.totoal = null;
            }
        if (form.pur03.isSupplierCustomerDirected === "99d993bc-edba-49d4-b41a-71943079c831") {
                form.pur03.isSupplierCustomerDirected = null;
            }
        return context.$continue();
    }
}