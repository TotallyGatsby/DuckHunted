#pragma strict

private var player : Player;

function Start () 
{
	player = transform.parent.GetComponent(gui).playerTransform.GetComponent(Player);
}

function Update () 
{
	if (player.combo > 1)
	{
		guiText.text = player.combo + "x Combo!\n";
		
		if (player.combo <= 6)
			guiText.text += "Good!";
		else if (player.combo > 6 && player.combo <= 12)
			guiText.text += "Nice!";
		else if (player.combo > 12 && player.combo <= 24)
			guiText.text += "Cool!";
		else
			guiText.text += "Crazy!";
		
		transform.position.x = Mathf.Lerp(transform.position.x, 1, Time.deltaTime*4);
	}
	else
	{
		transform.position.x = Mathf.Lerp(transform.position.x, 1.5, Time.deltaTime*4);
	}
}