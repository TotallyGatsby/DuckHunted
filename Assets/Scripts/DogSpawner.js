#pragma strict

var spawnPrefab:Transform;

var dogTimer:float = 0;
var spawnTimerMax:float = 15;
var spawnDistance:float = 30;

function Update () {
	dogTimer -= Time.deltaTime;
	// If need be, we can get smarter about spawning more ducks
	// for now, when a duck goes down, a new one rises
	if (dogTimer < 0)
	{
		dogTimer += spawnTimerMax;
		// Spawn the duck behind the player
		var pTransform = GameObject.Find("Player").transform;
		
		// Only spawn one duck until the player moves away
		
		var spawnPos:Vector3 = pTransform.position - (pTransform.forward * spawnDistance);
		spawnPos.y = 100;	
		var floorRay = new Ray(spawnPos, Vector3.down);
		var floorRayHit: RaycastHit;
	
		Physics.Raycast(floorRay, floorRayHit, 200);
		spawnPos.y = floorRayHit.point.y + 1;				
		
		var clone:Transform = Instantiate(spawnPrefab, spawnPos, Quaternion.identity);	
	}
}