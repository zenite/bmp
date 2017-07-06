
function controller(base, form, program) {
   
    form.delete = function () {
        debugger;
        var evens = _.remove(form.hr13detail, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }
    form.add = function () {
        debugger;
        form.hr13detail.push({});

    }
    form.$page_load = function () {
        if (form.$pageRight.Hr13Node3 == 'normal' && base.pageState == 2)
        {
            for (var i = 0; i < 3; i++) {
                form.add();
            }
        }
        if (form.$pageRight.Hr13Node8 == 'normal' && base.pageState == 2)
        {
            form.hr13.positionProperty = 'AD3082F6-2362-42BE-BFD1-40ED1CB889B6,7C06A8AB-204F-42DE-94B5-E076BB6665F9';
            form.hr13.decimal = 2;
        }
        if (form.$pageRight.Hr13Node7 == 'normal' && base.pageState == 2)
        {
            program("StartDate", { id: 1 },
         function (startDate) {
             debugger;
             form.hr13.positionExpiryDate = startDate;

         });
        }
    }
    form.$event_agree_before = function (context) {
        debugger;
        if (form.hr13.positionResult != '67d093e0-49b1-4867-8e5b-0aaa9c01213e') {
            form.hr13.positionExpiryDate = null;
        }
        if (form.$pageRight.Hr13Node8 == 'normal' && base.pageState == 2)
        {
            
            form.$confirm("请确认已为员工匹配正确的岗位属性", "提示", function (confirmed) {
                debugger;
                if (confirmed) {
                    context.btn.noConfirm = true; //取消默认提交弹窗
                    return context.$continue();
                }
            });
        } 
        if (form.$pageRight.Hr13Node9 == 'normal' && base.pageState == 2)
        {
            if (form.$state.UploadAttachment == null) {
                form.$alert("请上传岗位资质试卷");
                return context.$stop();
            } 
        }
       
        if (!(form.$pageRight.Hr13Node8 == 'normal' && base.pageState == 2))
        {
            return context.$continue();
        }
      
    }
    form.changePositionProperty = function (selectItem, fmModel) {
        form.hr13.decimal = !!fmModel ? (fmModel || "").split(",").length : "0";
    }
    form.chooseEffectEvalResult = function ()
    {
       
        form.effresult = false;
            for (var i = 0; i < form.hr13detail.length; i++) {
                if (form.hr13detail[i].effectEvalResult != 'CF7A9A15-4297-4EB1-86A1-580F2DBAA4B3' && form.hr13detail[i].effectEvalResult != '' && form.hr13detail[i].effectEvalResult != null) {

                    form.effresult = true;
                    break;
                } 
                
            }
            if (form.effresult == true) {
                form.hr13.knowSkillTrainingResult = "23b5fffd-5ae3-4555-bec7-24cff77582f5";
            } else
            {
                form.hr13.knowSkillTrainingResult = null;
            }
        
    }
}