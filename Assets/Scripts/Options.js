#pragma strict
var customSkin : GUISkin;
private var guiAlpha = 1;
private var guiDelay = 2.0;

function Start () {
	transform.active = false;
}

function OnEnable () 
{
	Global.leaderboards.gameObject.active = false;

	

}

function Update () {

}

function OnGUI () 
{
	GUI.skin = customSkin;
	GUI.color.a = guiAlpha;
	GUI.depth = 11;
	
	guiDelay -= Time.deltaTime;
	if (guiDelay <= 0)
		guiAlpha = Mathf.Lerp(guiAlpha, 1, Time.deltaTime*1.5);	
		
		GUI.Label(Rect (Screen.width/2-238, Screen.height/2-200, 200, 24), "Sensitivity");
		Global.sensitivity = GUI.HorizontalSlider (Rect (Screen.width/2-50, Screen.height/2-200, 250, 24), Global.sensitivity, 2, 35.0);
		
		GUI.Label(Rect (Screen.width/2-238, Screen.height/2-100, 200, 24), "Invert Mouse");
		Global.mouseInvert = GUI.Toggle(Rect (Screen.width/2-40, Screen.height/2-100, 24, 24), Global.mouseInvert, "");
		
		GUI.Label(Rect (Screen.width/2-238, Screen.height/2, 200, 24), "Volume");
		Global.volume = GUI.HorizontalSlider (Rect (Screen.width/2-50, Screen.height/2, 250, 24), Global.volume, 0, 1.0);
		
		GUI.Label(Rect (Screen.width/2-238, Screen.height/2+100, 200, 24), "Fullscreen");
		Global.fullscreen = GUI.Toggle(Rect (Screen.width/2-40, Screen.height/2+100, 24, 24), Global.fullscreen, "");
		
		if (GUI.Button(Rect(Screen.width/2-100, Screen.height/2+180, 200, 50),"Done"))
			transform.active = false;
}