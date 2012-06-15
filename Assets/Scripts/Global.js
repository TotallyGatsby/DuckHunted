#pragma strict
static var mainScene : int = 1;
static var gameScene : String = "game";
static var sensitivity : float = 10.0;
static var invertModifier : int = 1;
static var mouseInvert = false;
static var fullscreen = false;
static var volume = 1.0;

static var options : Transform;
static var leaderboards : Transform;

static var hsController : HSController;
static var hsNameText : String;
static var hsScoreText : String;

private var wasLocked = false;

function Start () {
	options = transform.FindChild("Options");
	leaderboards = transform.FindChild("Leaderboards");
	hsController = transform.GetComponent(HSController);
}

function Update () 
{
	AudioListener.volume = volume;
	Screen.fullScreen = fullscreen;
	
	if (mouseInvert == true)
		invertModifier = -1;
	else
		invertModifier = 1;	
}