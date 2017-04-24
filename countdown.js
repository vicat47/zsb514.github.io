var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;
//const endTime = new Date(2017,3,25,2,0);
var curShowTimeSeconds = 0;
var balls = [];//彩色小球
const colors = ["#CD00CD","#BBFFFF","#9AFF9A","#8B0A50","#8A2BE2","#00BFFF","#EE9A49","#FF4040","#000000","#7FFFD4"];

window.onload = function(){
    //屏幕自适应
    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.body.clientHeight;
    MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
    RADIUS = Math.round(WINDOW_WIDTH*4/5/108)-1;
    MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);
    //获取canvas 以及context
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    //设置canvas的宽度及高度
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
    curShowTimeSeconds = getCurShowTimeSeconds();//获取当前应显示的时间
    setInterval(
        function(){
            //绘制
            render(context);
            update();
            console.log(balls.length);
        },50);
}

//更新操作
function update() {
    //获得之后显示时间
    var nextShowTimeSeconds = getCurShowTimeSeconds();
    //获得下一个显示时间
    var nextHours = parseInt(nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours*3600)/60);
    var nextSeconds = nextShowTimeSeconds%60;
    //获得当前显示时间
    var curHours = parseInt(curShowTimeSeconds / 3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHours*3600)/60);
    var curSeconds = curShowTimeSeconds%60;
    //比较秒数就可以判断是否改变
    if(nextSeconds!=curSeconds){
        //十位小时，添加小球
        if(parseInt(curHours/10)!=parseInt(nextHours/10)){
            addBalls(MARGIN_LEFT + 0,MARGIN_TOP,parseInt(curHours/10));
        }
        if(parseInt(curHours%10)!=parseInt(nextHours%10)){
            addBalls(MARGIN_LEFT + 15*(RADIUS+1),MARGIN_TOP,parseInt(curHours%10));
        }

        if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10)){
            addBalls(MARGIN_LEFT + 39*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10));
        }
        if(parseInt(curMinutes%10)!=parseInt(nextMinutes%10)){
            addBalls(MARGIN_LEFT + 54*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes%10));
        }

        if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10)){
            addBalls(MARGIN_LEFT + 78*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds/10));
        }
        if(parseInt(curSeconds%10)!=parseInt(nextSeconds%10)){
            addBalls(MARGIN_LEFT + 93*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds%10));
        }
        curShowTimeSeconds = nextShowTimeSeconds;
    }
    updateBalls();
}

//更新小球
function updateBalls() {
    for(var i = 0;i < balls.length;i++){
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;
        //地板碰撞检测
        if(balls[i].y > WINDOW_HEIGHT-RADIUS){
            balls[i].y = WINDOW_HEIGHT-RADIUS;
            balls[i].vy = -balls[i].vy * 0.75;
        }
    }

    //优化数组
    var cnt = 0//计算有多少小球保留在画面中
    for(var i = 0;i < balls.length;i++){
        if(balls[i].x+RADIUS>0&&balls[i].x-RADIUS<WINDOW_WIDTH){
            balls[cnt++] = balls[i];//从0到cnt位置的小球都是在画面中的小球
        }
    }
    //删除小球
    while(balls.length > Math.min(300,cnt)){
        balls.pop();
    }
}

//添加小球
function addBalls(x,y,num) {
    for(var i = 0;i < digit[num].length;i++){
        for(var j = 0;j < digit[num][i].length;j++){
            if(digit[num][i][j]==1){
                var aBall = {
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(),
                    vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4+Math.pow(-1,Math.ceil(Math.random()*1000))*0.5,
                    vy:-(1+Math.random())*5,
                    color:colors[Math.floor(Math.random()*colors.length)]
                }
                balls.push(aBall);
            }
        }
    }
}

//获取当前时间距设定时间的时间
function getCurShowTimeSeconds() {
    // var curTime = new Date();
    // //计算毫秒数
    // var ret = endTime.getTime() - curTime.getTime();
    // //转化为秒
    // ret = Math.round(ret/1000);
    //改为计时器
    var curTime = new Date();
    var ret = curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();
    return ret;
}

//定义绘制方法
function render(cxt){
    //刷新时间
    cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
    //初始化当前时间
    var hours = parseInt(curShowTimeSeconds / 3600);
    var minutes = parseInt((curShowTimeSeconds - hours*3600)/60);
    var seconds = curShowTimeSeconds%60;

    //渲染数字
    renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),cxt);//小时十位
    renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),cxt);//小时个位
    renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,cxt); //冒号
    renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),cxt);//分钟十位
    renderDigit(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),cxt);//分钟个位
    renderDigit(MARGIN_LEFT+69*(RADIUS+1),MARGIN_TOP,10,cxt);//冒号
    renderDigit(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),cxt);
    renderDigit(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),cxt);

    //绘制彩色小球
    for(var i = 0;i < balls.length;i++){
        cxt.fillStyle = balls[i].color;
        cxt.beginPath();
        cxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,true);
        cxt.closePath();
        cxt.fill();
    }
}
//绘制数字
function renderDigit(x,y,num,cxt){
    cxt.fillStyle = "rgb(255,0,0)";
    //遍历digit[num]，并在1位置绘制圆球
    for(var i = 0;i < digit[num].length;i++){
        for(var j = 0;j < digit[num][i].length;j++){
            if(digit[num][i][j]==1){
                //开始绘制
                cxt.beginPath();
                //绘制球
                cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);
                cxt.closePath();
                cxt.fill();
            }
        }
    }
}