$(function () {

    ddlInit();

    tableInit();

    bindEvents();

    let nowTime = getNowTime();

    let compareDate = nowTime.month + "月" + nowTime.day + "日";

    let nowNumber = getNowChangeNumber(compareDate);
    
    changeStyle(nowNumber, nowTime.time);
})
/**
 * 获取当前是第几天
 * @param {*} date 
 */
const getNowChangeNumber = function (date) {
    let head = $("th")
    let num = 0;
    while (num < head.length) {
        if ($(head[num]).html().indexOf(date) != -1) {
            break;
        }
        num++;
    }
    return num;
}
/**
 * 修改表格的样式,使对应时间显示对应颜色
 */
const changeStyle = function (nowNumber,time) {

    let now = Number(time.split(":")[0]);

    let tr = $("tbody").find("tr");
    $($("th").get(nowNumber)).css("background-color","red");

 
    if (now >= 8 && now <12) {
        now = 0;
    } else if (now >=12 && now < 17) {
        now = 1;
    } else if (now >=17 && now < 21) {
        now = 2;
    } else {
        return;
    }

    $($(tr[now]).find("td").get(nowNumber)).css("background-color","red")
}
/**
 * 获取当前时间
 */
const getNowTime = function () {
    let date = new Date();
    let ds = date.toString().split(" ");

    let nowTime = {
        week : ds[0],
        month : date.getMonth() + 1,
        day : ds[2],
        year : ds[3],
        time : ds[4],
        metaData : ds,
    }

    return nowTime;
}
/**
 * 表格初始化
 */
const tableInit = function () {
    let s = $("#major").find(":selected").val();
    let trs = $("table").find("tbody").find("tr");
    trs.empty();
    showMajorClass(s)
}
/**
 * 绑定事件(下拉框改变事件)...
 */
const bindEvents = function () {
    $("#major").change(function () {
        tableInit()
    })
}

/**
 * 下拉框的初始化...
 */
const ddlInit = function () {
    $("#major").val(getCookie("select") || "computer");
}

/**
 * 显示专业的课程
 * 
 */
const showMajorClass = function (major) {
    let m = majors[major];
    
    for (let key in m) {
        if (key !== "major") {
            let c = m[key].split(",");
            let times = 0;
            let tr = $("tbody").find("tr")
            $.each(c,function (index, data) {
                if (data === "") {
                    $(tr[times]).append("<td>&nbsp;</td>");
                } else {
                    $(tr[times]).append("<td>" + data + "</td>");
                }
                times++;
            })
        }
    }

    setCookie("select", m.major, 10000, "/");
}