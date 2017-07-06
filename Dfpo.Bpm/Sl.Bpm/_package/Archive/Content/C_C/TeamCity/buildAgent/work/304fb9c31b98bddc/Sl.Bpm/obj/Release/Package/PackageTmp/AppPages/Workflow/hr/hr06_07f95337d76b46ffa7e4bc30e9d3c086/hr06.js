
function controller(base, form, program) {
    debugger;
	form.$page_load = function () {

        //员工调离：2  员工离职：1
		var type = form.$state.Type;
		if (type == '' || typeof (type)=='undefined') {
			form.$state.Type = '1';
		}
		//当前用户ID
		var userid = base.currentUserId;
		//var goup = base.initiator;
		//var departmentName = base.initiator.departmentName;
		//if (departmentName.indexOf('技术中心') > -1) {
		//	form.$state.IsTcStaff = '1';
		//}
		//else {
		//	form.$state.IsTcStaff = '0';
	    //}

		program('IsTC', { groupId: 'DEPT0002V633', userId: base.initiator.userId }, function (data) {
		    if (data) {
		        form.$state.IsTcStaff = '1';
		    }
		    else {
		        form.$state.IsTcStaff = '0';
		    }
		});
		program('StepThree', { nodeCode: form.$nodeCode }, function (data) {
		    if (data) {
		        form.$state.IsStepThree = '1';
		    }
		    else {
		        form.$state.IsStepThree = '0';
		    }
		});

	}

	//切换离职/调离类型时，清空之前选择的文件
	form.changeType = function () {
	    if (form.$state.Type === "2") {
	        form.$state.Type = "2";
		}
	    else if (form.$state.Type === "1") {
	    	form.$state.Type = "1";
		}
	}

	form.$event_submit_before = function (context) {
	    //信息系统科DEPT00498MOT   技术中心DEPT0002V633
	    program('Common.UserIsUnderGroup', { groupId: 'DEPT0002V633', userId: base.initiator.userId }, function (data) {
	        if (data) {
	            form.$state.IsTcStaff = '1';
	        }
	        else {
	            form.$state.IsTcStaff = '0';
	        }
	    });
	    return context.$continue();
	}

	form.$event_agree_before = function (context) {
	    if (form.$pageRight.RepayInterestFreeHouseCarLoanNode === 'normal') {
	        form.$confirm("请确认员工已提供相关银行还款凭证", "确认", function (isConfirmed) {
	            if (isConfirmed)
	                return context.$continue();
	        })
	    }
	    else {
              return context.$continue();       
	    }
	}

}
