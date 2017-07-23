'use strict';
var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var sideLength = 4;
var isStart = false;
var COLOR_BLACK = "black";
var COLOR_RED = "red";

var context;
var cubes = new Map();

//如果没有indexOf方法，添加。
if(!Array.indexOf) {  
    Array.prototype.indexOf = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
        return -1;
    }
}
/**
 * 当窗口被加载时调用
 * 
 * 1.读取窗口大小
 * 2.获得canvas
 * 3.调用刷新方法
 */
window.onload = function(){
    //屏幕自适应
    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.body.clientHeight;
    
    var canvas = document.getElementById("canvas");

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
    
    context = canvas.getContext("2d");
    
    //添加按下鼠标绘制方法
    canvas.onmousedown=function(ev){
        //在绘图时暂停
        var drawMode = true;
        var beforeStart = isStart;
        if(isStart == true){
            start();
        }
        var event = ev||event;
        //alert(event.clientX+" "+event.clientY);
        var x = event.clientX;
        var y = event.clientY;
        x -= x % sideLength;
        y -= y % sideLength;

        if (cubes.has(x+"_"+y)){
            drawMode = false;
        }

        var points = [];

        points.push({x:x,y:y});
        document.onmousemove=function(ev){
            var event = ev||event;
            var m_x = event.clientX;
            var m_y = event.clientY;
            
            //测试内容
            /*
            {
                var testx = m_x;
                var testy = m_y;
                testx -= testx % sideLength;
                testy -= testy % sideLength;
                drawRect(testx,testy,COLOR_RED,context);
            }
            */

            var aCube = {
                x : m_x,
                y : m_y,
            }
            points.push(aCube);
            var willAdd = [];
            var willDelete = [];
            //将方块赋值给临时的points，通过连接当前块与存储的points来实现
            //此处计算斜线方程
            /*
            y = (x-startPoint.x)/(endPoint.x-startPoint.x)*(endPoint.y-startPoint.y)+startPoint.y
            x = (y-startPoint.y)/(endPoint.y-startPoint.y)*(endPoint.x-startPoint.x)+startPoint.x
            */
            
            while(points.length > 1)  {
                var startPoint = points.shift();
                var endPoint = points[0];
                //假设xy轴都小于步长
                if (Math.abs(startPoint.x - endPoint.x) < sideLength && Math.abs(startPoint.y - endPoint.y) < sideLength){
                    var x = startPoint.x;
                    var y = startPoint.y;

                    x -= x % sideLength;
                    y -= y % sideLength;
                    if (drawMode)  {
                        if (!cubes.has(x+"_"+y)) {
                            //addCube(x,y);
                            var willAddCube = {
                                x : x,
                                y : y
                            }
                            willAdd.push(willAddCube);
                        }
                        continue;
                    } else {
                        willDelete.push({x : x,y : y});
                    }
                }

                //x轴的遍历
                for (var i = sideLength; i < Math.abs(startPoint.x - endPoint.x); i += sideLength) {
                    if (startPoint.x - endPoint.x < 0) {
                        var x = startPoint.x - i;
                    } else {
                        var x = startPoint.x + i;
                    }
                    var y = (x-startPoint.x)/(endPoint.x-startPoint.x)*(endPoint.y-startPoint.y)+startPoint.y;
                    x -= x % sideLength;
                    y -= y % sideLength;
                    if (drawMode)  {
                        if (!cubes.has(x+"_"+y)) {
                            //addCube(x,y);
                            var willAddCube = {
                                x : x,
                                y : y
                            }
                            willAdd.push(willAddCube);
                        }
                    } else {
                        willDelete.push({x : x,y : y});
                    }
                }
                //y轴的遍历
                for (var i = sideLength; i < Math.abs(startPoint.y - endPoint.y); i += sideLength) {
                    if (startPoint.y - endPoint.y < 0) {
                        var y = startPoint.y - i;
                    } else {
                        var y = startPoint.y + i;
                    }
                    var x = (y-startPoint.y)/(endPoint.y-startPoint.y)*(endPoint.x-startPoint.x)+startPoint.x;
                    x -= x % sideLength;
                    y -= y % sideLength;
                    if (drawMode)  {
                        if (!cubes.has(x+"_"+y)) {
                            //addCube(x,y);
                            var willAddCube = {
                                x : x,
                                y : y
                            }
                            willAdd.push(willAddCube);
                        }
                    } else {
                        willDelete.push({x : x,y : y});
                    }
                }
            }
            
            
            // if (points != []) {

            //     //待填充
            //     for (var i = 0; i < points.x; i++)  {
                    
            //     }

            /*
            //变为方块坐标
            m_x -= m_x % sideLength;
            m_y -= m_y % sideLength;
            addCube(m_x,m_y);

            // }
            // //最后将points设为当前点
            // points = aCube;
            */
            while (willAdd.length > 0) {

                var adds = willAdd.pop();
                addCube(adds.x,adds.y);
                drawRect(adds.x,adds.y,COLOR_BLACK,context);

            }

            while (willDelete.length > 0)  {
                var willDeletes = willDelete.pop();
                cubes.delete(willDeletes.x + "_" + willDeletes.y);
                context.clearRect(willDeletes.x,willDeletes.y,sideLength,sideLength);
            }
            
        }
        document.onmouseup=function(){
            if (drawMode && points.length > 0) {
                var adds = points.shift();
                addCube(adds.x,adds.y);
                drawRect(adds.x,adds.y,COLOR_BLACK,context);
            } else if (!drawMode && points.length > 0)  {
                var deletes = points.shift();
                cubes.delete(deletes.x+"_"+deletes.y);
                context.clearRect(deletes.x,deletes.y,sideLength,sideLength);
            }
            document.onmousemove=null;
            document.onmouseup=null;
            if (beforeStart){
                start();
            }
        }
        return false;
    }
}
/**
 * 添加方块的方法，加入到cubes[]中,并且链接周围生命
 * @param {number} x - x的坐标
 * @param {number} y - y的坐标
 */
