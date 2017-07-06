
function controller(base, form, program) {
    debugger;
    //控制资产地点文本控制
    form.chooseAsset = function () {
        form.locarionState = form.assetLocation();
        if (!form.locarionStat) {
            form.pur09.assetLocationText = "";
        }
    }
    form.assetLocation = function () {
        var purLocation = form.pur09.assetLocation;
        return purLocation === '0e3a26bf-a22f-4ab8-bc4a-5335c79e8232' || purLocation === 'b89d83fd-0555-4f8a-bfab-d9d2e0a5f15e' || purLocation === '1dc49d9a-58f9-488b-b589-642418a3d8df' ? true : false;
    }
    //控制资产归属文本控制
    form.chooseAssetO = function () {
        form.ownershipState = assetOwnership();
        if (!form.ownershipState) {
            form.pur09.assetOwnershipText = "";
        }
    }
    form.assetOwnership = function () {
        var purOwnership = form.pur09.assetOwnership;
        return purOwnership === '0895a2de-1942-41dd-a39b-132fd14b95aa' || purOwnership === 'e17a2f5d-3e8f-40d5-9e68-6a07d38715b1' || purOwnership === '999986a0-21b3-4f7f-8dfd-a40a01e8b8a3' ? true : false;
    }
    //产品总单价
    form.totalUnitPrice = function () {
        form.pur09.totalUnitPrice = _$.getInt(form.pur09.amortizePrice, form.pur09.unitPrice);
    }
    form.returnZero = function (formkey) {
        return !formkey ? 0 : parseFloat(formkey);
    }
    form.state = (base.pageState === 3 || form.$pageRight.ProjectManager === 'normal') && form.pur09.mmr === 'CD0B3095-E209-4CE1-BC9C-2D9C4A4921AD';
    form.locarionState = form.assetLocation();
    form.ownershipState = form.assetOwnership();

    
    form.$page_load = function () {
        debugger;
        program('GetState', { taskId: base.taskId }, function (state) {

            if (base.pageState === 1 || form.pur09.effectiveDate==="") {
                form.pur09.totalUnitPrice = 0;
                form.pur09.amortizeQty = 0;
                form.pur09.share = 100;
                program("StartDate", { id: 1 }, function (startDate) {
                    form.pur09.effectiveDate = startDate;
                    form.pur09.modelYear = startDate.substring(0, 4);
                    //假数据默认初始化
                    form.pur09.issuedDate = startDate;
                    form.pur09.unit = 'EA';
                    form.pur09.share = 100;
                });
            }
        });
    }
    //提交前验证
    form.$doValidation = function () {

        if (parseInt(form.pur09.totalUnitPrice) === 0) {
            form.$errors.push({ element: $("[name=totalUnitPrice]"), msg: "产品总单价不能等于0！" });
        };
        if (parseInt(form.pur09.mpq < 1)) {
            form.$errors.push({ element: $("[name=mpq]"), msg: "最小包装量必须大于等于1！" });
        }
    }
    form.$watch('base.areaCode', function() {
        form.pur09.areaCode = base.areaCode;
    });



    form.clearBlur = function () {
        form.pur09.amortizeQty = form.pur09.amortizeQty == 0 ? '' : form.pur09.amortizeQty; //当为零的时候清空
    }
    //分摊单价
    form.clearRow = function () {
  
        //var formkey = [form.pur09.tooling, form.pur09.tooling];
        form.pur09.amortizeQty = form.pur09.amortizeQty.length > 0 && form.pur09.amortizeQty.substring(0, 1) === '0' ? form.pur09.amortizeQty.substring(1, form.pur09.amortizeQty.length) : form.pur09.amortizeQty;//当为零的时候清空
        form.pur09.amortizeQty = form.pur09.amortizeQty === '' ? '0' : form.pur09.amortizeQty;
        form.pur09.amortizePrice = form.returnZero(form.pur09.amortizeQty) === 0 ? 0 : form.returnZero(form.pur09.tooling) / form.returnZero(form.pur09.amortizeQty);
        form.totalUnitPrice();
    }
    


}