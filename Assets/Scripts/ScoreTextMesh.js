#pragma strict

var time : float = 2;

function Start () {

}

function Update () 
{
	time -= Time.deltaTime;
	transform.rotation = Camera.mainCamera.transform.rotation; // Rotate the text mesh the same as the Camera, thus making it a billboard
	if (time <= 0)
		Destroy(gameObject);
}