/**
 * Created by xtong on 2017/5/6.
 */

// 主程序代码，监听事件

/** 全局定义 begin ------------------------------------ */

var backgroundRoute = "url('imgs/1.jpg')";
var videoRoute = "video/1-test.webm";
var cusvideoRoute = "video.webm";
var audioRoute = "audio/1-Audio.ogg";

// 樱花对象
var sakura = document.getElementById("sakura");

// 视频相关
var myvideo = document.getElementById("myvideo");
var selectvideo = {};
var videorange = document.getElementById("myvideorange");
var videomodel = 1;
var VideoVolume = 0.5;
var VideoModelNow = 1;

// 音频相关
var myAudio = document.getElementById("myAudio");
var MuiscModel = 0;
var MuiscVolume = 0.5;

//可视化音频模板
var visual_audio_model = 1;
var PWCircle_show_bool = true;
var PWLine_show_bool = true;

// 开启幻灯
var SlideNow = false;
var wallpapermode = 1;
//幻灯片特效
var TransitionMode = 1;
var TransitionRandom = false;
// 开启随机播放
var random = false;
// 当前壁纸
var currentImg = "";
// 播放列表
var myList = [];
// 目录储存
var files = {};
// 自定义壁纸
var custom = {};
// 壁纸切换速度
var speed = 1;
// 背景样式
var bgStyle = 1;

//樱花
var showSakura = true;
var sakuratransparency = 0.15;


//时间相关
var timetransparency = 0.8;
var TimeX = 50;// 时间在x轴上的位置
var TimeY = 50;
var DateX = 50;
var DateY = 45;
var tShowSencends = true;//显示秒
var DateFormatTest = 1;
var TimeColorRhythm = false;
var TimeColor;
var TimeBlurColor;

/** 全局定义 end -------------------------------------- */

// 设定参数
var param = {
    style : 1, // 样式
    r : 0.45, // 圆的半径
    color : "rgba(255,255,255,0.8)", // 颜色
    blurColor : "#ffcccc", // 模糊颜色
    arr1 : [], // 外圆点集合
    arr2 : [], // 内圆点集合
    rotation : 0, // 是否旋转
	rotationcopy : 0,//备份
    offsetAngle : 0, //旋转角度
    waveArr : new Array(120),
    cX : 0.5, // 圆中心点在x轴位置
    cY : 0.5,
    range : 9, // 振幅
    shadowBlur: 15,
    lineWidth : 9,
    showCircle : true,
    wavetransparency : 0.8,
    showSemiCircle : false,
    SemiCircledirection : 1,
	Polygon : 12, //2-180多边形变换
	SolidColorGradient : true,
	BlurColorGradient : true,
	ColorRhythm : true,
	ColorMode : 1 ,//色彩模式
	TagNow : 1,
	GradientRate : 0.5
};

var PWLineParam = {
    style : 1, // 样式
    sw : 0.8, // 间距
	lineWidth : 9,
	waveArr : new Array(120),
	range : 5, // 振幅
    color : "rgba(255,255,255,0.8)", // 颜色
    blurColor : "#ffcccc", // 模糊颜色
	shadowBlur: 100,
    arr1 : [], // 外圆点集合
    arr2 : [], // 内圆点集合
	arr3 : [], // 上下中点
    LineX : 0.5, // 圆中心点在x轴位置
    LineY : 0.5,
    showLine : true,
	LinePosition : 1,
	Direction : 1,
	LineDensity : 120,
	LineTransparency : 0.8,
	MiddleLine	: false, //中线
	TagNow : 1,
	SolidColorGradient : true, //纯色渐变
	BlurColorGradient : true,//模糊色渐变
	ColorRhythm : true,//彩虹律动
	ColorMode : 1,//色彩模式
	GradientRate : 0.5
    //wavetransparency : 0.8,
    //showSemiCircle : false,
    //SemiCircledirection : 1,
	//Polygon : 12 //2-180多边形变换
};

var clearT = function(){
    // 清除定时器：t
    try{
        clearTimeout(t);
    } catch (e){
        console.log(e);

    }
};

