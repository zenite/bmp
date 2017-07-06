
function controller(base, form, program) {
    form.newItem = { code: "", description: "", projectManagerJobId: null, departmentManagerJobId: null, directorJobId: null, isEnable: null };

    form.add = function () {
        var newitem = angular.copy(form.newItem);
        newitem.id = _$.getGUID();
        form.viccompanyinfo.push(newitem);
        form.newItem = { code: "", description: "", projectManagerJobId: null, departmentManagerJobId: null, directorJobId: null, isEnable: null };
    }

    form.remove = function () {
        for (var i = 0; i < form.viccompanyinfo.length; i++) {
            if (form.viccompanyinfo[i].id == item.id) {
                form.viccompanyinfo.splice(i, 1);
                break;
            }
        }
    }

    form.blur = function (item) {
        //console.group("update");
        //console.log(item);
        //console.groupEnd();
    }
}