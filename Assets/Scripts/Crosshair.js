#pragma strict

function Start () {

}

function Update () {
	if (transform.parent.GetComponent(gui).playerTransform.gunZoom == false)
		guiTexture.enabled = true;
	else
		guiTexture.enabled = false;
}