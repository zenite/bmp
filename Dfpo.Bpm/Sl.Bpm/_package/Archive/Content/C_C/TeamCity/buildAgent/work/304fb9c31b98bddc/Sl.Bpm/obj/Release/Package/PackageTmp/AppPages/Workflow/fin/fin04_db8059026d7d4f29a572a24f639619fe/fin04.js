
function controller(base, form, program) {
    form.chooseTicketCollectorUnitName = function (item) {
        debugger;
        if (!!item && item[0] != null) {
            var row = item[0];
            form.fin04.ticketCollectorUnitTaxRegistrationNumber = row.ticketCollectorUnitTaxRegistrationNumber;
            form.fin04.bankName = row.bankName;
            form.fin04.ticketCollectorUnitBankAccount = row.ticketCollectorUnitBankAccount;
            form.fin04.ticketCollectorName = row.ticketCollectorName;
            form.fin04.ticketCollectorPhoneEmail = row.ticketCollectorPhoneEmail;
            form.fin04.ticketCollectorAddress = row.ticketCollectorAddress;
        }
    }
    form.delete = function () {
        debugger;
        var evens = _.remove(form.fin04s, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        if (form.fin04.isTax == 'D17A7445-9082-4A80-80E4-F47B4D19049E') {
            form.fin04.totalwithTax = _$.getSumOfArray(form.fin04s, 'amount');
            form.fin04.billingAmount = form.fin04.totalwithTax;
        }
        if (form.fin04.isTax == '51B9F2E4-FBE9-400A-A789-A296E30177BF') {
            form.fin04.totalwithoutTax = _$.getSumOfArray(form.fin04s, 'amount');
            form.fin04.billingAmount = form.fin04.totalwithoutTax;
        }
    }
    form.$page_load = function () {
        if (base.pageState == 1)
        {
          form.add();
        }
       
    }
    form.$event_submit_before = function (context) {
        //如果明细数据少于一行则阻止提交
        if (form.fin04s.length == 0) {
            form.$toast("请填写明细表数据")
            return context.$stop();
        }
        if (form.fin04.isShippedNonPlan == 'D17A7445-9082-4A80-80E4-F47B4D19049E')
        {
            if (form.fin04.unplannedRequisitionNumber==null)
            {
                form.$alert("非计划领料单号不允许为空");
                return context.$stop();
            }
        }
        return context.$continue();
    }
    form.add = function (item) {
        debugger;
        form.fin04s.push({});
        if (form.fin04.isTax == 'D17A7445-9082-4A80-80E4-F47B4D19049E') {
            form.fin04.totalwithTax = _$.getSumOfArray(form.fin04s, 'amount');
            form.fin04.billingAmount = form.fin04.totalwithTax;
        }
        if (form.fin04.isTax == '51B9F2E4-FBE9-400A-A789-A296E30177BF') {
            form.fin04.totalwithoutTax = _$.getSumOfArray(form.fin04s, 'amount');
            form.fin04.billingAmount = form.fin04.totalwithoutTax;
        }
    }
    form.sum = function (item) {
        debugger;
        item.amount = parseInt(item.qty || "") * parseInt(item.up || "");
        if (form.fin04.isTax == 'D17A7445-9082-4A80-80E4-F47B4D19049E') {
            form.fin04.totalwithTax = _$.getSumOfArray(form.fin04s, 'amount');
            form.fin04.billingAmount = form.fin04.totalwithTax;
        }
        if (form.fin04.isTax == '51B9F2E4-FBE9-400A-A789-A296E30177BF') {
            form.fin04.totalwithoutTax = _$.getSumOfArray(form.fin04s, 'amount');
            form.fin04.billingAmount = form.fin04.totalwithoutTax;
        }

    }
    //明细数据全选
    form.selectAll = function (ischecked, items) {
        for (var i = 0; i < items.length; i++) items[i].checked = !!form.fin04sAllChecked;
    }
    form.chose = function () {
        if (form.fin04.isTax == 'D17A7445-9082-4A80-80E4-F47B4D19049E') {
            form.fin04.totalwithoutTax = null;
            if (form.fin04.domesticOrExport == '42025C10-3BBF-4942-A7CC-65E36CB7224D')
            {
                form.fin04.tax = "是";
            }
          
            form.fin04.totalwithTax = _$.getSumOfArray(form.fin04s, 'amount');
            form.fin04.billingAmount = form.fin04.totalwithTax;
        }
        if (form.fin04.isTax == '51B9F2E4-FBE9-400A-A789-A296E30177BF') {
            form.fin04.totalwithTax = null;
            if (form.fin04.domesticOrExport == '42025C10-3BBF-4942-A7CC-65E36CB7224D') {
                form.fin04.tax = "否";
            }
            form.fin04.totalwithoutTax = _$.getSumOfArray(form.fin04s, 'amount');
            form.fin04.billingAmount = form.fin04.totalwithoutTax;
        }


    }
    form.clearData = function () {
        debugger;
        if (form.fin04.domesticOrExport != '42025C10-3BBF-4942-A7CC-65E36CB7224D') {
            form.fin04.contractNo = null;
            form.fin04.invoiceType2 = null;
            form.fin04.ticketCollectorUnitName = null;
            form.fin04.ticketCollectorUnitTaxRegistrationNumber = null;
            form.fin04.bankName = null;
            form.fin04.ticketCollectorUnitBankAccount = null;
            form.fin04.ticketCollectorName = null;
            form.fin04.ticketCollectorPhoneEmail = null;
            form.fin04.ticketCollectorAddress = null;
            form.fin04.billingContent = null;
            form.fin04.billingAmount = null;
            form.fin04.isTax = null;
            form.fin04.expectedCollection = null;
            form.fin04.remark = null;
            form.fin04.tax = null;
        }
        if (form.fin04.domesticOrExport != 'C45EE635-7EF6-4EB4-BDF1-C787CD481037') {
            form.fin04.shippedAddress = null;
            form.fin04.shippedAttention = null;
            form.fin04.shippedTel = null;
            form.fin04.shippedEmail = null;
            form.fin04.billedAddress = null;
            form.fin04.isTheOriginalSent = null;
            form.fin04.billedAttention = null;
            form.fin04.billedTel = null;
            form.fin04.billedEmail = null;
            form.fin04.tax = null;
        }
    }
    //form.clearunplannedRequisitionNumber = function ()
    //{
    //    debugger;
    //    if (base.areaCode == 'YFVIC' || base.areaCode == 'SHTC')
    //    {
    //        form.fin04.unplannedRequisitionNumber = null;
    //    }
    //}
   
    //form.$watch('base.areaCode', function () {
    //    debugger;
    //    if (base.areaCode == 'YFVIC' || base.areaCode == 'SHTC') {
    //        form.fin04.unplannedRequisitionNumber = null;
    //        form.fin04.isShippedNonPlan = '51B9F2E4-FBE9-400A-A789-A296E30177BF';
    //    } 
    //})
    form.changeareaCode = function ()
    {
        debugger;
        if (base.areaCode == 'YFVIC' || base.areaCode == 'SHTC') {
            form.fin04.unplannedRequisitionNumber = null;
            form.fin04.isShippedNonPlan = '51B9F2E4-FBE9-400A-A789-A296E30177BF';
        } else
        {
            form.fin04.isShippedNonPlan = null;
        }
    }
 }