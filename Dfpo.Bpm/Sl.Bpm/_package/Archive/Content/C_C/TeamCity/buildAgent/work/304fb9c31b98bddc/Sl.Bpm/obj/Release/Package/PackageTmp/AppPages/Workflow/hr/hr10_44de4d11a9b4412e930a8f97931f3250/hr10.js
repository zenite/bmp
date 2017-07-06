
function controller(base, form, program) {
    debugger;
    //选择中文公司名称带出英文公司名称
    form.chooseCompanyName = function (item) {
        debugger;
        base;
        if (!!item && item[0] != null) {
            var row = item[0];
            form.yfvich09ca.companyNameEn = row.engCompanyName;
        }
    }
    //选择中文公司地址带出英文公司地址
    form.chooseCompanyAddress = function (item) {
        debugger;
        if (!!item && item[0] != null) {
            var row = item[0];
            form.yfvich09ca.companyAddressEn = row.engAddress;
        }
    }

    form.$page_load = function () {
        if (base.pageState == 3 && form.$nodeCode == 'ND01') {
            debugger;
            program("GetHr10CanRecall", { taskId: base.taskId }, function (data) {
                if (data.length > 0) {
                    base.procId = data[0].id;
                    base.addButton("event_RecedeToProposer", "发起人撤回", '1017adb3-e194-4ed8-8282-353eb0346994', "发起人主动撤回");
                }
            });
        }
        debugger;
        if (base.areaCode == 'YFVSX')
        {
            form.yfvich09ca.companyNameCn = "YFVSX";
            form.yfvich09ca.companyNameEn = " Yanfeng Visteon Betung  Automotive Instrumentation";
            form.yfvich09ca.companyAddressCn = "YFVSX";
            form.yfvich09ca.companyAddressEn = "56 Shuguang Road, Keqiao Economic Development Zone, Shaoxing, Zhejiang, China";
            form.yfvich09ca.faxCn = "8a22b482-d0d2-41c7-841e-30ed416086a7";
            form.yfvich09ca.faxEn = "8a22b482-d0d2-41c7-841e-30ed416086a7";
        }else
            if (base.areaCode == 'SHTC')
            {
                form.yfvich09ca.companyNameCn = "SHTC";
                form.yfvich09ca.companyNameEn = " Yanfeng Visteon Electronics Technology (Shanghai)";
                form.yfvich09ca.companyAddressCn = "SHTC";
                form.yfvich09ca.companyAddressEn = "1001 North Qinzhou Road, Shanghai, China";
                form.yfvich09ca.faxCn = "E99A82C7-2027-46D6-A1D4-4969A213DEDF";
                form.yfvich09ca.faxEn = "E99A82C7-2027-46D6-A1D4-4969A213DEDF";
            }
    }

}