#pragma strict


var spawnPrefab:UnityEngine.GameObject;

function Start () {

}

function Update () {
	if (Duck.duckCount < 2)
	{
		Instantiate(spawnPrefab, Vector3.one, Quaternion.identity);
	}
}