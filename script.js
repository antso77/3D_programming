/*ANTTI ASTIKAINEN 1101552 3D PROGRAMMING*/
var scene = new THREE.Scene(); // REATE THREE JS SCENE
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // PERSPECTIVE CAMERA
var renderer = new THREE.WebGLRenderer(); 
renderer.setSize(window.innerWidth, window.innerHeight); // SET RENDERER SIZE TO BE SAME AS SIZE OF INNER BROWSER WINDOW
document.body.appendChild(renderer.domElement); // ATTACH CANVAS ELEMENT TO BODY ELEMENT INSIDE WEB PAGE
var sceneLoader = new THREE.ObjectLoader(); // CREATING LOADER THAT WE WILL USE TO LOAD MESHES (SCENE)
sceneLoader.load("scene/scene.json", sceneLoaded); // LOAD SCENE FILE (MESHES)
var directionalLight = new THREE.DirectionalLight( 0xE6F3F7, 1.0 ); // DIRECTIONAL LIGHT INITIALIZATION
directionalLight.position.set( 1, -1, 1 ); 
var light = new THREE.SpotLight(0x00ff00); // SPOT LIGHT INITIALIZATIOn
light.position.set(0, 5, 0);
light.angle = 0.5;
light.intensity = 2;
light.penumbra = 0.15;
var urlPrefix = "./assets/skybox/"; // here we LOAD SKYBOX TEXTURES
var urls = [urlPrefix + "posx.png", urlPrefix + "negx.png",
    urlPrefix + "posy.png", urlPrefix + "negy.png",
    urlPrefix + "posz.png", urlPrefix + "negz.png"];
var cubeTexture = new THREE.CubeTextureLoader(); // CREATE CUBE TEXTURE LOADER
var textureCube = cubeTexture.load(urls); // LOAD SKYBOX TEXTURES INSIDE CUBE TEXTURE
var shader = THREE.ShaderLib["cube"]; // USING CUBE TEXTURE WE CREATED WE CREATE SKYBOX 
var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
uniforms['tCube'].texture = textureCube;
var material = new THREE.ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: uniforms
});
// BUILD THE SKYBOX MESH 
var skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(100000, 100000, 100000, 1, 1, 1), material);
// ADD IT TO THE SCENE
scene.add(skyboxMesh); // ADD SKYBOX MESH
scene.add(directionalLight);// ADD DIRECTIONAL LIGHT TO SCENE
scene.add(light); // ADD SPOTLIGHT TO SCENE

var upperArm = new THREE.BoxGeometry(0.45, 1.75, 0.45); // CREATE GEOMETRY FOR ARM PARTS
var lorArm = new THREE.BoxGeometry(0.45, 1.75, 0.45);
var sphere = new THREE.SphereGeometry(0.8, 30, 30);
var sphereSmall = new THREE.SphereGeometry(0.5, 30, 30);
var hand = new THREE.BoxGeometry(0.9, 0.9, 0.7);
var finger = new THREE.BoxGeometry(0.15, 0.5, 0.15); //  ONLY CREATE ON GEOMETRY FOR FINGER SINCE  THEY ARE ALL SAME

hand.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0)); //  MOVE POINT OF HAND SO IT ROTATES AROUND BASE

var green = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); //  CREATE DIFFERENT MATERILAS (COLORS) FOR PARTS OF THE HAND
var red = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var pink = new THREE.MeshBasicMaterial({ color: 0xff85f1 });
var yellow = new THREE.MeshBasicMaterial({ color: 0xfffB00 });
var blue = new THREE.MeshBasicMaterial({ color: 0x0000ff });
var paleOrange = new THREE.MeshBasicMaterial({ color: 0xffe4a8 });

var shoulderMesh = new THREE.Mesh(sphere, red); //  CREATE OBJECTS THAT WILL RENDER USING GEOMETRY AND MATERIALS
var upperArmMesh = new THREE.Mesh(upperArm, green);
var elbowMesh = new THREE.Mesh(sphereSmall, pink);
var lorArmMesh = new THREE.Mesh(lorArm, yellow);
var handMesh = new THREE.Mesh(hand, blue);
var fingerOne = new THREE.Mesh(finger, paleOrange);
var fingerTwo = new THREE.Mesh(finger, paleOrange);
var fingerThree = new THREE.Mesh(finger, paleOrange);
var fingerThumb = new THREE.Mesh(finger, paleOrange);

fingerThumb.rotation.z = Math.PI / 2; //  ROTATE THUMB FINGER 

