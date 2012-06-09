#pragma strict

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

// Flashlight
var flashlightOn = false; // Whatever the flashlight is on or not

var flashlightTransform : Transform;


//var parentTransform : Transform;
private var mouseLookScript : MouseLook;


function Start () 
{
	gunDefaultPosition = gunTransform.localPosition; // Set Default position
	gunDefaultRotation = gunTransform.localEulerAngles; // Set Default rotation
	mouseLookScript = transform.GetComponent(MouseLook); // Get Mouse look script (For setting sensitivity when using zooming)
}

function Update () 
{

	/* Gun Stuff */
	// Zoom
	if (Input.GetButtonDown("Fire2"))
		gunZoom = true;

	else if (Input.GetButtonUp("Fire2"))
		gunZoom = false;
	
	if (gunZoom == true)
	{
		gunTransform.localPosition = Vector3.Lerp(gunTransform.localPosition, gunZoomPosition, Time.deltaTime*gunZoomSpeed);
		gunTransform.localEulerAngles.y = Mathf.LerpAngle(gunTransform.localEulerAngles.y, gunZoomRotation.y, Time.deltaTime*gunZoomSpeed);
		Camera.mainCamera.fov = Mathf.Lerp(Camera.mainCamera.fov, 30, Time.deltaTime*gunZoomSpeed);
		mouseLookScript.sensitivityX = defaultSensitivity/zoomSensitivitySlowFactor;
		mouseLookScript.sensitivityY = defaultSensitivity/zoomSensitivitySlowFactor;
	}
	else if (gunZoom == false)
	{
		gunTransform.localPosition = Vector3.Lerp(gunTransform.localPosition, gunDefaultPosition, Time.deltaTime*gunZoomSpeed); 
		gunTransform.localEulerAngles.y = Mathf.LerpAngle(gunTransform.localEulerAngles.y, gunDefaultRotation.y, Time.deltaTime*gunZoomSpeed);
		Camera.mainCamera.fov = Mathf.Lerp(Camera.mainCamera.fov, 60, Time.deltaTime*gunZoomSpeed);
		mouseLookScript.sensitivityX = defaultSensitivity;
		mouseLookScript.sensitivityY = defaultSensitivity;
	}
	
	/* Flashlight */
	if (Input.GetButtonDown("Flashlight"))
		flashlightOn = !flashlightOn; // Switch flashlight on/off
		
	if (flashlightOn == true)
		flashlightTransform.GetComponent(Light).active = true;
	else if (flashlightOn == false)
		flashlightTransform.GetComponent(Light).active = false;

}