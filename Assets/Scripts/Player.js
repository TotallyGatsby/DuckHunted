#pragma strict

// General Stuff
var score = 0;
var comboTime : float = 6.0; // Time between kills before a combo ends
var comboFactor : float = 0.25; // Score when killing duck = Score + (Combo * ComboFactor)

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

var gunDamage = 5.0;
var hitParticleSystemPrefab : Transform; // Prefab for Bullet Hit Particle system

var gunTransform : Transform;

// Combo system stuff
var comboTimer : float = 0.0;
var combo : int = 0;
var prevCombo : int = 0; // Combo value last frame (to check if changed)

public var bullets = 3;

// DEBUG
var explosion : Transform;

private var mouseLookScript : MouseLook;
private var characterMotor : CharacterMotor;

var levelStartSound: AudioClip;
var gameOverSound: AudioClip;

function Start () 
{
	gunDefaultPosition = gunTransform.localPosition; // Set Default position
	gunDefaultRotation = gunTransform.localEulerAngles; // Set Default rotation
	mouseLookScript = transform.GetComponent(MouseLook); // Get Mouse look script (For setting sensitivity when using zooming)
	characterMotor = transform.GetComponent(CharacterMotor);
	
	Global.options.gameObject.active = false;
	Global.leaderboards.gameObject.active = false;
	
	iTween.Stab(gameObject, {"audioclip":levelStartSound});
}

function Update () 
{
	comboTimer -=  1 * Time.deltaTime;
	
	if (Global.options.gameObject.active == false && Global.leaderboards.gameObject.active == false && Global.leaderboardsInput.gameObject.active == false)
	{
		Screen.lockCursor = true;
		mouseLookScript.enabled = true;
	}
	else
	{
		Screen.lockCursor = false;	
		mouseLookScript.enabled = false;
	}
	
	if (!isGameOver)
	{
		// Set combo timer to combo time when combo increases
		if (combo != prevCombo && combo != 0)
		{
			comboTimer = comboTime;
		}
		
		if (Input.GetKeyDown ("escape"))
	    Global.options.gameObject.active = !Global.options.gameObject.active;
		
		// Setting combo to zero when timer runs out
		if (comboTimer <= 0)
		{
			combo = 0;
		}
		
		if (defaultSensitivity != Global.sensitivity)
		{
			defaultSensitivity = Global.sensitivity;
			mouseLookScript.sensitivityX = defaultSensitivity;
			mouseLookScript.sensitivityY = defaultSensitivity * Global.invertModifier;
		}
		
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
					var fireRayDir : Vector3;
					if (gunZoom == false)
						fireRayDir = transform.forward+Vector3(Random.Range(-0.05, 0.05), Random.Range(-0.05, 0.05), Random.Range(-0.05, 0.05));
					else
						fireRayDir = transform.forward;

					var fireRay = new Ray(Camera.mainCamera.transform.position, fireRayDir);
					Debug.Log(transform.forward);
					var fireRayHit : RaycastHit;
					Debug.DrawRay (fireRay.origin, fireRayDir, Color.blue, 1);
					if (Physics.Raycast (fireRay, fireRayHit, 1000000))
					{
						Debug.DrawLine (fireRay.origin, fireRayHit.point, Color.red, 1);
						
						Instantiate(hitParticleSystemPrefab, fireRayHit.point, Quaternion.identity);
						
						if (fireRayHit.collider.CompareTag("Enemy"))
						{
							fireRayHit.collider.gameObject.GetComponent(Rigidbody).AddForce(transform.forward*1000);
							fireRayHit.collider.gameObject.SendMessage("ApplyDamage", gunDamage);
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
				mouseLookScript.sensitivityY = defaultSensitivity/zoomSensitivitySlowFactor * Global.invertModifier;
				
			}
			else if (gunZoom == false)
			{
				gunTransform.localPosition = Vector3.Lerp(gunTransform.localPosition, gunDefaultPosition, Time.deltaTime*gunZoomSpeed); 
				gunTransform.localEulerAngles.y = Mathf.LerpAngle(gunTransform.localEulerAngles.y, gunDefaultRotation.y, Time.deltaTime*gunZoomSpeed);
				gunTransform.localEulerAngles.z = Mathf.LerpAngle(gunTransform.localEulerAngles.z, gunDefaultRotation.z, Time.deltaTime*gunZoomSpeed);
				Camera.mainCamera.fov = Mathf.Lerp(Camera.mainCamera.fov, 60, Time.deltaTime*gunZoomSpeed);
				
				// Reset sensitivity when zooming out
				mouseLookScript.sensitivityX = defaultSensitivity;
				mouseLookScript.sensitivityY = defaultSensitivity * Global.invertModifier;
			}
		}
			
		/* Animation */
		if (!gunTransform.FindChild("Model").animation["Fire"].enabled && 
			!gunTransform.FindChild("Model").animation["Reload"].enabled && 
			!sprinting) // If no animation is playing, play Idle
		{
				gunTransform.FindChild("Model").animation.CrossFade("Idle", 0.5);
		}
		
		//Set prevCombo to combo
		prevCombo = combo;
	}
		
	// Death
	if (isGameOver == true && Global.leaderboardsInput.gameObject.active == false)
	{
			iTween.CameraFadeAdd();
			iTween.CameraFadeTo({
				"amount":1,
				"time": 2,
				"name": "gaveoverfade",
				"oncomplete":"GoToMenu",
				"oncompletetarget":gameObject
			});
	}
}

var isGameOver = false;

function DogSmack (){
	if ( !isGameOver){
		Global.score = score;
		characterMotor.enabled = false;
		mouseLookScript.enabled = false;
		isGameOver = true;
		Global.leaderboardsInput.gameObject.active = true;
		iTween.Stab(gameObject, {"audioclip":gameOverSound});
	}
}

function GoToMenu()
{
	Screen.lockCursor = false;
	Application.LoadLevel("mainmenu");
}