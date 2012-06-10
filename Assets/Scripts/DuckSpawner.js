#pragma strict


var spawnPrefab:UnityEngine.GameObject;
var maxDucks:int = 3;
var noSpawnRadius:float = 3;

function Start () {

}

function Update () {
	// If need be, we can get smarter about spawning more ducks
	// for now, when a duck goes down, a new one rises
	if (Duck.duckCount < maxDucks)
	{
		
		// Spawn the duck behind the player
		var pTransform = GameObject.Find("Player").transform;
		
		// Only spawn one duck until the player moves away
		if (Vector3.Distance(pTransform.position, gameObject.transform.position) > noSpawnRadius){
			var spawnPos:Vector3 = pTransform.position - (pTransform.forward * 10.0);
			spawnPos.y = 5;
			
			Instantiate(spawnPrefab, spawnPos, Quaternion.identity);
			gameObject.transform.position = pTransform.position;
		}
	}
}

function OnDrawGizmos(){
	Gizmos.DrawIcon(transform.position, "DuckSpawner.png", true);
	
	Gizmos.color = Color.red;
	Gizmos.DrawWireSphere(transform.position, noSpawnRadius);
}