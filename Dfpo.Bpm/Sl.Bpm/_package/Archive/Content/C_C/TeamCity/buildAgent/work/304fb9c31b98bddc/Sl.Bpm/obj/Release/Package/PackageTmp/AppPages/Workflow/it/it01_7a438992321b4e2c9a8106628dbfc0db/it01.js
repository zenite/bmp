
function controller(base, form, program) {
    debugger;
    //获取类型
    form.$page_load = function () {
        if (base.applicant.groupId != 'DEPT00498MOT' && base.applicant.groupId != '1e6f69c8-4c2a-4c31-8b55-883ae7334b92')
        {
            form.it01.type = '9c41030f-14dc-4e94-bb23-08ac35031a1d';

        }
            console.log('Start GetAllTypes');
            console.log('GetAllTypes');
            program('GetAllTypes', { language: base.language }, function (data) {
                form.$state.expenseTypeSource = data;
            });
        }
    //后续审批人
        form.chooseApproval = function (row) {
            debugger;
            if (row[0] != null) {
                form.it01.itEngineer = row[0].approver;
                debugger;
            }
        }
}