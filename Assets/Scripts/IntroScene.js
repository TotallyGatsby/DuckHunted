#pragma strict

var time:float = 1.5;
var duckXTarget:float = .140;
var huntXTarget:float = 0.20;
var edXTarget:float = .75;

var duck:GameObject;
var hunt:GameObject;
var ed:GameObject;

function Start () {
	iTween.MoveTo(duck, {"x":duckXTarget, "time":time});
	iTween.MoveTo(hunt, {"x":huntXTarget, "time":time, "oncomplete":"GoEd", "oncompletetarget":gameObject});
}

function GoEd(){
	iTween.MoveTo(ed, {"x":edXTarget, "time":.5, "easetype":"easeInQuad", "oncomplete":"PunchHunt", "oncompletetarget":gameObject});
}

function PunchHunt(){
	iTween.PunchPosition(hunt, {"x":-.05, "time":1.0});
}
function Update () {

}