#pragma strict
var ironsightSpeed = 15;
var defaultPosition : Vector3;
var defaultRotation : Vector3;
var ironsightPosition : Vector3;
var ironsightRotation : Vector3;
var ironsight = false;
var parentTransform : Transform;
private var mouseLookScript : MouseLook;


function Start () 
{
	
	defaultPosition = transform.localPosition; // Set Default position
	defaultRotation = transform.localEulerAngles; // Set Default rotation
	mouseLookScript = parentTransform.GetComponent(MouseLook); // Get Mouse look script (For setting sensitivity when using ironsight)
}

function Update () 
{
	if (Input.GetButtonDown("Fire2"))
		ironsight = true;

	else if (Input.GetButtonUp("Fire2"))
		ironsight = false;
	
	if (ironsight == true)
	{
		transform.localPosition = Vector3.Lerp(transform.localPosition, ironsightPosition, Time.deltaTime*ironsightSpeed);
		transform.localEulerAngles.y = Mathf.LerpAngle(transform.localEulerAngles.y, ironsightRotation.y, Time.deltaTime*ironsightSpeed);
		Camera.mainCamera.fov = Mathf.Lerp(Camera.mainCamera.fov, 30, Time.deltaTime*ironsightSpeed);
		mouseLookScript.sensitivityX = 2;
		mouseLookScript.sensitivityY = 2;
	}
	else if (ironsight == false)
	{
		transform.localPosition = Vector3.Lerp(transform.localPosition, defaultPosition, Time.deltaTime*ironsightSpeed); 
		transform.localEulerAngles.y = Mathf.LerpAngle(transform.localEulerAngles.y, defaultRotation.y, Time.deltaTime*ironsightSpeed);
		Camera.mainCamera.fov = Mathf.Lerp(Camera.mainCamera.fov, 60, Time.deltaTime*ironsightSpeed);
		mouseLookScript.sensitivityX = 10;
		mouseLookScript.sensitivityY = 10;
	}
}