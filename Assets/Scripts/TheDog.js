#pragma strict

@System.NonSerialized
var player:GameObject;

@System.NonSerialized
var zigTimer:float;

@System.NonSerialized
var isZigging = false;


// How long before the dog changes directions
var maxZigTime:float = 25;
var minZigTime:float = 5;

var speed:float 			= 2; // Dog's current/starting speed
var maxSpeed:float 			= 10; // Dog's maximum speed
var huntStrength:float 		= 5; 	// How quickly the dog turns to the player
var huntAcceleration:float 	= .25; 	// How quickly the hound speeds up

// TODO: Maybe this is a property of ducks? So bigger ducks are easier to shoot, but aren't
// as alluring to the dog?
var duckScentRadius:float = 20; // How far away the dog can sense ducks

var playerScentRadius:float = 10; // How far away the dog can sense the player's exact location for a charge!

function Start () {
	player = GameObject.Find("Player");
	zigTimer = Random.Range(minZigTime, maxZigTime);
}

function Update () {
	var diff = player.transform.position - transform.position;
	
	// This should give us a vector that is tangential to the player
	var move = Vector3.Normalize(Vector3.Cross(diff, Vector3.up));
	
	if (isZigging){
		move *= -1;
		move = Quaternion.Euler(0,-huntStrength,0) * move;	
	}
	else {
		move = Quaternion.Euler(0,huntStrength,0) * move;	
	}
	
	// Make sure we don't start flying
	move.y = 0;
	move = move * speed * Time.deltaTime;
	
	Debug.DrawLine(transform.position, transform.position+move, Color.green, 1);
	transform.position += move;
	
	speed += huntAcceleration * Time.deltaTime;
	
	zigTimer -= Time.deltaTime;
	
	if (zigTimer < 0){
		zigTimer = Random.Range(minZigTime, maxZigTime);
		isZigging = !isZigging;
	}
	
	if (speed > maxSpeed){
		speed = maxSpeed;
	}
	
	if (Vector3.Distance(transform.position, player.transform.position) < playerScentRadius &&
		!audio.isPlaying){
		audio.Play(0);
	}
}

function OnDrawGizmos(){
	Gizmos.color = Color.blue;
	Gizmos.DrawWireSphere(transform.position, duckScentRadius);
	
	Gizmos.color = Color.yellow;
	Gizmos.DrawWireSphere(transform.position, playerScentRadius);
}