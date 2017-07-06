
function controller(base, form, program) {

    debugger;
    form.typeClassItem = []; //类型大类
    form.typeSmallClassItem = []; //类型小类
    form.isActiontype = false;

    function selectType() {
        var selectRequestType = ['D7820B3A-FE0C-496C-AD07-E08EC78DA25E', '60F95FA0-A1F7-421A-8696-07C9F52008A4', '04D8C332-C022-4B18-89B4-FE9606186C51'];
        var typeClassItem = [
            [
                { id: "5755FF64-51F7-4575-9F09-139EFDF05AE4", text: "账号与权限" },
                { id: "2142DD23-19E5-4AED-B7BC-4CD67D4D27B6", text: "访问权限" },
                { id: "93745AD1-2C16-4030-872B-672129AFF816", text: "语音" }
            ], [
                { id: "F61798AC-065F-432A-92E5-563F4098B935", text: "电脑" },
                { id: "762D7DEA-EF2D-4E05-AE40-038DCD111F94", text: "IT设备" },
                { id: "003BE2EA-50F1-4646-9B61-051F3B716AEE", text: "cims" },
                { id: "B81A1BC1-FE2F-4A52-8388-D14A8F55223F", text: "4G卡" },
                { id: "C636D60A-0C32-47F9-8B9A-423362587553", text: "小配件" }
            ], [
                { id: "9B414242-CAED-4164-BCAB-87A578D59092", text: "许可证" },
                { id: "EAE0EFE3-B34C-436B-8C05-82BFF3FE33CC", text: "非标软件" }
            ]
        ];
       
        var requerType = form.it03.requerType;
        for (var i = 0; i < selectRequestType.length; i++) {
            if (requerType === selectRequestType[i]) {
                form.typeClassItem = typeClassItem[i];
                return;
            }
        }
        form.typeClassItem = [];
    }

    form.$page_load = function () {
        form.aa = true;
        if (!base.taskId) {
            //初始化直接领导电话
            var cellPhone = program('GetContactDirectManager', { jobId: base.applicant.directManagerJobId });
            form.it03.oaOrgPath = base.applicant.groupId;
        }
        //初始化直接领导电话
        var cellPhone = program('GetContactDirectManager', { jobId: base.applicant.directManagerJobId });
        form.it03.contactDirectManager = cellPhone;
        form.typeSmallClass = [
    {
        id: "5755FF64-51F7-4575-9F09-139EFDF05AE4",
        value: [{ id: "AFF9CEF3-A9FE-43B9-9B08-D23A4F4AEC56", text: "基础ID资源" },
                    { id: "F190109C-71D3-4E26-8EA5-5EE881E53FBB", text: "应用系统账号与权限" },
                    { id: "71A595C2-8926-4B9E-A922-0D016A8E3A44", text: "EIT账号" },
                    { id: "AF52A042-D998-4981-88D9-AA33E0102940", text: "IT账号" }]
    }, {
        id: "2142DD23-19E5-4AED-B7BC-4CD67D4D27B6",
        value: [{ id: "34C9F00D-3CEC-4F05-B088-C8F58FA4AEB8", text: "共享目录" },
                    { id: "E1195110-5075-4F66-94F1-523F4706ECE3", text: "计算机管理员，USB权限" },
                    { id: "13AF46EA-21DC-42C4-8323-DAA0FBD5BC88", text: "彩色打印" },
                    { id: "5C989DCC-F9CB-4756-805F-41381B80D367", text: "数据加密" }]
    }, {
        id: "93745AD1-2C16-4030-872B-672129AFF816",
        value: [{ id: "666331A8-6EDD-455F-8035-750AEB988A66", text: "国际长途/国内长途/Gnet 多选" }]
    }, {
        id: "F61798AC-065F-432A-92E5-563F4098B935",
        value: [{ id: "021E100F-C3C1-4F99-AEC0-A29435C929F0", text: "台式机笔记本工作站" }]
    }, {
        id: "762D7DEA-EF2D-4E05-AE40-038DCD111F94",
        value: [{ id: "EC39BDC0-211F-4A90-B9D2-D1EA2A98C186", text: "网络设备/服务器  单选" }]
    }
        ];
        if (!!form.it03.requerType) {
            selectType();
            form.typeClassfunc();
            form.isIfFunc();
        }

    }
    //form.$watch('base.applicant.jobId', function (newV, oldV) {
    //    if (!!newV) {
    //        form.$state.IsTec = program('GetIsTechnologyCenter', { applicantJobId: base.applicant.jobId });
    //    }
    //});

    form.outlookfuc = function () {
        if (form.it03.cdsid === "1") {
            form.it03.outLook = form.it03.cdsid;
        }
        //form.it03.outLook = form.it03.cdsid==="1"?"1":"";

    }
    form.delete_choose= function() {
        if (form.it03.phoneNumber === "1") {
            form.it03.cor = null;
        }
    }
    //form.selectjob = function (selectItem) {
    //    debugger;
    //    if (selectItem.length > 0) {
    //        program("GetUserInfo",
    //            { jobid: (selectItem[0].id || ""),language:base.language },
    //            function (data) {
    //                form.it03.oaworkNo = data[0].employeeNumber;
    //                form.it03.oaName = data[0].userName;
    //            });
    //    }
    //}

    form.add = function () {
        form.it03pt.push({});
    }
    form.delete = function () {
        var evens = _.remove(form.it03pt, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        };
    }
    //选中项目带出Code
    form.getProjectCode = function (data) {
        if (data.length>0) {
            form.it03.projectCode = data[0].projectNo;
            form.it03.programManager = data[0].projectManager;
            form.it03.budgetItemsSelection = data[0].item_desc;
        }
      
    }

//是否是项目切换
    form.emptyProject = function () {
        if (base.pageSate !== 2 && base.pageSate !== 3) {
            if (form.it03.isSelectProjectNumber !== 'D17A7445-9082-4A80-80E4-F47B4D19049E') {
                form.isProject = true;
            }
            if (form.it03.isSelectProjectNumber === 'D17A7445-9082-4A80-80E4-F47B4D19049E') {
                form.isProject = false;
            }
        }
    }

    ///请选择申请类型带出类型大类
    form.selectrequerType = function () {
        selectType();
    }


    //小类控制页面权限
    form.isIfFunc = function () {
        var tsc = form.it03.typeSmallClass;
        form.isActiontypeY = false;          ///Add/Update/Delete  显示状态
        form.actiontypeItem = [];
        var actiontype = [[{ id: "43F9E127-567D-41B6-8CDE-9A90156A3791", text: "Add" },
            { id: "95EA2C66-BFE4-4A24-8337-08488296090B", text: "Change" },
            { id: "D3919177-C413-48D0-9899-0EA7568F29C9", text: "Delete User ID" }
        ], [{ id: "43F9E127-567D-41B6-8CDE-9A90156A3791", text: "Add" }, { id: "D3919177-C413-48D0-9899-0EA7568F29C9", text: "Delete User ID" }]];
        ///显示Add/Update/Delete
        var zq = form.typeSmallClass[0].value.length + 1;
     
        if (!!tsc) {
            for (var i = 0; i < zq; i++) {
                if ((zq-1) == i) {
                    form.isActiontypeY = tsc === form.typeSmallClass[1].value[0].id ? true : false;
                } else {
                    form.isActiontypeY = tsc === form.typeSmallClass[0].value[i].id ? true : false;
                    if (form.isActiontypeY) {
                        break;
                    }
                }
            }
        }
        if (form.isActiontypeY) {
            form.actiontypeItem = actiontype[0];
            return;
        }
        debugger;
        form.isActiontypeX = false;        ///Add/Update        显示状态
        var fq = form.typeSmallClass[1].value.length ;
        if (!!tsc) {
            ///显示Add/Update
            for (var j = 0; j < form.typeSmallClass[1].value.length; j++) {
                if ((fq-1) == j) {
                    form.isActiontypeX = tsc === form.typeSmallClass[2].value[0].id ? true : false;
                } else {
                    form.isActiontypeX = tsc === form.typeSmallClass[1].value[j+1].id ? true : false;
                    if (form.isActiontypeX) {
                          break; 
                    }
                }
            }
        }
        if (form.isActiontypeX) {
            form.actiontypeItem = actiontype[1];
            return;
        }
    }

  

    ///大类带出类型小类
    form.typeClassfunc = function () {
        
        var tc = form.it03.typeClass;
        debugger;
        if (tc === "003BE2EA-50F1-4646-9B61-051F3B716AEE" || tc === "B81A1BC1-FE2F-4A52-8388-D14A8F55223F" || tc === "C636D60A-0C32-47F9-8B9A-423362587553" || tc === "9B414242-CAED-4164-BCAB-87A578D59092" || tc === "EAE0EFE3-B34C-436B-8C05-82BFF3FE33CC") {
            form.isSelect = false;
        }
        for (var j = 0; j < form.typeSmallClass.length; j++) {
            if (tc === form.typeSmallClass[j].id) {
                form.typeSmallClassItem = form.typeSmallClass[j].value;
                form.isSelect = true;
                return;
            }
        }
        form.typeSmallClassItem = [];
    }
    form.$event_submit_before = function (context) {
        if (form.it03.phoneNumber != "1") {
            form.it03.cor = null;
        }
        if (form.it03.typeSmallClass !== 'AFF9CEF3-A9FE-43B9-9B08-D23A4F4AEC56') {      //小类不等于基础ID资源
            form.it03.cdsid = null;
            form.it03.cdsidtext = null;
            form.it03.outLook = null;
            form.it03.phoneNumber = null;
            form.it03.phoneNumberText = null;
            form.it03.cor = null;
            form.it03.email = null;
            form.it03.emailText = null;
        }
        if (form.it03.typeSmallClass !== 'F190109C-71D3-4E26-8EA5-5EE881E53FBB') {      //小类不等于应用系统账号与权限
            if (form.it03.application !== 'd789b569-fee3-41be-89da-3484e5a4c063') {         //application不等于QAD
                form.it03.userAccessGroup = null;
                form.it03.qadDatabase = null;
            }
            form.it03.jobFunctionChange = null;
            form.it03.application = null;
        }
        if (form.it03.typeSmallClass !== '71A595C2-8926-4B9E-A922-0D016A8E3A44') {      //小类不等于EIT账号
            form.it03.platformOrApplication = null;
        }
        if (form.it03.typeSmallClass !== 'AF52A042-D998-4981-88D9-AA33E0102940') {      //小类不等于IT账号
            form.it03.itAccout = null;
        }
        if (form.it03.typeSmallClass !== '34C9F00D-3CEC-4F05-B088-C8F58FA4AEB8') {      //小类不等于共享目录
            form.it03.sharedDirectoryPath = null;
        }
        if (form.it03.typeSmallClass !== 'E1195110-5075-4F66-94F1-523F4706ECE3') {      //小类不等于计算机管理员，USB权限
            form.it03.adminOrUsb = null;
        }
        if (form.it03.typeSmallClass !== '13AF46EA-21DC-42C4-8323-DAA0FBD5BC88') {      //小类不等于彩色打印
            form.it03.colorPrinterAddress = null;
        }
        if (form.it03.typeSmallClass !== '5C989DCC-F9CB-4756-805F-41381B80D367') {      //小类不等于数据加密
            form.it03.dataencryptionType = null;
        }
        if (form.it03.typeSmallClass !== '666331A8-6EDD-455F-8035-750AEB988A66') {      //小类不等于国际长途/国内长途/Gnet 多选
            form.it03.longDistance = null;
            form.it03.confirmAgreement = null;
            form.it03.confirmAgreementzzs = null;
        }
        if (form.it03.typeSmallClass !== '021E100F-C3C1-4F99-AEC0-A29435C929F0') {      //小类不等于台式机笔记本工作站
                form.it03.useNewMachine = null;
        }
        if (form.it03.typeClass !== 'F61798AC-065F-432A-92E5-563F4098B935' &&               //大类不等于电脑
             form.it03.applicantInfoType !== "1") {                            //为他人申请
            form.it03.applicanPeopletName = null;
            form.it03.theirGroup = null;
            form.it03.jobTitle = null;
        }
        if (form.it03.requerType !== 'D7820B3A-FE0C-496C-AD07-E08EC78DA25E') {       //请选中不等于OA
            form.it03.operationType = null;
            form.it03.oaOrgPath = null;
            form.it03.oaName = null;
            form.it03.oaworkNo = null;
            form.it03.postName = null;
            form.it03.remarkOne = null;
        }
        if (form.it03.typeClass !== 'B81A1BC1-FE2F-4A52-8388-D14A8F55223F') {           //大类不等于4G卡
            form.it03.fourGcardMoney = null;
            form.it03.validationProtocol = null;
            form.it03.costCenter = null;
        }
        if (form.it03.requerType !== '60F95FA0-A1F7-421A-8696-07C9F52008A4') {       //请选中不等于硬件
            form.it03.requestSelection = null;
        }
        if (form.it03.typeClass === '003BE2EA-50F1-4646-9B61-051F3B716AEE' ||              //大类等于cims
                form.it03.typeClass === 'B81A1BC1-FE2F-4A52-8388-D14A8F55223F' ||       //大类等于4G卡
                form.it03.typeClass === 'C636D60A-0C32-47F9-8B9A-423362587553' ||           //大类等于小配件
                form.it03.requerType === '04D8C332-C022-4B18-89B4-FE9606186C51'             //申请类型等于软件
        ) {
            form.typeSmallClassItem = null;
        }
        if (form.it03.requerType === 'D7820B3A-FE0C-496C-AD07-E08EC78DA25E'       //申请类型不等于软件
            ) {      //申请类型等于OA
            form.it03.applicantInfoType = null;
            form.it03.isSelectProjectNumber = null;
            form.it03pt = [];
            form.it03.stateDetail = null;
            form.it03.softwareInstallation = null;
            form.it03.requestEquipmentLocation = null;
            form.it03.purchasing = null;
            form.it03.prno = null;
            form.it03.systemEngineers = null;
        }
        return context.$continue();
    }
}