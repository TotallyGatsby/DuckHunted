#pragma strict

class DogBehavior{
	var owner:TheDog;
	
	virtual function getMove()
	{
		return Vector3.zero;
	}
	
	// Check to see if we need to change states. Called prior to getMove
	virtual function checkState(){
	
	}
}

// Spirals around the player
// Transitions to: 
//     DogGetDuck -- If it senses a dead duck
class DogHuntPlayer extends DogBehavior{
	function getMove(){
		var diff = owner.player.transform.position - owner.transform.position;
	
		// This should give us a vector that is tangential to the player
		var move = Vector3.Normalize(Vector3.Cross(diff, Vector3.up));
		
		if (owner.isZigging){
			move *= -1;
			move = Quaternion.Euler(0,-owner.huntStrength,0) * move;	
		}
		else {
			move = Quaternion.Euler(0,owner.huntStrength,0) * move;	
		}
		
		// Make sure we don't start flying
		move.y = 0;
		move = move * owner.speed * Time.deltaTime;
		
		owner.speed += owner.huntAcceleration * Time.deltaTime;
		owner.zigTimer -= Time.deltaTime;
		
		if (owner.zigTimer < 0){
			owner.zigTimer = Random.Range(owner.minZigTime, owner.maxZigTime);
			owner.isZigging = !owner.isZigging;
		}
		
		if (owner.speed > owner.maxSpeed){
			owner.speed = owner.maxSpeed;
		}
		
		return move;
	}
	
	function checkState(){
		// Look for some dead ducks (Shhh... they're just sleeping!)
		for (var obj:Transform in DuckSpawner.ducks){
			var duck = obj.gameObject;
			var script = duck.GetComponent(Duck);
			if (script.isDead && Vector3.Distance(owner.transform.position, duck.transform.position) < owner.duckScentRadius){
				owner.setBehavior(new DogGetDuck(duck));
				break;
			}
		}
	}
}

class DogGetDuck extends DogBehavior{
	var target:GameObject;
	
	function DogGetDuck(target:GameObject){
		this.target = target;
	}
	
	function getMove(){
		var diff = target.transform.position - owner.transform.position;
		var move = Vector3.Normalize(diff) * owner.speed * Time.deltaTime;
		
		return move;
	}
	
	function checkState(){
	
	}
}

