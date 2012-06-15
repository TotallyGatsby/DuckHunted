#pragma strict

// testing

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
		else if (player.combo > 24 && player.combo <= 48)
			guiText.text += "Crazy!";
		else if (player.combo > 48 && player.combo <= 96)
			guiText.text += "Madness!";
		else if (player.combo > 96 && player.combo <= 192)
			guiText.text += "Ballin'!";
		else if (player.combo > 192 && player.combo <= 384)
			guiText.text += "Jammin'";
		else 
			guiText.text += "Slammin'!";
			
			
		guiText.text += "\n" + player.comboTimer.ToString("0.00");
		
		transform.position.x = Mathf.Lerp(transform.position.x, 1, Time.deltaTime*4);
	}
	else
	{
		transform.position.x = Mathf.Lerp(transform.position.x, 1.5, Time.deltaTime*4);
	}
}