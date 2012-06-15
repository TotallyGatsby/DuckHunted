#pragma strict
var customSkin : GUISkin;

private var guiAlpha = 1;
private var guiDelay = 2.0;

function Start () 
{
	
}

function OnEnable () 
{
	
	if (Global.options){
		Global.hsController.getScores();
		Global.options.gameObject.active = false;
	}
	
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
	
	GUI.Label(Rect (Screen.width/2-128, Screen.height/2-264, 256, 500), "Leaderboards");
	GUI.Label(Rect (Screen.width/2-228, Screen.height/2-232, 248, 500), Global.hsNameText);
	GUI.Label(Rect (Screen.width/2+20, Screen.height/2-232, 224, 500), Global.hsScoreText);
		
	if (GUI.Button(Rect(Screen.width/2-100, Screen.height/2+180, 200, 50),"Done"))
		transform.active = false;
}