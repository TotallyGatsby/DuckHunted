#pragma strict


var spawnPrefab:UnityEngine.GameObject;
var maxDucks:int = 3;

function Start () {

}

function Update () {
	// If need be, we can get smarter about spawning more ducks
	// for now, when a duck goes down, a new one rises
	if (Duck.duckCount < maxDucks)
	{
		// Spawn the duck behind the player
		var pTransform = GameObject.Find("Player").transform;
		
		var spawnPos:Vector3 = pTransform.position - (pTransform.forward * 10.0);
		spawnPos.y = 5;
		Debug.Log(pTransform.position);
		Debug.Log(pTransform.forward);
		Debug.Log(spawnPos);
		
	    
		
		Instantiate(spawnPrefab, spawnPos, Quaternion.identity);
	}
}