function addCube(x,y){
    var aCube = {
        x : x,
        y : y,
        roundLife : 0,
    }
    cubes.set(x+"_"+y,aCube);
}
/**
 * 刷新方法，刷新各方块的状态
 */
function fresh(){
    cubes.forEach(function(value,key) {
        value.roundLife = 0;
        //↖
        if(cubes.has(value.x - sideLength+"_"+(value.y - sideLength))){
            value.roundLife ++;
            
        }
        //↑
        if(cubes.has(value.x - sideLength+"_"+value.y)){
            value.roundLife ++;
            
        }
        //↗
        if(cubes.has(value.x - sideLength+"_"+(value.y + sideLength))){
            value.roundLife ++;
            
        }
        //←
        if(cubes.has(value.x + "_" +(value.y - sideLength))){
            value.roundLife ++;
            
        }
        //→
        if(cubes.has(value.x + "_" +(value.y + sideLength))){
            value.roundLife ++;
            
        }
        //↙
        if(cubes.has(value.x + sideLength+"_"+(value.y - sideLength))){
            value.roundLife ++;
        }
        //↓
        if(cubes.has(value.x + sideLength+"_"+value.y)){
            value.roundLife ++;
        }
        //↘
        if(cubes.has(value.x + sideLength+"_"+(value.y + sideLength))){
            value.roundLife ++;
        }
        //console.log(value.roundLife);
    }, this);
    //待删除与待插入
    var waitToDelete = new Set();
    var waitToAdd = [];
    var isVisted = [];
    //遍历找出待删除的节点并存入waitToDelet等待删除&找出待添加的点
    cubes.forEach(function(value,key){
        if(value.roundLife >= 4){
            waitToDelete.add(key);
        }else if(value.roundLife < 2){
            waitToDelete.add(key);
        }
        check(value.x,value.y,waitToAdd,isVisted);
    },this);
    //添加和删除方法
    waitToDelete.forEach(function(element) {
        cubes.delete(element);
    }, this);
    waitToAdd.forEach(function(element) {
        cubes.set(element.x+"_"+element.y,element);
    }, this);
}
/**
 * 检查x，y周围点是否需要添加
 * @param {number} x -传入的x坐标
 * @param {number} y -传入的y坐标
 * @param {Set} WTA -等待添加的set
 * @param {Array} isVisted -已经遍历过的
 */
