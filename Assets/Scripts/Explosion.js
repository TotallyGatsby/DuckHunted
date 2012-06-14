#pragma strict
var expansionSpeed = 1.5;
var explosionSize = 6;

function Start () 
{
	transform.name = "Explosion";
}

function Update () 
{
	transform.localScale += Vector3(expansionSpeed, expansionSpeed, expansionSpeed);
	transform.Rotate(Vector3(expansionSpeed, expansionSpeed, expansionSpeed));
	if (transform.localScale.x > explosionSize)
		Destroy(gameObject);	
}