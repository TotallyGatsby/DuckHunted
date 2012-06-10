#pragma strict

@System.NonSerialized
var player:GameObject;

@System.NonSerialized
var zigTimer:float;

@System.NonSerialized
var isZigging = false;

var maxZigTime:float = 25;
var minZigTime:float = 5;

var speed:float 			= 2;
var maxSpeed:float 			= 10;
var huntStrength:float 		= 5; 	// How quickly the dog turns to the player
var huntAcceleration:float 	= .25; 	// How quickly the hound speeds up


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
}