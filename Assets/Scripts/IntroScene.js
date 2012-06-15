#pragma strict

var letters:GameObject[];
var targets:Vector3[];
var fadeins:GameObject[];

function Start () {
	iTween.CameraFadeAdd();
	iTween.CameraFadeFrom({"amount":1, "time":0});
	iTween.CameraFadeTo({"amount":0, "time":1});
	
	// Set the alphas to 0 on our fadein text
	for(var obj in fadeins){
		iTween.FadeTo(obj, {
			"alpha":0,
			"time": 0
		});
	}
	
	for (var i = 0; i < letters.length; i ++){
		iTween.MoveTo(letters[i], {"position":targets[i], 
									"time":2, 
									"islocal":true,
									"oncomplete":"SoftPunch", 
									"oncompletetarget":letters[i]});
	}
	
	for(i =0; i<fadeins.length; i++){
		iTween.FadeTo(fadeins[i], {
			"alpha":1,
			"time": 1,
			"delay":1.4 + i*.2
		});
	}
	
}
