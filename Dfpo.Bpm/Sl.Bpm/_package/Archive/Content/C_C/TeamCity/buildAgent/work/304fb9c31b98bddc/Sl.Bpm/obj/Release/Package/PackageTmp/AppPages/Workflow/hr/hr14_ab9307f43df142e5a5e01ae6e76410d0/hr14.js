function controller(base, form, program) {
    debugger;
    //借阅文件类型设置初始值为复印件
    if (form.yfvichr14pfb.fileType == null) {
        form.yfvichr14pfb.fileType = '234C230D-8C16-4496-B0FC-A4925A9E65F3';
    }

    //切换借阅文件类型时，清空之前选择的文件
    form.changeFileType = function () {
        if (form.$state.fileType === "2") {
            form.yfvichr14pfb.borrowFileCopy = null;
            form.yfvichr14pfb.otherCopy = null;
        }
        else if (form.$state.fileType === "1") {
            form.yfvichr14pfb.borrowFileOriginal = null;
            form.yfvichr14pfb.otherOriginal = null;
            form.yfvichr14pfb.expectedReturnDate = null;
            form.yfvichr14pfb.actualReturnDate = null;
        }
    }

    //借阅文件名称-复印件，其他从勾选切换到不勾选时，清空其它类(复印件)文件名称的内容
    form.uncheckOtherCopy = function (selectItem,fmModel) {        
        if (!fmModel || fmModel.indexOf('79443CB8-4B4A-4593-81F8-F87D9DEF484E') < 0) {
            form.yfvichr14pfb.otherCopy = null;            
        }
    }

    //借阅文件名称-原件，其他从勾选切换到不勾选时，清空其它类(原件)文件名称的内容
    form.uncheckOtherOriginal = function (selectItem, fmModel) {        
        if (!fmModel || fmModel.indexOf('6D20EC2B-49D9-4A33-890F-69978D5387C8') < 0) {
            form.yfvichr14pfb.otherOriginal = null;
        }
    }

    //比较日期
    form.$doValidation = function () {
        var dateNow = new Date().format("yyyy-MM-dd");
        var twoWeeksLater = moment(dateNow).add(14, 'days'); //获取2周后的日期
        //比较预计归还日期和当前日期
        if (moment(form.yfvichr14pfb.expectedReturnDate).isBefore(moment(dateNow), 'day')) {
            form.$errors.push({ element: $("[name=expectedReturnDate]"), msg: "预计归还日期不应该早于当前日期" });
            return false;
        }
            //比较预计归还日期和2周后的日期
        else if (moment(twoWeeksLater).isBefore(moment(form.yfvichr14pfb.expectedReturnDate), 'day')) {
            form.$errors.push({ element: $("[name=expectedReturnDate]"), msg: "预计归还日期应在当前日期起2周内" });
            return false;
        }
    }
}
