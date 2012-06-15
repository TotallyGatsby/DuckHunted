#pragma strict

@System.NonSerialized
var player:GameObject;

@System.NonSerialized
var zigTimer:float;

@System.NonSerialized
var isZigging = false;

@System.NonSerialized
var behaviorState:DogBehavior;

// How long before the dog changes directions
var maxZigTime:float = 25;
var minZigTime:float = 5;

var speed:float 			= 2; // Dog's current/starting speed
var maxSpeed:float 			= 10; // Dog's maximum speed
var huntStrength:float 		= 5; 	// How quickly the dog turns to the player
var huntAcceleration:float 	= .25; 	// How quickly the hound speeds up

// Sound clip played when the dog begins to present his trophy duck
var presentSound:AudioClip;
// Sound clip played when the dog is about to pounce!
var announceSound:AudioClip;

// TODO: Maybe this is a property of ducks? So bigger ducks are easier to shoot, but aren't
// as alluring to the dog?
var duckScentRadius:float = 20; // How far away the dog can sense ducks

var playerScentRadius:float = 10; // How far away the dog can sense the player's exact location for a charge!

var grassParticle:ParticleSystem;

function Start () {
	player = GameObject.Find("Player");
	zigTimer = Random.Range(minZigTime, maxZigTime);
	setBehavior(new DogHuntPlayer());
	gameObject.audio.Play(0);
}

function Update () {
	behaviorState.checkState();
	
	var move = behaviorState.getMove();
	
	Debug.DrawLine(transform.position, transform.position+move, Color.green, 1);
	
	if (grassParticle.isPlaying && Vector3.Magnitude(move/Time.deltaTime) < .5){
		grassParticle.Stop();
	} 
	else if (!grassParticle.isPlaying && Vector3.Magnitude(move/Time.deltaTime) > .5){
		grassParticle.Play();
	}
	else {
		grassParticle.startSpeed = (speed/maxSpeed) * 10;
	}
	
	if (move != Vector3.zero){
		transform.LookAt(transform.position+move, Vector3.up);
		transform.position += move;
	}
}

function Launch(){
	rigidbody.AddForce(gameObject.transform.forward * 2500);
}

function setBehavior(behavior:DogBehavior){
	behaviorState = behavior;
	behavior.owner = this;
}

function OnDrawGizmos(){
	if (behaviorState != null){
		behaviorState.drawGizmos();
	}
}

function OnCollisionEnter(info:Collision){
	if (info.collider.tag == "Player"){
		info.collider.SendMessage("DogSmack");
	}
}