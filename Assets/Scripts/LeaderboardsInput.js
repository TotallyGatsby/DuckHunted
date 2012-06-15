#pragma strict
var customSkin : GUISkin;
private var guiAlpha = 1;
private var guiDelay = 2.0;
var playerName : String = "";

function Start () {
	//transform.active = false;
}

function OnEnable () 
{
	if (Global.options){
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
		
		GUI.Label(Rect (Screen.width/2-150, Screen.height/2-100, 300, 96), "Game Over!\nYour score Was: " + Global.score + "\n\nEnter your Name!");
		playerName = GUI.TextField(Rect (Screen.width/2-125, Screen.height/2, 200, 24), playerName, 12);

		
		if (GUI.Button(Rect(Screen.width/2-125, Screen.height/2+48, 200, 50),"Submit"))
		{
			if (playerName != "")
				Global.hsController.GetComponent(HSController).postScore(playerName, Global.score);
			transform.active = false;
		}
}