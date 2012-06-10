#pragma strict

var bulletNumber : int;
var playerTransform : Transform;
private var player : Player;

function Start () {
	player = playerTransform.GetComponent(Player);
}

function Update () 
{
	if (bulletNumber > player.bullets)
		guiTexture.enabled = false;
	else
		guiTexture.enabled = true;
}