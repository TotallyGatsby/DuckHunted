#pragma strict

function OnTriggerEnter(other:Collider){
	iTween.PunchRotation(gameObject, {"y":45, "time":6, 
										"oncomplete":"SoftPunch", 
										"oncompletetarget":gameObject});
}

function OnTriggerExit(other:Collider){
	iTween.PunchRotation(gameObject, {"y":45, "time":6, 
										"oncomplete":"SoftPunch", 
										"oncompletetarget":gameObject});
}

function SoftPunch(){
	iTween.PunchRotation(gameObject, {"y":Random.Range(-6, 6), 
										"time":Random.Range(8,10), 
										"oncomplete":"SoftPunch", 
										"oncompletetarget":gameObject});
}