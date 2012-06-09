#pragma strict

var health:float = 10.0;
var speed: float = .25;
// Min and Max distance the duck will fly near the player
var minDistance: float = 10;
var maxDistance: float = 20;

// Where this duck wants to fly
@System.NonSerialized
var targetPos:Vector3;
@System.NonSerialized
var startPos:Vector3;


// How far along our lerp path we are
@System.NonSerialized
var lerpAmount:float;

// Ducks are briefly stunned after being shot, and become physics things
@System.NonSerialized
var stunTime:float;

function Start () {

}

function Update () {
    // If dead, just lie there like a lump. A duck lump
	if (health <= 0){
		rigidbody.useGravity = true;
	} 
	else if (stunTime > 0)
	{
		rigidbody.useGravity = true;
		stunTime -= Time.deltaTime;
	}
	else {
	// Be a duck and fly around
		// Assign a new target pos if we have hit ours already
		if (targetPos == null || targetPos == Vector3.one || Vector3.Distance(transform.position, targetPos) < 3.0){
			// Set our initial state
			startPos = transform.position;
		    lerpAmount = 0;
			// Pick a random point around the player by picking a random point on a unit sphere
			var unitTarget:Vector3 = Random.onUnitSphere;
			
			// Scale by some random distance from the player
			var randScale = Random.Range(minDistance, maxDistance);
			unitTarget *= randScale;	
			
			// Position the sphere over the player (since we want ducks to fly around the player)
			unitTarget += GameObject.Find("Player").transform.position;
			
			// Ensure we always have a positive y value and it never gets too high or low
			unitTarget.y = Mathf.Clamp(Mathf.Abs(unitTarget.y), 2, 10);
			
			targetPos = unitTarget;
			transform.LookAt(targetPos);
		}
		lerpAmount += Time.deltaTime * speed;
		// Move along our path
		transform.position = Vector3.Lerp(startPos, targetPos, lerpAmount);
	}
}


function ApplyDamage(amount: float){
	stunTime = .5;
	targetPos = Vector3.one;
	health -= amount;
}