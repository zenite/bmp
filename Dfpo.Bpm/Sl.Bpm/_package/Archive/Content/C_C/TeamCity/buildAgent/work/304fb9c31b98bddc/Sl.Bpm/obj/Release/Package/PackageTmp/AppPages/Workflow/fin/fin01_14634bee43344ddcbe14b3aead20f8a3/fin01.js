
function controller(base, form, program) {
    debugger;
    form.getPOInfos = function (row) {
        debugger;
        form.fin01.chiefEngineer = base.applicant.departmentName;
        var data = row[0];
        if (row[0] != null) {
            form.fin01.supplierInformation = data.vendorName;
            form.fin01.buyer = data.chName;
            form.fin01.projectNo = data.projectCode;
            debugger;
            program('GetOrderDetailsByNbr', { PONbr: data.id, POTaskID: data.taskid }, function (PODetails) {
                if (!!PODetails[0] && form.fin01details.length == 0) {
                    for (var i = 0; i < PODetails.length; i++) {
                        debugger;
                        form.fin01details.push({
                            equipmentName: PODetails[i].description,
                            orderQty: PODetails[i].estimatedQuantity,
                            restQty: PODetails[i].restQty,
                            poDetailID: PODetails[i].poDetailID
                        });
                    }
                }
            });
        }
    }

    form.CheckQty = function (item) {
        debugger;
        if (item.qty != "") {
            if (item.restQty < item.qty) {
                alert("验收数量不能大于剩余数量");
                item.qty = "";
            }
        }
    }
}