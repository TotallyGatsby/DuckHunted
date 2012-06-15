#pragma strict

var health:float = 10.0;
var speed: float = 3;
var scoreValue = 100;
var explodes = false; // Does it explode when killed?

// Min and Max scale
var minScale: float = 1;
var maxScale: float = 1;

var stunLength:float = 1.0;

// Min and Max distance the duck will fly near the player
var minDistance: float = 10;
var maxDistance: float = 20;

// Min and max height the duck will fly
var minFlight: float = 2;
var maxFlight: float = 6;

// Min and Max times between quacks
// TODO: Move this to a specialized component?
var minQuack: float = 1;
var maxQuack: float = 5;

// Current quacktimer
@System.NonSerialized
var quackTime: float = 2;

// Where this duck wants to fly
@System.NonSerialized
var targetPos:Vector3 = Vector3.one;
@System.NonSerialized
var startPos:Vector3;

// Number of living ducks
@System.NonSerialized
static var duckCount:int = 0;

// Ducks are briefly stunned after being shot, and become physics things
@System.NonSerialized
var stunTime:float;

// Is dis duckie dead?
@System.NonSerialized
var isDead = false;

// Has this duck been claimed by a dog
@System.NonSerialized
var isClaimed = false;

var hasPlayedThud = false;
var fallClip : AudioClip;
var thudClip : AudioClip;

// Prefabs
var textMesh : Transform;
var explosion : Transform;

private var model : Transform;
private var player : Transform;

function Start () {
	model = transform.FindChild("Model");
	duckCount++;
	
	// Find player (So ducks don't have to search after "Player" so much)
	player = GameObject.Find("Player").transform;
	
	// Set scale
	var scale = Random.Range(minScale, maxScale);
	transform.localScale = Vector3(scale, scale, scale);
	
	// Animation Layers
	model.animation["Quack"].layer = 1;
	model.animation.Stop();
}

function Update () {
	
	if (isDead){
		
		if (hasPlayedThud == false)
		{
			transform.Rotate(Vector3(45 * Time.deltaTime, 0, 180 * Time.deltaTime));
			var groundRay = new Ray(transform.position, Vector3.down);
			var groundRayHit : RaycastHit;
			if (Physics.Raycast (groundRay, groundRayHit, 1))
			{
				Debug.DrawLine (groundRay.origin, groundRayHit.point, Color.red, 1);
				audio.clip = thudClip;
				audio.Play(0);
				audio.pitch = 1;
				hasPlayedThud = true;
			}
		}
		
		
		return;
	}
	
    // If dead, just lie there like a lump. A duck lump
	if (health <= 0 && !isDead){
		Death();
	} 
	else if (stunTime > 0){
		rigidbody.useGravity = true;
		stunTime -= Time.deltaTime;
	}
	else {
	// Be a duck and fly around
		if (iTween.Count(gameObject) == 0){
			GetTargetPosition();
		}
		// Assign a new target pos if we have hit ours already
		if (targetPos == null || targetPos == Vector3.one || Vector3.Distance(transform.position, targetPos) < 3.0){			
			
			GetTargetPosition();
		}
		quackTime -= Time.deltaTime;
		
		if (quackTime < 0){
			transform.FindChild("Model").animation.Play("Quack");
			audio.Play(0);
			quackTime += Random.Range(minQuack, maxQuack);
		}
		else
		{
			transform.FindChild("Model").animation.Play("Flap"); // Flap those wings
			transform.LookAt(targetPos);
		}
	}
}

function GetTargetPosition(){
	// Set our initial state
	startPos = transform.position;
	
	// New plan!
	// Pick a random point around the player by picking a random point on a unit sphere
	var unitTarget:Vector3 = Random.onUnitSphere;
	
	// Remove the y component altogether
	unitTarget.y = 0;
	unitTarget = Vector3.Normalize(unitTarget);
	
	// Scale by some random distance from the player
	var randScale = Random.Range(minDistance, maxDistance);
	unitTarget *= randScale;	
	
	// Position the circle over the player (since we want ducks to fly around the player)
	unitTarget += player.position;
	
	// Temporarily move our position up
	unitTarget.y = 100;
	// This has effectively given us a point on a ring around the player, but we need a y value
	// Figure out the height of the floor
	var floorRay = new Ray(unitTarget, Vector3.down);
	var floorRayHit: RaycastHit;
	
	Physics.Raycast(floorRay, floorRayHit, 200);
	
	// Now, we don't want to go through the floor
	var minFlightRelative:float = minFlight + floorRayHit.point.y;
	
	// And we don't want ducks going too high either
	var maxFlightRelative : float = maxFlight + floorRayHit.point.y;
											
	// Ensure we always have a positive y value and it never gets too high or low
	unitTarget.y = Random.Range(minFlightRelative, maxFlightRelative);
	
	targetPos = unitTarget;
	
	// Raycasting
	var fireRay = new Ray(transform.position, targetPos-transform.position);
	var fireRayHit : RaycastHit;
	if (Physics.Raycast (fireRay, fireRayHit, 1000000)){
		// The duck is trying to fly through something, call it back 3 units
		targetPos = fireRayHit.point - (Vector3.Normalize(fireRayHit.point-targetPos) * 5);
		Debug.DrawLine(transform.position, targetPos, Color.red, 1, false);	
	}
	
	iTween.MoveTo(gameObject, {"position":targetPos, 
								"orienttopath":true, 
								"speed":speed, 
								"easetype":"linear",
								"oncomplete":"GetTargetPosition", 
								"oncompletetarget":gameObject});
}


function ApplyDamage(amount: float){
	iTween.Stop(gameObject);
	stunTime = stunLength;
	
	transform.FindChild("Model").animation.Play("Quack");
	audio.Play(0);
	quackTime += Random.Range(minQuack, maxQuack);
	
	targetPos = Vector3.one;
	health -= amount;
}

function Death() 
{
	iTween.Stop(gameObject);
	rigidbody.useGravity = true;
	duckCount--;
	
	transform.localEulerAngles = Vector3(90, 0, 0);
	audio.clip = fallClip;
	audio.Play(0.25);
	audio.pitch = 1;
	
	// Show score value		
	var totalScoreValue : int = scoreValue + (scoreValue * (player.GetComponent(Player).combo * player.GetComponent(Player).comboFactor));
	
	var textScoreMesh = Instantiate(textMesh, transform.position, Camera.mainCamera.transform.rotation);
	textScoreMesh.transform.GetComponent(TextMesh).text = totalScoreValue.ToString();
	
	player.GetComponent(Player).score += totalScoreValue;
	player.GetComponent(Player).combo += 1;
	
	if (explodes == true)
	{
		DuckSpawner.RemoveDuck(gameObject);
		Debug.Log("Explosion!!");
		Instantiate(explosion, transform.position, Quaternion.identity);
		Destroy(gameObject);
	}
		
	
	isDead = true;
}

function OnTriggerEnter(collider : Collider)
{
	if (collider.transform.name == "Explosion")
	{
		// Better to use the damage method
		ApplyDamage(500);
		// Ensures we always kill ducks the same way
	}
}