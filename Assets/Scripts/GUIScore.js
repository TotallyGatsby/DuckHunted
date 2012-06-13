#pragma strict

private var player : Player;
private var score = -1;
private var scoreValueComponent : GUIText;

function Start () 
{
	player = transform.parent.GetComponent(gui).playerTransform.GetComponent(Player);
	scoreValueComponent = transform.FindChild("Score Value").GetComponent(GUIText);
}

function Update () 
{
	if (player.score != score)
		scoreValueComponent.text = player.score.ToString("000000");
}