#pragma strict
var customSkin : GUISkin;
var letters:GameObject[];
var targets:Vector3[];
private var guiAlpha = 0.0;
private var guiDelay = 2.0;

function Start () {
	iTween.CameraFadeAdd();
	iTween.CameraFadeFrom({"amount":1, "time":0});
	iTween.CameraFadeTo({"amount":0, "time":1});
	
	for (var i = 0; i < letters.length; i ++){
		iTween.MoveTo(letters[i], {"position":targets[i], 
									"time":2, 
									"islocal":true,
									"oncomplete":"SoftPunch", 
									"oncompletetarget":letters[i]});
	}
}

function OnGUI() 
{
	GUI.skin = customSkin;
	GUI.color.a = guiAlpha;
	
	guiDelay -= Time.deltaTime;
	if (guiDelay <= 0)
		guiAlpha = Mathf.Lerp(guiAlpha, 1, Time.deltaTime*1.5);	
	
	if (GUI.Button(Rect(Screen.width-210, Screen.height - 180, 200, 50),"Start Game"))
		Debug.Log("Clicked Start Game");
	if (GUI.Button(Rect(Screen.width-210, Screen.height - 120, 200, 50),"Options"))
		Debug.Log("Clicked Options");
	if (GUI.Button(Rect(Screen.width-210, Screen.height - 60, 200, 50),"Leaderboards"))
		Debug.Log("Clicked Leaderboards");
}