function check(x,y,WTA,isVisted){
    //遍历周遭8个点
    for(var i = -sideLength;i <= sideLength;i+=sideLength){
        for(var j = -sideLength;j <= sideLength;j+=sideLength){
            //如果是当前点||已经遍历过||map中有的
            /*if((i == 0&&j == 0) || isVisted.indexOf(x+i+"_"+(y+j)) != -1 || cubes.has(x+i+"_"+(y+j))){
                continue;
            }else{*/
                var rl = 0;
                var now_x = x+i;
                var now_y = y+j;
                //遍历当前点周围的8个点
                for(var k = -sideLength;k <= sideLength;k+=sideLength){
                    for(var l = -sideLength;l <= sideLength;l+=sideLength){
                    
                        //如果cubes中有这个点，周围生命++
                        if(cubes.has(now_x+k+"_"+(now_y+l))){
                            rl ++;
                        }
                    }
                }
                //isVisted.push(now_x+"_"+(now_y));
                if(rl > 2 && rl < 4){
                    var aCube = {
                        x : now_x,
                        y : now_y,
                        roundLife : 0
                    }
                    WTA.push(aCube);
                }
            }
        //}
    }
}

/**
 * 绘制画布
 * @param {*} cxt - 绘图的上下文环境
 */
function renderCanvas(cxt){
    //清理画布
    cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
    cubes.forEach(function(value,key) {
        drawRect(value.x,value.y,COLOR_BLACK,cxt);
    }, this);
}
/**
 * 绘制正方形
 * @param {number} x 
 * @param {number} y 
 * @param {*} color
 * @param {*} cxt 
 */
function drawRect(x,y,color,cxt){
    cxt.fillStyle = color;
    cxt.fillRect(x,y,sideLength,sideLength);
}

/**
 * 更新画布方法
 * @param {*} cxt 
 */
function update(cxt){
    fresh();
    renderCanvas(cxt);
}
/**
 * 点击方法，当被点击时在点击位置上添加一个方块。如果有这个方块，则移除
 * @param {*} event - 点击事件
 */

/*
点击方块方法（已废除，被上面取代）
function clickCube(event){
    var e = event || window.event;
    var x = e.clientX;
    var y = e.clientY;
    x -= x % sideLength;
    y -= y % sideLength;
    var cxt = document.getElementById("canvas").getContext("2d");
    if(cubes.has(x+"_"+y)){
        cubes.delete(x+"_"+y);
        cxt.clearRect(x,y,sideLength,sideLength);
    }else{
        addCube(x,y);
        drawRect(x,y,COLOR_BLACK,cxt);
    }
    
}
*/

/**
 * 开始方法，按下开始按钮时触发，用于启动和停止interval。
 */
function start(){
    if(!isStart){
        isStart = true;
        document.getElementById("start").innerHTML = "||";
        var interval = setInterval(
            function(){
                if(!isStart){
                    clearInterval(interval);
                }
                update(context);
                console.log(cubes.size);
                //console.log(cubes);
            },10
        );
    }else{
        isStart = false;
        document.getElementById("start").innerHTML = "|>";
    }
}

/**
 * 缩放方法
 */
function size_small(){
    if (sideLength > 1) {
        var beforeStart = isStart;
        if (isStart) {
            start();
        }
        var waitToAdd = [];
        cubes.forEach(function(value,key) {
            value.x -= value.x / sideLength;
            value.y -= value.y / sideLength;
            waitToAdd.push(value);
        }, this);
        cubes.clear();
        waitToAdd.forEach(function(value) {
            cubes.set(value.x+"_"+value.y,value);
        }, this);
        sideLength --;
        if (!beforeStart)  {
            renderCanvas(context);
        }
        if (beforeStart) {
            start();
        }
    }
}
/**
 * 放大方法
 */
function size_big(){
    var beforeStart = isStart;
    if (isStart) {
        start();
    }
    var waitToAdd = [];
    cubes.forEach(function(value,key) {
        value.x += value.x / sideLength;
        value.y += value.y / sideLength;
        waitToAdd.push(value);
    }, this);
    cubes.clear();
    waitToAdd.forEach(function(value) {
        cubes.set(value.x+"_"+value.y,value);
    }, this);
    sideLength ++;
    if (!beforeStart)  {
        renderCanvas(context);
    }
    if (beforeStart) {
        start();
    }
}