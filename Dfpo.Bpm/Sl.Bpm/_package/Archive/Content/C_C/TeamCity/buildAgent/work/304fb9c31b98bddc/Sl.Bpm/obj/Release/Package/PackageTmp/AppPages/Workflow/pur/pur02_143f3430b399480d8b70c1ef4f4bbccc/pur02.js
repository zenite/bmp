
function controller(base, form, program) {
    debugger;

    form.$customeButtons = [{
        type: "event_Print", id: "3", name: "打印", func: function () {
            window.print();
        }
    }];


    if (form.$nodeCode == 'ND01' && base.taskId == undefined) {
        form.yfvicchargebackdet.push({});
    }
    form.chooseSupplierCode = function (row) {
        if (row[0] != null) {
            form.pur02.supplierName = row[0].text;
            form.pur02.currency = row[0].currency;
        }
    }
    //Material Detail List add
    form.add = function () {
        form.yfvicmaterialdet.push({});
    }
    form.delete = function () {
        var evens = _.remove(form.yfvicmaterialdet, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        var total = 0.00;
        form.pur02.materialDetCostTotal = total;
        angular.forEach(form.yfvicmaterialdet, function (data, index, array) {
            if (data.totalPrice != undefined) {
                total += parseFloat(data.totalPrice);
                form.pur02.materialDetCostTotal = total;
            }
        });

        angular.forEach(form.yfvicchargebackdet, function (data, index, array) {
            if (data.totalCost != undefined) {
                form.pur02.totalPrice = parseFloat(form.pur02.materialDetCostTotal) + parseFloat(data.totalCost);
            }
        });
    }
    form.deleteChargeBackDet = function () {
        var evens = _.remove(form.yfvicchargebackdet, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }
    form.Calc = function (items) {
        if (items.qtyRej != undefined && items.unitPrice != undefined) {
            items.totalPrice = items.qtyRej * items.unitPrice;
        }
        var total = 0.00;
        form.pur02.materialDetCostTotal = total;
        angular.forEach(form.yfvicmaterialdet, function (data, index, array) {
            if (data.totalPrice != undefined) {
                total += parseFloat(data.totalPrice);
                form.pur02.materialDetCostTotal = parseFloat(total);
                form.pur02.totalPrice = parseFloat(total);
            }
        });

        angular.forEach(form.yfvicchargebackdet, function (data, index, array) {
            if (data.totalCost != undefined) {
                form.pur02.totalPrice = parseFloat(form.pur02.materialDetCostTotal) + parseFloat(data.totalCost);
            }
        });
    }
    form.CalcChargebackdet = function (items) {
        var rowTotal = 0.00;
        if (items.sorting != undefined) {
            rowTotal += items.sorting * 1;
        }
        if (items.rework != undefined) {
            rowTotal += items.rework * 1;
        }
        if (items.extraFreight != undefined) {
            rowTotal += items.extraFreight * 1;
        }
        if (items.qnFee != undefined) {
            rowTotal += items.qnFee * 1;
        }
        if (items.other != undefined) {
            rowTotal += items.other * 1;
        }
        items.totalCost = rowTotal;
        form.pur02.totalPrice = parseFloat(items.totalCost);
        if (form.pur02.materialDetCostTotal != undefined) {
            form.pur02.totalPrice = parseFloat(items.totalCost) + parseFloat(form.pur02.materialDetCostTotal);
        }
    }

    form.getlength = function (data) {
        debugger;
        form.$timeout(function () {
            if (!!data && data.length > 0) {
                var materialTotal = 0.00;
                for (var i = 0; i < data.length; i++) {
                    debugger;
                    result = program('GetBaseDataId', { data: data[i].materialKind, parentId: 'AECB3F89-926C-4303-BBD0-C0F143AB0BC8' });
                    if (result == "" || result == null) {
                        mabp.notify.warn("第" + (i + 1) + "行Material Kind数据格式不正确！");
                        break;
                    }
                    data[i].materialKind = result;
                     
                    materialTotal += (parseFloat(data[i].unitPrice) * parseInt(data[i].qtyRej));
                    var items = {
                        partNumber: data[i].partNumber,
                        supplierCode: data[i].supplierCode,
                        qtyRev: data[i].qtyRev,
                        lotNo: data[i].lotNo,
                        qtyRej: data[i].qtyRej,
                        reason: data[i].reason,
                        unitPrice: data[i].unitPrice,
                        materialKind: data[i].materialKind,
                        totalPrice: parseFloat(data[i].unitPrice) * parseInt(data[i].qtyRej)
                    }
                    form.yfvicmaterialdet.push(items);
                }
                form.pur02.materialDetCostTotal = materialTotal;
                angular.forEach(form.yfvicchargebackdet, function (data, index, array) {
                    debugger;
                    if (data.totalCost != undefined) {
                        form.pur02.totalPrice = parseFloat(form.pur02.materialDetCostTotal) + parseFloat(data.totalCost);
                    } else {
                        form.pur02.totalPrice = parseFloat(form.pur02.materialDetCostTotal);
                    }
                });
            }
        });
    }
}