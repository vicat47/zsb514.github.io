var ball = {x:512,y:100,r:20,g:2,vx:-4,vy:0,color:"#ff0000"}
window.onload = function(){
    var canvas = document.getElementById("canvas");

    canvas.width = 1024;
    canvas.height = 768;

    var context = canvas.getContext("2d");

    setInterval(
        function(){
            render(context);
            update();
        },50
    )
}
function update() {
    ball.x+=ball.vx;
    ball.y+=ball.vy;
    ball.vy+=ball.g;
    if(ball.y >= 768 - ball.r){
        ball.y = 768 - ball.r;
        ball.vy = -0.8*ball.vy;
    }
}
function render(cxt) {
    cxt.clearRect(0,0,cxt.canvas.width,cxt.canvas.height)
    cxt.beginPath();
    cxt.fillStyle = ball.color;
    cxt.arc(ball.x,ball.y,ball.r,0,2*Math.PI);
    cxt.closePath();
    cxt.fill();
}