@script AddComponentMenu ("Camera-Control/Mouse Look")

enum RotationAxes { MouseXAndY = 0, MouseX = 1, MouseY = 2 }

var axes = RotationAxes.MouseXAndY;

var sensitivityX : float = 15;

var sensitivityY : float = 15;

 

var minimumX : float = -360;

var maximumX : float = 360;

 

var minimumY : float = -60;

var maximumY : float = 60;

 

var rotationX : float = 0;

var rotationY : float = 0;

 

private var originalRotation : Quaternion;

 

function Update () {

    if (axes == RotationAxes.MouseXAndY) {

        rotationX += Input.GetAxis("Mouse X") * sensitivityX;

        rotationY += Input.GetAxis("Mouse Y") * sensitivityY;

 

        rotationX = ClampAngle (rotationX, minimumX, maximumX);

        rotationY = ClampAngle (rotationY, minimumY, maximumY);

        

        var xQuaternion = Quaternion.AngleAxis (rotationX, Vector3.up);

        var yQuaternion = Quaternion.AngleAxis (rotationY, Vector3.left);

        

        transform.localRotation = originalRotation * xQuaternion * yQuaternion;

    }

    else if (axes == RotationAxes.MouseX) {

        rotationX += Input.GetAxis("Mouse X") * sensitivityX;

        rotationX = ClampAngle (rotationX, minimumX, maximumX);

 

        xQuaternion = Quaternion.AngleAxis (rotationX, Vector3.up);

        transform.localRotation = originalRotation * xQuaternion;

    }

    else {

        rotationY += Input.GetAxis("Mouse Y") * sensitivityY;

        rotationY = ClampAngle (rotationY, minimumY, maximumY);

 

        yQuaternion = Quaternion.AngleAxis (rotationY, Vector3.left);

        transform.localRotation = originalRotation * yQuaternion;

    }

}

 

function Start () {

    if (rigidbody)

        rigidbody.freezeRotation = true;

    originalRotation = transform.localRotation;

}

 

static function ClampAngle (angle : float, min : float, max : float) : float {

    if (angle < -360.0)

        angle += 360.0;

    if (angle > 360.0)

        angle -= 360.0;

    return Mathf.Clamp (angle, min, max);

}