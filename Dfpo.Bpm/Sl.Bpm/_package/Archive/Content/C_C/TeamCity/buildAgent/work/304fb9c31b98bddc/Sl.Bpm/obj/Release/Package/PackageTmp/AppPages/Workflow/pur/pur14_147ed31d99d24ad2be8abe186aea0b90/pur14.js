
function controller(base, form, program) {
    debugger;
    form.$page_load = function () {
     
        if (base.pageState === 1) {
            form.type = "";
            if (base.areaCode === "YFVIC" || base.areaCode === "YFVSJ" || base.areaCode === "SHTC" || base.areaCode === "NJTC" || base.areaCode === "YFVAY") {
                form.type = "1";
            }
            if (base.areaCode === "YFVSX" || base.areaCode === "YFVXZ" || base.areaCode === "YFVCC" || base.areaCode === "YFVCQ") {
                form.type = "2";
            }
        }
        if (base.pageState === 2 || base.pageState === 3) {
            for (var i = 0; i < form.pur14detail.length; i++) {
                var item = form.pur14detail[i];
                if (item.updateItem === "a4e061cc-980a-4f84-a148-f10c455c4613") {
                    item.dataitem = "PurchaseRelated>NewSupplier>SupplierLocation";
                }
                //Ship Via 运输代理 
                if (item.updateItem === "5af41a28-9040-499f-8c63-4e31cb72ad87") {
                    item.dataitem = "PurchaseRelated>NewSupplier>SupplierShipVia";
                }
                //Country 国家 
                if (item.updateItem === "0b1f15d2-522a-45c7-a918-6f79ee06bdce") {
                    item.dataitem = "PurchaseRelated>NewSupplier>Country";
                }
                //Taxable 是否含税
                if (item.updateItem === "5decb022-1ee0-48cb-a133-75c89a54f346") {
                    item.dataitem = "Common>YesOrNo";
                }
                //Cr Terms 付款条件
                if (item.updateItem === "7b626a99-e03f-4178-a185-bbac18d4a85f") {
                    item.dataitem = "PurchaseRelated>NewSupplier>SupplierCrTerms";
                    item.orignalInfo = form.pur14.crTerms;
                }
            }
        }

    }
    form.changeUpdateItem = function (row, item) {
        debugger;
        var n = 0;
        for (var i = 0; i < form.pur14detail.length; i++) {
            if (!!form.pur14detail[i].updateItem) {
                if (form.pur14detail[i].updateItem === item.updateItem) {
                    n++;
                }
            }
        }
        if (n > 1) {
            item.orignalInfo = "";
            item.updateItem = "";
            form.$alert("更改项已存在");
            return false;
        }
        //更改下拉框选项 带出之前信息
        var text;
        if (row[0] != null) {
            text = row[0].text;
            var value = row[0].value; 
            //item.orignalInfo = value;
        }
        if (item.updateItem === "1cd9456c-9f43-4155-b014-b00c917580b1") {
            form.isupload = "8";
        } else {
            form.isupload = "0";
        }
        //更改后信息对应下拉
        //当所属公司为HQ/NJ/FD/AP的供应商时，更改项为“供应商名称(工商注册)”
        //审批结束后将同时更新供应商的“供应商名称(工商注册)”及“QAD供应商名称”（QAD名称优化成繁体化简体）信息。
        if (form.requiredType === "3") {
            item.requiredType = "1";
        }
        form.istext = ["1cd9456c-9f43-4155-b014-b00c917580b1",
            "c48f7778-af23-4df2-886a-3e778c8d7843", "6c312a60-963d-40f0-8661-be5e0c442ca8",
            "564d3523-4251-45d7-817a-eacb42a5b943",
            "4f97f3b7-5fb6-463c-8642-0366e475e7bb",
            "1a8f1405-20d6-4282-9128-9b626931777a",
            "d10729d0-7465-48e5-9b8a-1b078ea00c9d",
        "f8996071-d126-43b1-8af1-de0907aaeb18",
        "8e83c87c-917c-49fb-ae6d-75e194d3e822",
        "b3ea313f-ad70-47d8-a4af-e89a4100e901",
        "764b49a6-d064-418c-987a-af6596a24e66",
        "f1ef7393-ac8d-48d8-911e-e2608b424a1f",
        "afe23dea-da10-4e75-b283-815af4fa6023",
        "daf4b1db-e4fc-4e44-9103-3f8f23c22048",
        "06115640-b9b9-4d3e-ac3a-9ffdce25b647",
        "580e7cf0-3ced-45ff-bada-da58e1ebd998",
        "81b986ab-6100-4e53-987e-32ba36f287d3",
        "ca72ac1d-caac-44c1-8f34-2dde249c907c", "96ed1526-7e2a-4f90-9958-a6abadb65079", "b12c43a0-530a-4c3b-b692-be3ef973e87b"];
        form.select = [
            "a4e061cc-980a-4f84-a148-f10c455c4613",
            "5af41a28-9040-499f-8c63-4e31cb72ad87",
            "0b1f15d2-522a-45c7-a918-6f79ee06bdce",
            "5decb022-1ee0-48cb-a133-75c89a54f346", "7b626a99-e03f-4178-a185-bbac18d4a85f"
        ];
        //是否是文本还是下拉
        if (form.isUpdateItem(form.istext, item.updateItem)) {
            item.isSelectOrText = "0";
        }
        item.updateInfo = "";
        item.updateReason = "";
        item.dataitem = "";
        if (form.isUpdateItem(form.select, item.updateItem)) {
            item.isSelectOrText = "1";
            //Global/Local 国内/国外 
            if (item.updateItem === "a4e061cc-980a-4f84-a148-f10c455c4613") {
                item.dataitem = "PurchaseRelated>NewSupplier>SupplierLocation";
            }
            //Ship Via 运输代理 
            if (item.updateItem === "5af41a28-9040-499f-8c63-4e31cb72ad87") {
                item.dataitem = "PurchaseRelated>NewSupplier>SupplierShipVia";
            }
            //Country 国家 
            if (item.updateItem === "0b1f15d2-522a-45c7-a918-6f79ee06bdce") {
                item.dataitem = "PurchaseRelated>NewSupplier>Country";
            }
            //Taxable 是否含税
            if (item.updateItem === "5decb022-1ee0-48cb-a133-75c89a54f346") {
                item.dataitem = "Common>YesOrNo";
            }
            //Cr Terms 付款条件
            if (item.updateItem === "7b626a99-e03f-4178-a185-bbac18d4a85f") {
                item.dataitem = "PurchaseRelated>NewSupplier>SupplierCrTerms";
                item.orignalInfo = form.pur14.crTerms;
            }
            item.updateInfos = item.dataitem;
        }
        form.ItemBind(item);
    }

    form.ItemBind = function (item) {
        switch (item.updateItem) {
            //Supplier Name 供应商名称(工商注册)  
            case '1cd9456c-9f43-4155-b014-b00c917580b1':
                item.orignalInfo = form.pur14.supplierName;
                break;
                //Supplier Address 供应商地址(工商注册)
            case 'c48f7778-af23-4df2-886a-3e778c8d7843':
                item.orignalInfo = form.supplierAddress;
                break;
                //Supplier Name 供应商名称(工商注册)  
            case 'b12c43a0-530a-4c3b-b692-be3ef973e87b':
                item.orignalInfo = form.pur14.supplierName;
                break;
                //Supplier Address 供应商地址(工商注册)
            case '96ed1526-7e2a-4f90-9958-a6abadb65079':
                item.orignalInfo = form.supplierAddress;
                break;
                //Global/Local 国内/国外 
            case 'a4e061cc-980a-4f84-a148-f10c455c4613':
                item.orignalInfo = form.pur14.global_Local;
                break;
                //    Ship Via 运输代理 
            case '5af41a28-9040-499f-8c63-4e31cb72ad87':
                item.orignalInfo = form.pur14.shipAgent;
                break;
                //Country 国家 
            case '0b1f15d2-522a-45c7-a918-6f79ee06bdce':
                item.orignalInfo = form.pur14.country;
                break;
                //State 行政省区
            case '6c312a60-963d-40f0-8661-be5e0c442ca8':
                item.orignalInfo = form.pur14.state;
                break;
                //  Taxable 是否含税
            case '5decb022-1ee0-48cb-a133-75c89a54f346':
                item.orignalInfo = form.pur14.taxable;
                break;
                //City 城市
            case '54287931-407c-4027-aa8a-0c45ebd5a3e8':
                item.orignalInfo = form.pur14.city;
                break;
                //Post 邮政编码
            case '564d3523-4251-45d7-817a-eacb42a5b943':
                item.orignalInfo = form.pur14.post;
                break;
                //Cr Terms 付款条件 
            case '7b626a99-e03f-4178-a185-bbac18d4a85f':
                item.orignalInfo = form.pur14.crTerms;
                break;
                //Attention 联系人
            case '4f97f3b7-5fb6-463c-8642-0366e475e7bb':
                item.orignalInfo = form.pur14.attention;
                break;
                //Telephone 电话
            case '1a8f1405-20d6-4282-9128-9b626931777a':
                item.orignalInfo = form.pur14.telephone;
                break;
                //Fax 传真
            case 'd10729d0-7465-48e5-9b8a-1b078ea00c9d':
                item.orignalInfo = form.pur14.fax;
                break;
                //Payee 收款人
            case 'f8996071-d126-43b1-8af1-de0907aaeb18':
                item.orignalInfo = form.pur14.payee;
                break;
                //Bank Branch 开户银行
            case '8e83c87c-917c-49fb-ae6d-75e194d3e822':
                item.orignalInfo = form.pur14.bankBranch;
                break;
                //Bank Address 银行地址
            case 'b3ea313f-ad70-47d8-a4af-e89a4100e901':
                item.orignalInfo = form.pur14.bankAddress;
                break;
                //Account NO. 银行账号
            case '764b49a6-d064-418c-987a-af6596a24e66':
                item.orignalInfo = form.pur14.accountNO;
                break;
                //Payee 收款人F
            case 'f1ef7393-ac8d-48d8-911e-e2608b424a1f':
                item.orignalInfo = form.pur14.foreignCurrencyPayee;
                break;
                //Bank Branch 开户银行F
            case 'afe23dea-da10-4e75-b283-815af4fa6023':
                item.orignalInfo = form.pur14.foreignCurrencyBankBranch;
                break;
                //Bank Address 银行地址F
            case 'daf4b1db-e4fc-4e44-9103-3f8f23c22048':
                item.orignalInfo = form.pur14.foreignCurrencyBankAddress;
                break;
                //Account NO. 银行账号F
            case '06115640-b9b9-4d3e-ac3a-9ffdce25b647':
                item.orignalInfo = form.pur14.foreignCurrencyAccountNO;
                break;
                //Swift Code
            case '580e7cf0-3ced-45ff-bada-da58e1ebd998':
                item.orignalInfo = form.pur14.swiftCode;
                break;
                //ABA Code
            case '81b986ab-6100-4e53-987e-32ba36f287d3':
                item.orignalInfo = form.pur14.abaCode;
                break;
                //IBAN Code 
            case 'ca72ac1d-caac-44c1-8f34-2dde249c907c':
                item.orignalInfo = form.pur14.ibanCode;
                break;
        }

    }

    form.isUpdateItem = function (item, from) {
        var issutate = false;
        for (var i = 0; i < item.length; i++) {
            if (item[i] === from) {
                issutate = true;
                break;
            }
        }
        return issutate;
    }

    //自动带出信息
    form.LoadData = function (row) {
        debugger;

        if (row[0] != null) {
            //所属单位
            form.pur14.originalby = row[0].usedInCompany;
            //申请单流水号（1/2）
            form.pur14.reqNo1 = row[0].newSupplierSnNumber;
            //申请单流水号（2/2）
            form.pur14.reqNo2 = row[0].supplierAdditionSnNumber;
            //供应商编码
            form.pur14.supplierCode = row[0].supplierCode;
            //QAD供应商编码
            form.pur14.qadSupplierCode = row[0].qadSupplicerCode;
            //供应商名称（工商注册）
            form.pur14.supplierName = row[0].text;
            form.supplierAddress = row[0].registeredAddressPost;
           
            //所属物料大类
            form.pur14.class = row[0].class; 
            //所属产品
            form.pur14.commodity = row[0].commodity; 
            //申请类型
            form.pur14.applicationType = row[0].applicationType; 
            //制造地/发货地/商品/服务
            form.pur14.manufacture_Shipping_Commodity_Service = row[0].manufactureSide1;
            //一次性/非一次性采购
            form.pur14.onetime_Multitime = row[0].oneOrMultiTime1;
            //币种
            form.pur14.currency = row[0].currency;
            //QAD中供应商代码
            form.pur14.qadSupplierCode = row[0].qadSupplicerCode;
            //QAD中供应商名称
            form.pur14.qadSupplierName = program('Common.StringConvert', { v: row[0].qadSupplicerName, type: 2 });
            //供应商地址
            form.pur14.supplierAddress = row[0].registeredAddressPost; 
            //国内/国外
            form.pur14.global_Local = row[0].gl;
            //是否GSDB供应商
            form.pur14.supplierofVisteon = row[0].gsdbSupplier;
            //运输代理
            form.pur14.shipAgent = row[0].shipVia;
            //国家
            form.pur14.country = row[0].country;
            //行政省区
            form.pur14.state = row[0].state;
            //是否含税
            form.pur14.taxable = row[0].yntaxable;
            //城市
            form.pur14.city = row[0].city;
            //邮政编码
            form.pur14.post = row[0].post;
            //付款条件
            form.pur14.crTerms = row[0].crTerms;
            //联系人
            form.pur14.attention = row[0].attention;
            //电话
            form.pur14.telephone = row[0].telephone;
            //采购账号
            form.pur14.purchaseAcct = row[0].purchaseAcct;
            //传真
            form.pur14.fax = row[0].fax;
            //应付账号
            form.pur14.apAcct = row[0].apAcct;
            //银行代码
            form.pur14.bankCode = row[0].bankCode;

            //人民币银行信息
            //收款人
            form.pur14.payee = row[0].payeeRmb;
            //开户银行
            form.pur14.bankBranch = row[0].bankBranchRmb;
            //银行地址
            form.pur14.bankAddress = row[0].bankAddressRmb;
            //银行账号
            form.pur14.accountNO = row[0].accountNoRmb;

            //外币银行信息
            //外币收款人
            form.pur14.foreignCurrencyPayee = row[0].payeeForeign;
            //外币开户银行
            form.pur14.foreignCurrencyBankBranch = row[0].bankBranchForeign;
            //外币银行地址
            form.pur14.foreignCurrencyBankAddress = row[0].bankAddressForeign;
            //外币银行账号
            form.pur14.foreignCurrencyAccountNO = row[0].accountNoForeign;
            //Swift Code
            form.pur14.swiftCode = row[0].swiftCode;
            //ABA Code
            form.pur14.abaCode = row[0].abacode;
            //IBAN Code
            form.pur14.ibanCode = row[0].ibancode;
            //申请原因
            form.pur14.reason = row[0].description; ///////
            //备注说明
            form.pur14.remarks1 = row[0].remarks;
            if (form.pur14detail.length > 0) {
                for (var i = 0; i < form.pur14detail.length; i++) {
                    form.ItemBind(form.pur14detail[i]);
                }
            }
            //form.isrequired    
            form.requiredType = "0";

            if (form.pur14.originalby === 'YFVSX' || form.pur14.originalby === 'YFVXZ' || form.pur14.originalby === 'YFYCC' || form.pur14.originalby === 'YFYCQ') {
                form.requiredType = "1";
                form.updateItem = "PurchaseRelated>SupplierInfoUpdate>UpdateItems";
            }
            if (form.pur14.originalby === 'YFVIC' || form.pur14.originalby === 'NJTC' || form.pur14.originalby === 'YFVSJ' || form.pur14.originalby === 'YFVAY') {
                form.requiredType = "3";
                form.updateItem = "PurchaseRelated>SupplierInfoUpdate>UpdateItem";
            }
        }
    }

    //添加明细
    form.add = function () {
        form.data = "";
        form.pur14detail.push({ isCrTerms: '0' });
        //设置默认当前日期
        if (!!form.pur14detail && form.pur14detail.length > 0)
            form.pur14detail[form.pur14detail.length - 1].updateDate = moment(new Date()).format("YYYY-MM-DD");
        return;
    }
    //删除明细
    form.delete = function () {
   
        var evens = _.remove(form.pur14detail, function (n) {
            return n.checked;
        });
        if (form.pur14detail.length === 0) {
            form.isupload = "7";
        }
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }



    form.$doValidation = function() {
        if (form.pur14detail.length === 0) {
            if (!form.pur14.remarks) {
                form.$errors.push({ element: $("[name=remarks]"), msg: "更改明细没有填数据，备注是必填的" });
                return false;
            }
        }
    }
    //提交表单前的判断
    form.$event_submit_before = function (context) {
   
        debugger;
        var IsUpdateSupplier = '0';
        var IsRMB = '0';
        if (form.pur14detail.length > 0) {           
            //for (var i = 0; i < form.pur14detail.length; i++) {
            //    //如果明细中更改项选择是供应商名称，则需要上传营业执照的附件做必填校验
            //    //if (form.pur14detail[i].updateItem == 'e7020ec9-4078-4762-a05b-be4b74e34215' || form.pur14detail[i].updateItem == 'cc104a04-a961-4a81-bb74-d7b267b19f3e' || form.pur14detail[i].updateItem == '62bcd634-e867-42dd-93ad-3d3b560fe6a6') {
            //    //    IsUpdateSupplier = '1';
            //    //    form.pur14.IsUpdateSupplier = "1";
            //    //    if (form.$attachments[0].FileId.length < 1) {
            //    //        form.$alert("请上传营业执照的附件！");
            //    //        return false;
            //    //    }
            //    //}
                
            //    //如果明细中更改项选择的是国家，则城市必须修改
            //    if (form.pur14detail[i].updateItem == '260c9469-0bd0-4212-b38c-5d959bc79d47') {
            //        form.$alert("更改了国家信息,城市信息必须更改！");
            //        return false;
            //    }
            //}
            form.pur14.IsUpdateSupplier = IsUpdateSupplier;
        }
        else {
            form.pur14.IsUpdateSupplier = '0';
        }

        //是否人民币
        var currency = form.pur14.currency;
        if (currency != null) {
            if (currency == 'CNY') {
                form.pur14.IsRmb = '1';
            }
            else {
                form.pur14.IsRmb = '0';
            }
        }
        else {
            form.pur14.IsRmb = '0';
        }
        
        return context.$continue();
    }

    //查看申请单流水号（1/2） （2/2）
    form.checkApplicationForm = function (sn) {
        debugger;
        program('GetTaskInfo', { sn: sn }, function (task) {
            if (!!task[0]) {
                debugger;
                window.open("/SysPages/AppPage?nodeId={0}&pageId={1}&jobId={2}&taskId={3}&procId={4}&draftId={5}&isPrint={6}".fill(
                       task[0].nodeId,
                       task[0].appPageId,
                       '',
                       task[0].taskId,
                       '',
                       '',
                       ''
                   ));
            }
            else {
                form.$alert("该表单信息数据无法通过本系统查看！");
            }
        });
    }
}