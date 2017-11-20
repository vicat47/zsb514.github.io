$(function () {

    tableInit();

    bindEvents();

    let nowTime = getNowTime();

    let compareDate = nowTime.month + "月" + nowTime.day + "日";

    let nowNumber = getNowChangeNumber(compareDate);
    
    changeStyle(compareDate, nowTime.time);
})

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

const changeStyle = function (nowNumber,time) {

    let now = Number(time.split(":"));

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

    $(tr.get(now).find("td").get(nowNumber)).css("background-color","red")
}

const getNowTime = function () {
    let date = new Date();
    let ds = date.toString().split(" ");

    let nowTime = {
        week : ds[0],
        month : ds[1],
        day : ds[2],
        year : ds[3],
        time : ds[4],
        metaData : ds,
    }

    return nowTime;
}

const tableInit = function () {
    let s = $("#major").find(":selected").val()
    $(".public").show();
    switch (s) {
        case "computer" : 
            $(".others").hide();
            $(".computer").show();
            setCookie("select", "computer", 10000, "/");
            break;
        case "others" : 
            $(".others").show();
            $(".computer").hide();
            setCookie("select", "others", 10000, "/");
            break;
    }
}

const bindEvents = function () {
    $("#major").change(function () {
        tableInit()
    })
}