/* 监听配置 */
window.wallpaperPropertyListener={
    applyUserProperties: function(properties){

        // 自定义壁纸
        if(properties.image){
            // 获取自定义壁纸
			clearT();
            custom = properties.image.value;
			shouldShow();
        }
		//
		if(properties.customdirectory){
            // 获取自定义壁纸
			clearT();
			if(properties.customdirectory)
			{
				changeBackground();
			}else{
				shouldShow();
			}
        }
        // 监听幻灯开关变化
        if (properties.wallpapermode) {
			clearT();
            wallpapermode = properties.wallpapermode.value;
			changeBackground();
        }
		//幻灯片特效
		if (properties.TransitionMode) {
			TransitionMode = properties.TransitionMode.value;
        }
		//默认壁纸
		if (properties.DefaultWallpaper) {
			backgroundRoute = "url('imgs/"+ properties.DefaultWallpaper.value +".jpg')"
			shouldShow();
        }
		//自定义视频
		if(properties.selectvideo){
            // 获取自定义视频地址
            selectvideo = properties.selectvideo.value;
			if(selectvideo)
			{
				myvideo.src = "url('"+'file:///' + selectvideo + "')";
				myvideo.type = "video/webm";
				myvideo.play();
				//SetCustomVideo();
			}
        }
		//视频模板
		if (properties.videomodel) {
            videomodel = properties.videomodel.value;
			
			if(wallpapermode == 3)
			{
				videoRoute = 'video/' + videomodel + '-test.webm'
				ChangeVideoModel();
			}
        }
		//音量
		if (properties.VideoVolume) {
			myvideo.volume = properties.VideoVolume.value/100
        }
		//音频模板
		if (properties.MuiscModel) {
            MuiscModel = properties.MuiscModel.value;
			audioRoute = "audio/" + MuiscModel +"-Audio.ogg"
			ChangeAudioModel();
        }
		//音量
		if (properties.MuiscVolume) {
			myAudio.volume = properties.MuiscVolume.value/100
        }
        // 监听随机模式开关变化
        if (properties.random) {
            random = properties.random.value;
        }
        // 更改幻灯切换时间
        if(properties.imageswitchtimes){
            speed = properties.imageswitchtimes.value;
        }
        // 更改背景展示样式
        if(properties.imagedisplaystlye){
            bgStyle = properties.imagedisplaystlye.value;
            shouldShow();
        }
		//多边形变换
		if(properties.PolygonAngle){
             SetPolygonAngle(properties.PolygonAngle.value);
        }
        // 样式
        if(properties.style){
            param.style = properties.style.value;
        }
        // 半径
        if(properties.radius){
            param.r = properties.radius.value/100;
        }
        // 幅度
        if(properties.range){
            param.range = properties.range.value/5;
        }
        // 颜色
        if(properties.color){
            var c = properties.color.value.split(' ').map(function(c){return Math.ceil(c*255)});
            ctx.strokeStyle = param.color = 'rgba('+ c +',0.8)';
            //oClock.style.color = 'rgb('+c+')';
        }
        // 模糊颜色
        if(properties.blurColor){
            var c = properties.blurColor.value.split(' ').map(function(c){return Math.ceil(c*255)});
            ctx.shadowColor = param.blurColor = 'rgb('+ c +')';
            //oClock.style.textShadow = '0 0 20px rgb('+c+')';
        }
        // 是否显示时间
        if(properties.showTime){
            oClock.style.display = properties.showTime.value ? 'block' : 'none';
        }
		// 是否显示日期
        if(properties.showDate){
            oDate.style.display = properties.showDate.value ? 'block' : 'none';
        }
		// 是否显示秒
        if(properties.tShowSencends){
            tShowSencends = properties.tShowSencends.value;
        }
        // 圆的位置
        if(properties.cX){
            param.cX = properties.cX.value*0.01;
        }
        if(properties.cY){
            param.cY = properties.cY.value*0.01;
        }
		//色彩模式
		if(properties.ColorMode){
            param.ColorMode = properties.ColorMode.value;
        }
		//纯色渐变
		if(properties.SolidColorGradient){
            param.SolidColorGradient = properties.SolidColorGradient.value;
			
			if(!param.SolidColorGradient) ctx.strokeStyle = param.color;
        }
		//模糊色渐变
		if(properties.BlurColorGradient){
            param.BlurColorGradient = properties.BlurColorGradient.value;
        }
		//彩虹律动
		if(properties.ColorRhythm){
            param.ColorRhythm = properties.ColorRhythm.value;
        }
		//渐变速率
		if(properties.GradientRate){
            param.GradientRate = properties.GradientRate.value/10;
        }
		// 时间大小
        if(properties.tSize){
            var s = properties.tSize.value;
            oClock.style.fontSize = Math.floor(h/300*s) + 'px';
        }
		// 日期大小
        if(properties.DateSize){
            var s = properties.DateSize.value;
			oDate.style.fontSize = Math.floor(h/300*s) + 'px';
        } 
		// 日期格式
		if(properties.DateFormat){
            DateFormatTest = properties.DateFormat.value;
        }
        // 时间的位置
        if(properties.tX){
            TimeX = properties.tX.value;
            oClock.style.left = TimeX-50+'%';
			//oDate.style.left = TimeX-50+'%';
        }
        if(properties.tY){
            TimeY = properties.tY.value;
            oClock.style.top = TimeY-50+'%';
			//oDate.style.top = TimeY-45+'%';
        }
		// 日期的位置
        if(properties.DateX){
            DateX = properties.DateX.value;
			oDate.style.left = DateX-50+'%';
        }
        if(properties.DateY){
            DateY = properties.DateY.value;
			oDate.style.top = DateY-50+'%';
        }
		// 颜色律动
        if(properties.TimeColorRhythm){
            TimeColorRhythm = properties.TimeColorRhythm.value;
			if(!TimeColorRhythm){
				oClock.style.color = TimeColor;
				oDate.style.color = TimeColor;
				oClock.style.textShadow = TimeBlurColor;
				oDate.style.textShadow = TimeBlurColor;
			}
        }
		// 时间颜色
        if(properties.TimeColor){
            var c = properties.TimeColor.value.split(' ').map(function(c){return Math.ceil(c*255)});
            oClock.style.color = TimeColor = 'rgb('+c+')';
			oDate.style.color = TimeColor = 'rgb('+c+')';
        }
        // 时间模糊颜色
        if(properties.TimeBlurColor){
            var c = properties.TimeBlurColor.value.split(' ').map(function(c){return Math.ceil(c*255)});
            oClock.style.textShadow = TimeBlurColor = '0 0 20px rgb('+c+')';
			oDate.style.textShadow = TimeBlurColor = '0 0 20px rgb('+c+')';
        }
        // 时间制式
        if(properties.tStyle){
            tStyle = properties.tStyle.value;
            getTime();
        }
		//时间透明度
        if(properties.timetransparency){
            timetransparency = properties.timetransparency.value/100;
            oClock.style.opacity = timetransparency;
			oDate.style.opacity = timetransparency;
        }
        // 是否旋转
        if(properties.rotation){
            param.rotation = properties.rotation.value;
			rotationcopy = param.rotation;
        }
        // 线宽
        if(properties.lineWidth){
            ctx.lineWidth = param.lineWidth = properties.lineWidth.value;
        }
        // 是否显示圆
        if(properties.showCircle){
            param.showCircle = properties.showCircle.value;
			PWCircle_show_bool = param.showCircle;
        }
        // 方向
        if(properties.direction){
            param.direction = properties.direction.value;
        }
        //樱花透明度
        if(properties.sakuratransparency){
            sakuratransparency = properties.sakuratransparency.value/100;
            sakura.getContext('experimental-webgl').canvas.style.opacity = sakuratransparency
        }
        //可视化音频透明度
        if(properties.wavetransparency){
            param.wavetransparency = properties.wavetransparency.value/100;
            ctx.globalAlpha = param.wavetransparency;
        }
        //显示为半圆
        if(properties.showSemiCircle){
            param.showSemiCircle = properties.showSemiCircle.value;
			if(param.showSemiCircle)
			{	
				rotationcopy = param.rotation;
				param.rotation = 0;
				param.offsetAngle = 0;
			}else{
				param.rotation =rotationcopy;
			}
		}
        //显示为半圆
        if(properties.SemiCircledirection){
            param.SemiCircledirection = properties.SemiCircledirection.value;
        }
        //樱花特效
        if(properties.showSakura){
            showSakura = properties.showSakura.value;
            if(showSakura){
                // 开启樱花，全屏樱花
                makeCanvasFullScreen(sakura);
            }else{
                // 关闭樱花，隐藏樱花
                makeCanvasHide(sakura);
            }
        }
		//显示直线
		if(properties.PWLineShow){
            PWLineParam.showLine = properties.PWLineShow.value;
			PWLine_show_bool = PWLineParam.showLine;
        }//直线位置
		if(properties.PWLinePosition){
            PWLineParam.LinePosition = properties.PWLinePosition.value;
        }
		//样式
		if(properties.PWLineStyle){
            PWLineParam.style = properties.PWLineStyle.value;
        }
		//方向
		if(properties.PWLineDirection){
            PWLineParam.Direction = properties.PWLineDirection.value;
        }
		//线宽
		if(properties.PWLineWidth){
            CTXLine.lineWidth = PWLineParam.lineWidth = properties.PWLineWidth.value;
        }
		//间距
		if(properties.PWLineSpacing){
            PWLineParam.sw = properties.PWLineSpacing.value/10;
        }
		//疏密
		if(properties.PWLineDensity){
            PWLineParam.LineDensity = properties.PWLineDensity.value*10;
        }
		//幅度
		if(properties.PWLineRange){
            PWLineParam.range = properties.PWLineRange.value/5;
        }
		//可视化音频透明度
        if(properties.PWLineTransparency){
            PWLineParam.LineTransparency = properties.PWLineTransparency.value/100;
            CTXLine.globalAlpha = PWLineParam.LineTransparency;
        }
		// 颜色
        if(properties.PWLineColor){
            var c = properties.PWLineColor.value.split(' ').map(function(c){return Math.ceil(c*255)});
            CTXLine.strokeStyle = PWLineParam.color = 'rgba('+ c +',0.8)';
        }
        // 模糊颜色
        if(properties.PWLineBlurColor){
            var c = properties.PWLineBlurColor.value.split(' ').map(function(c){return Math.ceil(c*255)});
            CTXLine.shadowColor = PWLineParam.blurColor = 'rgb('+ c +')';
        }
		// 圆的位置
        if(properties.PWLineX){
            PWLineParam.LineX = properties.PWLineX.value/100.0;
        }
        if(properties.PWLineY){
            PWLineParam.LineY = properties.PWLineY.value/100.0;
        }
		//中间线
		if(properties.PWMiddleLine){
            PWLineParam.MiddleLine = properties.PWMiddleLine.value;
        }
		//色彩模式
		if(properties.PWLineColorMode){
            PWLineParam.ColorMode = properties.PWLineColorMode.value;
        }
		//纯色渐变
		if(properties.PWLineSolidColorGradient){
            PWLineParam.SolidColorGradient = properties.PWLineSolidColorGradient.value;
			if(!PWLineParam.SolidColorGradient) CTXLine.strokeStyle = PWLineParam.color;
        }
		//模糊色渐变
		if(properties.PWLineBlurColorGradient){
            PWLineParam.BlurColorGradient = properties.PWLineBlurColorGradient.value;
        }
		//彩虹律动
		if(properties.PWLineColorRhythm){
            PWLineParam.ColorRhythm = properties.PWLineColorRhythm.value;
        }
		//渐变速率
		if(properties.PWLineGradientRate){
            PWLineParam.GradientRate = properties.PWLineGradientRate.value/10;
        }
		//可视化音频模板选择
		if(properties.visual_audio_model){
            visual_audio_model = properties.visual_audio_model.value;
			switch (visual_audio_model){
				case 0://无
					param.showCircle = false;
					PWLineParam.showLine = false;
					break;
				case 1://完美壁纸
					param.showCircle =PWCircle_show_bool;
					PWLineParam.showLine = false;
					break;
				case 2://完美直线
					param.showCircle = false;
					PWLineParam.showLine = PWLine_show_bool;
					break;
				case 3://come soon
					param.showCircle = false;
					PWLineParam.showLine = false;
					break;
				default:
			}
        }
		
    },
    userDirectoryFilesAddedOrChanged: function(propertyName, changedFiles) {
        if (!files.hasOwnProperty(propertyName)) {
            // First time that files are sent.
            files[propertyName] = changedFiles;
        } else {
            files[propertyName] = files[propertyName].concat(changedFiles);

        }
        updateFileList(files[propertyName]);
    },
    userDirectoryFilesRemoved: function(propertyName, removedFiles) {
        // The user removed files from the directory while the wallpaper was running.
        // Remove these files from the global array first.
        for (var i = 0; i < removedFiles.length; ++i) {
            var index = files[propertyName].indexOf(removedFiles[i]);
            var myindex = myList.indexOf(removedFiles[i]);
            if (index >= 0) {
                files[propertyName].splice(index, 1);
            }
            if (myindex >= 0) {
                // 列表中删除
                myList.splice(myindex, 1);
            }
        }
        updateFileList(files[propertyName]);
    },
	setPaused: function( isPaused ) {
		if (isPaused){
			myvideo.pause();
			myAudio.pause();
		}
		else{
			if (myvideo.paused) {
				myvideo.play();
			}
			if (myAudio.paused) {
				myAudio.play();
			}
		}
	}
};

//多边形模式
var SetPolygonAngle = function(mode){

	switch (mode){
		case 1:
			param.PolygonAngle = 1;
			Polygon = 295; 
			break;
		case 2:
			param.PolygonAngle = 2;
			Polygon = 270;
			break;
		case 3:
			param.PolygonAngle = 4;
			Polygon = 245;
			break;
		case 4:
			param.PolygonAngle = 5;
			Polygon = 220;
			break;
		case 5:
			param.PolygonAngle = 7;
			Polygon = 195;
			break;
		case 6:
			param.PolygonAngle = 9;
			Polygon = 170;
			break;
		case 7:
			param.PolygonAngle = 10;
			Polygon = 145;
			break;
		case 8:
			param.PolygonAngle = 12;
			Polygon = 120;
			break;
		case 9:
			param.PolygonAngle = 30;
			Polygon = 95;
			break;
		case 10:
			param.PolygonAngle = 60;
			Polygon = 70;
			break;
		case 11:
			param.PolygonAngle = 90;
			Polygon = 45;
			break;
		case 12:
			param.PolygonAngle = 180;
			Polygon = 20;
			break;
		default:		
	}
	
};

