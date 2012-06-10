#pragma strict

var health:float = 10.0;
var speed: float = .15;

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

// How far along our lerp path we are
@System.NonSerialized
var lerpAmount:float;

// Ducks are briefly stunned after being shot, and become physics things
@System.NonSerialized
var stunTime:float;

// Is dis duckie dead?
@System.NonSerialized
var isDead = false;
var hasPlayedThud = false;
var fallClip : AudioClip;
var thudClip : AudioClip;


private var model : Transform;

function Start () {
	model = transform.FindChild("Model");
	duckCount++;
	Debug.Log(duckCount);
	
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
		rigidbody.useGravity = true;
		duckCount--;
		
		transform.localEulerAngles = Vector3(90, 0, 0);
		audio.clip = fallClip;
		audio.Play(0.25);
		audio.pitch = 1;
		
		isDead = true;
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
			unitTarget.y = Mathf.Clamp(Mathf.Abs(unitTarget.y), minFlight, maxFlight);
			
			targetPos = unitTarget;
		}
		quackTime -= Time.deltaTime;
		
		if (quackTime < 0){
			transform.FindChild("Model").animation.Play("Quack");
			audio.Play(0);
			quackTime += Random.Range(minQuack, maxQuack);
		}
		else
			transform.FindChild("Model").animation.Play("Flap"); // Flap those wings
		
		transform.LookAt(targetPos);
		lerpAmount += Time.deltaTime * speed;
		// Move along our path
		transform.position = Vector3.Lerp(startPos, targetPos, lerpAmount);
	}
}


function ApplyDamage(amount: float){
	stunTime = stunLength;
	
	transform.FindChild("Model").animation.Play("Quack");
	audio.Play(0);
	quackTime += Random.Range(minQuack, maxQuack);
	
	targetPos = Vector3.one;
	health -= amount;
}