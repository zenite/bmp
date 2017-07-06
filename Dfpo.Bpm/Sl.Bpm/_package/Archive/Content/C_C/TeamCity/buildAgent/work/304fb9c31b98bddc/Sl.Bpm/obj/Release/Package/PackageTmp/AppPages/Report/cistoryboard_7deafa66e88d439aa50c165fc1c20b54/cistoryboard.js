
function controller(base, form, program) {
    debugger;
    var programs = [];
    var barchart;

    //工具函数
    var Tool = {
        //绑定
        Bind: function (obj, type, handler) {
            var node = typeof obj == "string" ? $(obj) : obj;
            if (node.addEventListener) {
                node.addEventListener(type, handler, false);
            } else if (node.attachEvent) {
                node.attachEvent('on' + type, handler);
            } else {
                node['on' + type] = handler;
            }
        },
        getDateStr(addDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth()) : (dd.getMonth());//获取当前月份的日期，不足10补0
            var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
            //return y + "-" + m + "-" + d;
            return new Date(y, m, d);
        }
    }

    //看板类
    function barChart(element, startDate, endDate) {
        var me = this;
        this.Element = document.querySelector(element);
        this.ContentElement = document.querySelector(element + " .bar-chart-content");
        this.HeaderElement = document.querySelector(element + " .bar-chart-header");
        this.SideBarElement = document.querySelector(element + " .bar-chart-sidebar");
        this.TopLeftCellElement = document.querySelector(element + " .bar-chart-lefttopcell");
        this.DataElement = document.querySelector(element + " .bar-chart-data");
        //横向滚动条
        this.HorizontalElement = document.querySelector(element + " .bar-chart-scrollbar.horizontal");
        //横向滚动条轨道
        this.HorizontalElementRail = document.querySelector(element + " .bar-chart-scrollbar.horizontal .scrollbar-rail");
        //横向滚动条滑块
        this.HorizontalElementBar = document.querySelector(element + " .bar-chart-scrollbar.horizontal .scrollbar-dragger");
        //纵向滚动条
        this.VerticalElement = document.querySelector(element + " .bar-chart-scrollbar.vertical");
        //纵向滚动条轨道
        this.VerticalElementRail = document.querySelector(element + " .bar-chart-scrollbar.vertical .scrollbar-rail");
        //纵向滚动条滑块
        this.VerticalElementBar = document.querySelector(element + " .bar-chart-scrollbar.vertical .scrollbar-dragger");
        //向上按钮
        this.VerticalElementBtnUp = document.querySelector(element + " .bar-chart-scrollbar.vertical .btn-prev");
        //向上按钮
        this.VerticalElementBtnDown = document.querySelector(element + " .bar-chart-scrollbar.vertical .btn-next");
        //向左按钮
        this.VerticalElementBtnLeft = document.querySelector(element + " .bar-chart-scrollbar.horizontal .btn-prev");
        //向右按钮
        this.VerticalElementBtnRight = document.querySelector(element + " .bar-chart-scrollbar.horizontal .btn-next");
        this.ProgramCount = 0;
        this.DayCount = 0;
        //活动区
        this.Region = {
            //窗口高度
            WindowHeight: me.Element.clientHeight - 44,
            //窗口宽度
            WindowWidth: me.Element.clientWidth - 150,
            //高度
            Height: 0,
            //宽度
            Width: 0,
            //距离上方距离
            _top: 0,
            get Top() {
                return this._top || 0;
            },
            set Top(value) {
                if (value > me.ProgramCount * 22 - me.Region.WindowHeight) value = me.ProgramCount * 22 - me.Region.WindowHeight;
                if (value <= 0) value = 0;
                me.ContentElement.scrollTop = value;
                me.HeaderElement.style.top = value + "px";
                me.TopLeftCellElement.style.top = value + "px";
                this._top = value;
                me.VerticalElementBar.style.height = me.Region.VerticalRailLength * (me.Region.WindowHeight / me.Region.Height) + "px";
                me.VerticalElementBar.style.top = 16 + me.Region.VerticalRailLength * (value / me.Region.Height) + "px";
            },
            //距离左方距离
            _left: 0,
            get Left() {
                return this._left || 0;
            },
            set Left(value) {
                if (value > me.DayCount * 60 - me.Region.WindowWidth) value = me.DayCount * 60 - me.Region.WindowWidth;
                if (value <= 0) value = 0;
                me.ContentElement.scrollLeft = value;
                me.SideBarElement.style.left = value + "px";
                me.TopLeftCellElement.style.left = value + "px";
                this._left = value;
                me.HorizontalElementBar.style.width = me.Region.HorizontalRailLength * (me.Region.WindowWidth / me.Region.Width) + "px";
                me.HorizontalElementBar.style.left = 16 + me.Region.HorizontalRailLength * (value / me.Region.Width) + "px";
            },
            //横向滚动条滑块长度
            HorizontalRailLength: me.HorizontalElementRail.clientWidth,
            //纵向滚动条滑块长度
            VerticalRailLength: me.VerticalElementRail.clientHeight
        };
        //滚动对象
        this.Timer = {
            _isStart: false,
            set IsStart(value) {
                if (value) {
                    var elementClassList = me.Element.className.split(" ");
                    if (elementClassList.indexOf("autoscroll") < 0) elementClassList.push("autoscroll");
                    me.Element.className = elementClassList.join(" ");
                    me.Timer.Event = setInterval(function () {
                        if (me.Region.Top < me.ProgramCount * 22 - me.Region.WindowHeight) me.Region.Top += me.Timer.ScrollLineNumber * 22;
                        else me.Region.Top = 0;
                    }, me.Timer.Time);
                    this._isStart = true;
                } else {
                    var elementClassList = me.Element.className.split(" ");
                    if (elementClassList.indexOf("autoscroll") >= 0) elementClassList.splice(elementClassList.indexOf("autoscroll"), 1);
                    me.Element.className = elementClassList.join(" ");
                    if (me.Timer.Event) clearInterval(me.Timer.Event);
                    this._isStart = false;
                }
            },
            ScrollLineNumber: 1,
            Time: 10000,
            Event: null
        }

        var _mouseTopDownScroll = false;
        var _isMouseDown = false;
        var _initMouseLocation = { x: 0, y: 0 };
        var _oldLocation = 0;

        //点击向上箭头
        Tool.Bind(this.VerticalElementBtnUp, 'click', function (event) {
            me.Region.Top -= 22;
        });
        //点击向下箭头
        Tool.Bind(this.VerticalElementBtnDown, 'click', function (event) {
            me.Region.Top += +22;
        });
        //点击向左箭头
        Tool.Bind(this.VerticalElementBtnLeft, 'click', function (event) {
            me.Region.Left -= 60;
        });
        //点击向右箭头
        Tool.Bind(this.VerticalElementBtnRight, 'click', function (event) {
            me.Region.Left += 60;
        });
        //点击纵向滚动条滑块（用于拖拽）
        Tool.Bind(this.VerticalElementBar, 'mousedown', function (event) {
            _initMouseLocation = { x: event.clientX, y: event.clientY };
            _isMouseDown = true;
            _mouseTopDownScroll = true;
        });
        //点击纵向滚动条轨道（用于快速翻页）
        Tool.Bind(this.VerticalElementRail, 'mousedown', function (event) {
            if (event.offsetY > parseInt(me.VerticalElementBar.style.height) + parseInt(me.HorizontalElementBar.style.top)) {
                me.Region.Top += me.Region.WindowHeight;
            } else if (event.offsetY < me.Region.Top) {
                me.Region.Top -= me.Region.WindowHeight;
            }
        });
        //点击横向滚动条滑块（用于拖拽）
        Tool.Bind(this.HorizontalElementBar, 'mousedown', function (event) {
            _initMouseLocation = { x: event.clientX, y: event.clientY };
            _isMouseDown = true;
            _mouseTopDownScroll = false;
        });
        //点击横向滚动条轨道（用于快速翻页）
        Tool.Bind(this.HorizontalElementRail, 'mousedown', function (event) {
            if (event.offsetX > parseInt(me.HorizontalElementBar.style.width) + parseInt(me.HorizontalElementBar.style.left)) {
                me.Region.Left += me.Region.WindowWidth;
            } else if (event.offsetY < me.Region.Left) {
                me.Region.Left -= me.Region.WindowWidth;
            }
        });
        //放开滚动条
        Tool.Bind(document, 'mouseup', function (event) {
            _initMouseLocation = { x: 0, y: 0 };
            _isMouseDown = false;
        });
        //拖拽滚动条
        Tool.Bind(document, 'mousemove', function (event) {
            if (_isMouseDown) {
                if (_mouseTopDownScroll) {
                    console.log((me.Region.Height - 44) / me.Region.WindowHeight) * ((me.Region.Height - me.Region.VerticalRailLength) / me.Region.WindowHeight);
                    var result = (event.clientY - _initMouseLocation.y);
                    if (result > 0) me.Region.Top += result % 22 < 11 ? result - result % 22 : result - result % 22 + 22;
                    else me.Region.Top += result % 22 > -11 ? result - result % 22 : result - result % 22 - 22;
                    if (_oldLocation != me.Region.Top) _initMouseLocation.y = event.clientY;
                    _oldLocation = me.Region.Top;
                } else {
                    console.log(me.Region.Height / me.Region.WindowHeight);
                    var result = (event.clientX - _initMouseLocation.x) * ((me.Region.Width - me.Region.HorizontalRailLength) / me.Region.WindowWidth);
                    if (result > 0) me.Region.Left += result % 60 < 30 ? result - result % 60 : result - result % 60 + 60;
                    else me.Region.Left += result % 60 > -30 ? result - result % 60 : result - result % 60 - 60;
                    if (_oldLocation != me.Region.Left) _initMouseLocation.x = event.clientX;
                    _oldLocation = me.Region.Left;
                }
            }
        });
        //键盘上下左右
        Tool.Bind(document, 'keydown', function (event) {
            console.log(event);
            switch (event.keyCode) {
                case 33:
                    me.Region.Top = 0;
                    break;
                case 34:
                    me.Region.Top = me.ProgramCount * 22 - me.Region.WindowHeight + 44;
                    break;
                case 37:
                    me.Region.Left -= 60;
                    break;
                case 38:
                    me.Region.Top -= 22;
                    break;
                case 39:
                    me.Region.Left += 60;
                    break;
                case 40:
                    me.Region.Top += 22;
                    break;
                default:
            }
        });
        //鼠标滚轮滚动事件
        Tool.Bind(me.Element, 'mousewheel', function (event) {
            var e = event || window.event;
            if (e.wheelDeltaY == undefined && e.wheelDeltaX == undefined) {
                me.Region.Top = me.ContentElement.scrollTop - (e.wheelDelta ? e.wheelDelta : e.detail * 22) / 40 * 22;
            } else {
                if (e.wheelDeltaY != 0) {
                    me.Region.Top = me.ContentElement.scrollTop - (e.wheelDelta ? e.wheelDeltaY : e.detail * 22) / 40 * 22;
                } else if (e.wheelDeltaX != 0) {
                    me.Region.Left = me.ContentElement.scrollLeft - (e.wheelDelta ? e.wheelDeltaX : e.detail * 22) / 80 * 60;
                }
            }
            if (document.all) window.event.returnValue = false;
            else event.preventDefault();
        });
        //初始化数据
        this.Init = function (data, startDate, endDate) {
            if (!startDate) startDate = Tool.getDateStr(0);
            if (!endDate) endDate = Tool.getDateStr(30);//new Date().setMonth(new Date().getMonth() + 1);
            me.DayCount = 0;
            me.ProgramCount = programs.length;
            me.Region.Height = me.ProgramCount * 22;
            if (me.Region.Height < me.Region.WindowHeight) me.Region.Height = me.Region.WindowHeight;
            var element_month = "";
            var element_day = "";
            var datelist = [];
            //填充日期
            console.log(startDate, startDate.getFullYear());
            for (var i = startDate.getFullYear() ; i <= endDate.getFullYear() ; i++) {
                for (var o = i == startDate.getFullYear() ? startDate.getMonth() + 1 : 0 ; o <= endDate.getMonth() + 1 && i == endDate.getFullYear() || o <= 12 && i < endDate.getFullYear() ; o++) {
                    var monthday = 0;
                    if (o == startDate.getMonth() + 1 && i == startDate.getFullYear())
                        monthday = ((new Date(i, o, 0).getDate() - startDate.getDate() + 1) * 60);
                    else if (o == endDate.getMonth() + 1 && i == endDate.getFullYear())
                        monthday = (endDate.getDate() * 60);
                    else monthday = (new Date(i, o, 0).getDate() * 60);
                    if ((Array(2).join('0') + (o)).slice(-2) == "00") continue;
                    element_month += '<div style="width:' + monthday + 'px;" class="header-row-cell year">' + i + '-' + (Array(2).join('0') + (o)).slice(-2) + '<div class="shade"></div></div>';
                    for (var p = i == startDate.getFullYear() && o == startDate.getMonth() + 1 ? startDate.getDate() : 1 ; p <= new Date(i, o, 0).getDate() && (o != endDate.getMonth() + 1 || i != endDate.getFullYear()) || o == endDate.getMonth() + 1 && i == endDate.getFullYear() && p <= endDate.getDate() ; p++) {
                        me.DayCount++;
                        element_day += '<div style="width:60px;" class="header-row-cell month">' + p + '<div class="shade"></div></div>';
                        datelist.push({ year: i, month: o, day: p });
                    }
                }
            }
            me.Region.Width = me.DayCount * 60;
            document.querySelectorAll(element + " .bar-chart-header > .header-row")[0].innerHTML = element_month;
            document.querySelectorAll(element + " .bar-chart-header > .header-row")[1].innerHTML = element_day;
            //填充项目
            var element_program = "";
            var element_data = "";
            console.log("项目数：" + programs.length);
            var __i = 0;
            for (var i = 0; i < programs.length; i++) {
                element_program += '<div class="sidebar-row program">' + programs[i].name + '<div class="shade"></div></div>';
                __i++;
                element_data += '<div class="data-row" style="height: 22px;">';

                for (var o = 0; o < datelist.length; o++) {
                    element_data += '<div class="data-cell">';
                    if (!!programs[i].datas) {
                        element_data += '<div class="data-cell-table">';
                        for (var p = 0; p < programs[i].datas.length; p++) {
                            if (programs[i].datas[p].date.year == datelist[o].year &&
                               programs[i].datas[p].date.month == datelist[o].month &&
                               programs[i].datas[p].date.day == datelist[o].day) {
                                for (var j = 0; j < programs[i].datas[p].engineerings.length; j++) {
                                    var eng = programs[i].datas[p].engineerings[j];
                                    element_data += '<a class="bg-' + eng.style + '" target="_blank" ' + (eng.url ? 'href="/SysPages/SnNumber/' + eng.url + '"' : '') + ' title="' + eng.text + '">' + eng.text + '</a>';
                                }
                            }
                        }
                        element_data += '</div>';
                    }
                    element_data += '</div>';
                }
                element_data += '</div>';
            }
            console.log("行数：" + __i);
            me.HeaderElement.style.width = (datelist.length * 60 + 150) + "px";
            me.DataElement.style.width = (datelist.length * 60) + "px";
            me.SideBarElement.innerHTML = element_program;
            me.DataElement.innerHTML = element_data;

            me.Region.Top = 0;
            me.Region.Left = 0;
        }
        //自动滚屏
        this.AutoScroll = function (checked, time, linenumber) {
            if (checked === undefined) checked = true;
            if (time !== undefined) me.Timer.Time = time;
            if (linenumber !== undefined) me.Timer.ScrollLineNumber = linenumber;
            me.Timer.IsStart = checked;
        }
    }

    form.isautoroll = function () {
        barchart.AutoScroll(form.autorollCheck);
    }


    form.$page_load = function () {
        debugger;
        program("GetProjects", { },function(data) {
            programs = data;
            console.log(data);
            barchart.Init(programs, Tool.getDateStr(0), Tool.getDateStr(30));
        });

        var programssss = [
              { name: "CassetteRadio(CDDJ Comp)" },
              { name: "Senseby Conveyer - Oper.", datas: [] }, { name: "Fordnet Timeplex - Comm.", datas: [] },
              { name: "12", datas: [] }, {
                name: "测试项目",
                datas: [
                    {
                        date: {
                            year: "2016", month: "12", day: "13"
                        }, engineerings: [{ text: "MC,SC,PC", style: "red", url: "ECR-2016-0125" }, { text: "PC,SCR", style: "green", url: "ECR-2016-0137" }]
                    }
                ] },
              {
                  name: "44567777898", datas: [{
                      date: { year: "2016", month: "12", day: "23" },
                      engineerings: [{ text: "MC,SC", style: "green", url: "ECR-2016-0207" },
                          { text: "MC,SC", style: "red", url: "ECR-2016-0076" }]
                  }]
              },
              { name: "项目名称+1", datas: [
              {
                  date: { year: "2016", month: "12", day: "23" },
                  engineerings: [{ text: "PC,SCR", style: "black", url: "ECR-2016-0077" }]
              }] },
              { name: "用款测试", datas: [
              {
                  date: { year: "2016", month: "12", day: "31" },
                  engineerings: [{ text: "MC,MSC", style: "black", url: "ECR-2016-0209" }]
              }] },
              { name: "测试1" },
              { name: "用款测试项目1" }, { name: "BPM项目" },
              { name: "22" }, { name: "11111" }, { name: "aaaa" }, { name: "用款测试1106" },
              { name: "用款测试1106" }, { name: "用款测试1106" }, { name: "用款测试1106" }, { name: "用款测试1106" }, { name: "用款测试1106" }
              , { name: "用款测试1106" }, { name: "用款测试1106" }
              , { name: "用款测试1106" }, { name: "用款测试1106" }, { name: "用款测试1106" }
              , { name: "用款测试1106" }, { name: "用款测试1106" }, { name: "用款测试1106" }
              , { name: "用款测试1106" }, { name: "用款测试1106" }, { name: "用款测试1106" }
        ];

        barchart = new barChart(".bar-chart");

        //barchart.Init(programs, Tool.getDateStr(0), Tool.getDateStr(30));

    }


}