// CREATE HAND COMPOSITION
shoulderMesh.add(upperArmMesh); // SHOULDER IS PARENT OF UPPER ARM
upperArmMesh.add(elbowMesh); // UPPER ARM IS PARENT OF ELBOW 
elbowMesh.add(lorArmMesh); // ELBOW IS PARRENT OF LOR ARM
lorArmMesh.add(handMesh); // LOR ARM IS PARENT OF HAND
handMesh.add(fingerOne); // HAND IS PARENT OF FINGER ONE 
handMesh.add(fingerTwo); // HAND IS PARENT OF FINGER TWO
handMesh.add(fingerThree); // HAND IS PARENT OF FINGER THREE
handMesh.add(fingerThumb); // HAND IS PARENT OF FINGER THUMB

scene.add(shoulderMesh); //  ADD SHOULDER MESH (OTHER OBJECTS ARE ALSO ADDED SINCE THEY ARE CHILDREN OF SHOULDER)

camera.position.x = 9; //  SET CAMERA POSITION 
camera.position.y = 4.5;
camera.position.z = 8;
camera.lookAt(new THREE.Vector3(1, 3, 0)); //  SET POINT FOR CAMERA VIEW

// VARIABLES FOR ROTATION
var shoulderRotation = 0.0; // UPPER HAND ROTATION
var elbowRotation = 0.0; // LOWER ARM ROTATION
var handRotation = 0.0; // HAND ROTATION

shoulderMesh.position.x = 0.0; // SET INITIAL VALUES FOR HAND PARTS 
shoulderMesh.position.y = -3.6;
shoulderMesh.position.z = 0.0;

upperArmMesh.position.x = 0.0;
upperArmMesh.position.y = 1.5;
upperArmMesh.position.z = 0.0;

elbowMesh.position.x = 0.0;
elbowMesh.position.y = 1.25;
elbowMesh.position.z = 0.0;

lorArmMesh.position.x = 0.0;
lorArmMesh.position.y = 1.25;
lorArmMesh.position.z = 0.0;

handMesh.position.x = 0.0;
handMesh.position.y = 0.6;
handMesh.position.z = 0.0;

fingerOne.position.x = -0.3;
fingerOne.position.y = 1.17;
fingerOne.position.z = 0.0;

fingerTwo.position.x = 0.0;
fingerTwo.position.y = 1.17;
fingerTwo.position.z = 0.0;

fingerThree.position.x = 0.3;
fingerThree.position.y = 1.17;
fingerThree.position.z = 0.0;

fingerThumb.position.x = 0.6;
fingerThumb.position.y = 0.6;
fingerThumb.position.z = 0.0;

requestAnimationFrame(render); // START RENDER LOOP
function render() {
    requestAnimationFrame(render); // REQUEST NEW FRAME EACH TIME WE RENDER (THIS IS EXECUTED 60 TIMES PER SECOND)
    shoulderRotation += 0.01; //UPPER HAND ROTATION TO EACH FRAME
    shoulderMesh.rotation.z = Math.sin(shoulderRotation) / 1.5; // CALCULATE ACTUAL SHOULDER ROTATION USING SIN FUNCTION
    elbowRotation += 0.01; // ADD LOWER HAND ROTATION EACH FRAME
    elbowMesh.rotation.z = Math.sin(elbowRotation) / 1.5; // CALCULATE ELBOW ROTATION USING SIN FUNCTION
    if (drag == true) {
        if ((mouseX - oldMouseX) > 0) {
            handRotation -= 0.015;
        }
        else if ((mouseX - oldMouseX) < 0) {
            handRotation += 0.015;
        }
        handMesh.rotation.x = handRotation; // SET ACTUAL HAND ROTATION TO BE VALUE WE CALCULATED BY DRAGGIN MOUSE
        oldMouseX = mouseX; // SAVE CURRENT MOUSE POSITION (IT WILL BE OLD IN NEXT FRAME)
        if (handRotation < -0.7)
            handRotation = -0.7;
        if (handRotation > 0.7)
            handRotation = 0.7;
    }
    renderer.render(scene, camera); // RENDER SCENE USING CAMERA
}
function sceneLoaded(obj) {
    scene.add(obj);
}
var oldMouseX = 0; 
var mouseX = 0; 
var drag = false; 
addEventListener("mousedown", function (event) {
    drag = true;
});
addEventListener("mouseup", function (event) {
    drag = false;
});
addEventListener("mousemove", function (event) {
    mouseX = event.clientX;
});
