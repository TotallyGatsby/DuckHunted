#pragma strict

function Start () {

}

function Update () {

}

function SetBullets (theValue : float) {
	transform.GetComponent(AudioSource).Play();
	Camera.mainCamera.transform.parent.GetComponent(Player).bullets = theValue;
}