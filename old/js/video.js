 var ChangeVideoModel = function(){

	if (videomodel == 0){
		myvideo.src = cusvideoRoute;
		myvideo.play();
	}else{
		myvideo.src = videoRoute;
		myvideo.play();
	}

};

var ChangeAudioModel = function(){

	if(MuiscModel == 0){
		myAudio.src = null;
		myAudio.play();
	}else{
		myAudio.src = audioRoute;
		myAudio.play();
	}
	
};
