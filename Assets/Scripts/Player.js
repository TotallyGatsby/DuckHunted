#pragma strict

// Movement Stuff
var defaultSpeed = 6;
var defaultAcceleration = 20;
var sprintSpeed = 12;
var sprintAcceleration = 40;

var sprinting = false;

// Gun stuff
var gunZoomSpeed = 15; // How fast you pull up the iron sight
var defaultSensitivity = 10; // Standard sensitivity
var zoomSensitivitySlowFactor = 5; // How much mouse sensitivity is divided when zooming in

var gunDefaultPosition : Vector3; // Default Position &
var gunDefaultRotation : Vector3; // Rotation of gun
var gunZoomPosition : Vector3 = Vector3(0, -0.15, 0.85); // Zoomed in Position &
var gunZoomRotation : Vector3 = Vector3(0, 90, 0); // Rotation of gun
var gunZoom = false; // Whatever the gun is zoomed in or not

var gunTransform : Transform;

public var bullets = 3;

// Flashlight
var flashlightOn = false; // Whatever the flashlight is on or not

var flashlightTransform : Transform;


//var parentTransform : Transform;
private var mouseLookScript : MouseLook;
private var characterMotor : CharacterMotor;


function Start () 
{
	gunDefaultPosition = gunTransform.localPosition; // Set Default position
	gunDefaultRotation = gunTransform.localEulerAngles; // Set Default rotation
	mouseLookScript = transform.GetComponent(MouseLook); // Get Mouse look script (For setting sensitivity when using zooming)
	characterMotor = transform.GetComponent(CharacterMotor);
}

function Update () 
{
	Screen.lockCursor = true; // Captures the mouse cursor
	
	/* Movement */
	
	// Sprint
	if (Input.GetButtonDown("Sprint"))
	{
		sprinting = true;
		characterMotor.movement.maxForwardSpeed = sprintSpeed;
		characterMotor.movement.maxSidewaysSpeed = defaultSpeed / 2;
		characterMotor.movement.maxBackwardsSpeed = 0;
		characterMotor.movement.maxGroundAcceleration = sprintAcceleration;
		gunTransform.FindChild("Model").animation.CrossFade("Run", 0.25);
		
	}
	else if (Input.GetButtonUp("Sprint"))
	{
		sprinting = false;
		characterMotor.movement.maxForwardSpeed = defaultSpeed;
		characterMotor.movement.maxSidewaysSpeed = defaultSpeed;
		characterMotor.movement.maxBackwardsSpeed = defaultSpeed;
		characterMotor.movement.maxGroundAcceleration = defaultAcceleration;
	}

	/* Gun Stuff */
	
	// Fire
	if (!sprinting) // Can't fire or zoom while sprinting
	{
		if (Input.GetButtonDown("Fire1") && !gunTransform.FindChild("Model").animation["Fire"].enabled && !gunTransform.FindChild("Model").animation["Reload"].enabled)
		{
			if (bullets > 0)
			{
				gunTransform.FindChild("Model").animation.Play("Fire"); // Play firing animation, which in turns activates muzzle flash and gun sound
				
				// Raycasting
				var fireRay = new Ray(Camera.mainCamera.transform.position, transform.forward);
				var fireRayHit : RaycastHit;
				Debug.DrawRay (fireRay.origin, transform.forward, Color.blue, 1);
				if (Physics.Raycast (fireRay, fireRayHit, 1000000))
				{
					Debug.DrawLine (fireRay.origin, fireRayHit.point, Color.red, 1);
					if (fireRayHit.collider.CompareTag("Enemy"))
					{
						fireRayHit.collider.gameObject.GetComponent(Rigidbody).AddForce(transform.forward*1000);
					}
				}
				//
				
				bullets -= 1; // Subtract bullet
			}
			else // Auto Reload
				gunTransform.FindChild("Model").animation.CrossFade("Reload", 0.25); // Plays reload animation, which in turns triggers the reload
		}
		
		// Manual Reload
		if (Input.GetButtonDown("Reload"))
			gunTransform.FindChild("Model").animation.CrossFade("Reload", 0.25); // Plays reload animation, which in turns triggers the reload
	
	
		// Zoom
		if (Input.GetButtonDown("Fire2"))
		{
			//if (gunTransform.FindChild("Model").animation["Idle"].enabled)
				//gunTransform.FindChild("Model").animation.Stop();
			gunZoom = true;
		}
	
		else if (Input.GetButtonUp("Fire2"))
			gunZoom = false;
		
		if (gunZoom == true)
		{
			gunTransform.localPosition = Vector3.Lerp(gunTransform.localPosition, gunZoomPosition, Time.deltaTime*gunZoomSpeed);
			gunTransform.localEulerAngles.y = Mathf.LerpAngle(gunTransform.localEulerAngles.y, gunZoomRotation.y, Time.deltaTime*gunZoomSpeed);
			gunTransform.localEulerAngles.z = Mathf.LerpAngle(gunTransform.localEulerAngles.z, gunZoomRotation.z, Time.deltaTime*gunZoomSpeed);
			Camera.mainCamera.fov = Mathf.Lerp(Camera.mainCamera.fov, 30, Time.deltaTime*gunZoomSpeed);
			
			// Adjust sensitivity when zoomed in
			mouseLookScript.sensitivityX = defaultSensitivity/zoomSensitivitySlowFactor;
			mouseLookScript.sensitivityY = defaultSensitivity/zoomSensitivitySlowFactor;
			
		}
		else if (gunZoom == false)
		{
			gunTransform.localPosition = Vector3.Lerp(gunTransform.localPosition, gunDefaultPosition, Time.deltaTime*gunZoomSpeed); 
			gunTransform.localEulerAngles.y = Mathf.LerpAngle(gunTransform.localEulerAngles.y, gunDefaultRotation.y, Time.deltaTime*gunZoomSpeed);
			gunTransform.localEulerAngles.z = Mathf.LerpAngle(gunTransform.localEulerAngles.z, gunDefaultRotation.z, Time.deltaTime*gunZoomSpeed);
			Camera.mainCamera.fov = Mathf.Lerp(Camera.mainCamera.fov, 60, Time.deltaTime*gunZoomSpeed);
			
			// Reset sensitivity when zooming out
			mouseLookScript.sensitivityX = defaultSensitivity;
			mouseLookScript.sensitivityY = defaultSensitivity;
		}
	}
	
	/* Flashlight */
	if (Input.GetButtonDown("Flashlight"))
		flashlightOn = !flashlightOn; // Switch flashlight on/off
		
	if (flashlightOn == true)
		flashlightTransform.GetComponent(Light).active = true;
	else if (flashlightOn == false)
		flashlightTransform.GetComponent(Light).active = false;
	
	
	/* Animation */
	if (!gunTransform.FindChild("Model").animation["Fire"].enabled && !gunTransform.FindChild("Model").animation["Reload"].enabled && !sprinting) // If no animation is playing, play Idle
	{
			gunTransform.FindChild("Model").animation.CrossFade("Idle", 0.5);
	}

}