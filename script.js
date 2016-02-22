//Antti Astikainen 1101552 3D pgromming module 3
///<reference path="gl-matrix.d.ts" />
var canvas; 
var gl; 
var shader; 
var camera; // THIS IS CAMERA OBJECT
function main() {
    initWebGL(); // INITIALIZE WEBGL CONTEXT WITH THIS FUNCTION
    var scene = new Scene(); //THIS IS SCENE OBJECT
    requestAnimationFrame(animationLoop); // CALLING ANIMATIONLOOP FUNCTION
    function animationLoop() {
        resize(); // RESIZE METHOD IN CASE BROWSER WINDOW RESISING
        scene.update(); // UPDATE OBJECT POSITIONS
        scene.draw(); // DRAW OBJECTS IN SCENE IN LOOP
        requestAnimationFrame(animationLoop); // REQUEST ANIMATIONLOOP
    }
    ;
}
var Scene = (function () {
    function Scene() {
        shader = new ShaderProgram("shader-vs", "shader-fs");
        camera = new Camera(); // CREATE NEW CAMERA OBJECT 
        //INITIALIZE PLANES WITH VALUES
        // PARAMETERS
        this.posx = new Plane(100, 0, 0, 0, -Math.PI / 2, 0, 200, "posx");
        this.posy = new Plane(0, 100, 0, -Math.PI / 2, 0, 0, 200, "posy");
        this.posz = new Plane(0, 0, -100, 0, 0, 0, 200, "posz");
        this.negx = new Plane(-100, 0, 0, 0, Math.PI / 2, 0, 200, "negx");
        this.negy = new Plane(0, -100, 0, Math.PI / 2, 0, 0, 200, "negy");
        this.negz = new Plane(0, 0, 100, 0, 0, 0, 200, "negz");
    }
    Scene.prototype.update = function () {
        camera.update(); // UPDATE CAMERA 
        // UPDATE PLANES 
        this.posx.update();
        this.posy.update();
        this.posz.update();
        this.negx.update();
        this.negy.update();
        this.negz.update();
    };
    Scene.prototype.draw = function () {
        //DRAW ALL SIX PLANES EACH FRAME
        this.posx.draw();
        this.posy.draw();
        this.posz.draw();
        this.negx.draw();
        this.negy.draw();
        this.negz.draw();
    };
    return Scene;
})();
var ShaderProgram // SHADER TO RENDER 
 = (function () {
    function ShaderProgram // SHADER PROGRAM 
        (vertexSrc, fragmentSrc) {
        var vsSource = document.getElementById(vertexSrc).innerHTML; //GET VERTEX SHADER SOURCE
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER); //CREATE SHADER
        gl.shaderSource(this.vertexShader, vsSource); //SET SHADER
        gl.compileShader(this.vertexShader); // COMPILE SHADER 
        if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
            console.log("Error compiling vertex shader: " + gl.getShaderInfoLog(this.vertexShader));
        }
        var fsSource = document.getElementById(fragmentSrc).innerHTML; // GET FRAGMENT SHADER SOURCE
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); // CREATE NEW SHADER
        gl.shaderSource(this.fragmentShader, fsSource); // SET SHADER SOURCE 
        gl.compileShader(this.fragmentShader); //COMPILE SHADER 
        if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
            console.log("Error compiling fragment shader: " + gl.getShaderInfoLog(this.fragmentShader));
        }
        this.shaderProgram = gl.createProgram(); // CREATE NEW PROGRAM
        gl.attachShader(this.shaderProgram, this.vertexShader); // ATTACH VERTEX SHADER
        gl.attachShader(this.shaderProgram, this.fragmentShader); // ATTACH FRAGMENT SHADER
        gl.linkProgram(this.shaderProgram); //LINK PROGRAM
        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            console.log("Shader program linking failed: " + gl.getProgramInfoLog(this.shaderProgram));
        }
    }
    ShaderProgram 
    .prototype.setMatrixUniform = function (matrixName, matrix) {
        this.use(); // SET SHADER AS CURRENT
        var matrixLocation = gl.getUniformLocation(this.shaderProgram, matrixName); // MATRIX LOCATION BASED ON NAME, 1ST ARGUMENT
        gl.uniformMatrix4fv(matrixLocation, false, matrix); //MATRIX VALUE WITH VALUE PASSED TO THE FUNCTION, 2ND ARGUMENT
    };
    ShaderProgram  
    .prototype.use = function () {
        gl.useProgram(this.shaderProgram);
    };
    ShaderProgram 
    .prototype.getProgram = function () {
        return this.shaderProgram;
    };
    return ShaderProgram // SHADER PROGRAM USED TO RENDER 
    ;
})();
var Camera = (function () {
    function Camera() {
        // INITIALIZE SOME VALUES
        this.posX = 0;
        this.posY = 0;
        this.horizontalLookAtX = 0;
        this.horizontalLookAtZ = -1;
        this.verticalLookAtY = 0;
        this.horizontalAngle = -Math.PI / 2;
        this.verticalAngle = Math.PI / 2;
        gl.clearColor(0.2, 1.0, 1.0, 1.0); // SET CLEAR COLOR TO WHITE 
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
        mat4.identity(this.viewMatrix); // SET PROJECTION MATRIX 
        mat4.perspective(this.projectionMatrix, 90, canvas.width / canvas.height, 0.1, 100.0); // SET PERSPECTIVE PROJECTION
        gl.viewport(0, 0, canvas.width, canvas.height); // SET VIEWPORT BASED ON CANVAS SIZE
        shader.setMatrixUniform("uPMatrix", this.projectionMatrix); // SET NEW PROJECTION MATERIX
    }
    Camera.prototype.update = function () {
        gl.clear(gl.COLOR_BUFFER_BIT); // CLEAR SCREEN AT THE BEGINNIG OF EACH FRAME 
        mat4.identity(this.viewMatrix); // UPDATE VIEW AND MATRIX, FOR WINDOW SIZE CHNAGE
        mat4.perspective(this.projectionMatrix, 45, canvas.width / canvas.height, 0.1, 500.0);
        gl.viewport(0, 0, canvas.width, canvas.height);
        mat4.lookAt(this.viewMatrix, [this.posX, this.posY, 0], [this.horizontalLookAtX, this.verticalLookAtY, this.horizontalLookAtZ], [0, 1, 0]); // set new look at point
        shader.setMatrixUniform("uPMatrix", this.projectionMatrix); // PROJECTION MATRIX TO GPU
        shader.setMatrixUniform("uVMatrix", this.viewMatrix); // SEND VIEW MATRIX TO GPU
        if (drag == true) {
            if ((mouseX - oldMouseX) > 0) {
                this.horizontalAngle += 0.05;
            }
            else if ((mouseX - oldMouseX) < 0) {
                this.horizontalAngle -= 0.05;
            }
            this.horizontalLookAtX = Math.cos(this.horizontalAngle); // CALCULATE X POSITION 
            this.horizontalLookAtZ = Math.sin(this.horizontalAngle); // CALCULATE Z POSITION 
            if ((mouseY - oldMouseY) > 0) {
                this.verticalAngle += 0.05;
            }
            else if ((mouseY - oldMouseY) < 0) {
                this.verticalAngle -= 0.05;
            }
            this.verticalLookAtY = Math.cos(this.verticalAngle); // CALCULATE Y POSITION 
            oldMouseX = mouseX;
            oldMouseY = mouseY;
        }
    };
    return Camera;
})();
var oldMouseX = 0;
var oldMouseY = 0;
var mouseX = 0;
var mouseY = 0;
var drag = false;
addEventListener("mousedown", function (event) {
    drag = true;
});
addEventListener("mouseup", function (event) {
    drag = false;
});
addEventListener("mousemove", function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});
var Plane 
 = (function () {
    function Plane //CLASS TO REPRESENT PLANE
        (posX, posY, posZ, rotX, rotY, rotZ, size, imageName) {
        // INITIALIZING VALUES 
        this.positionX = posX;
        this.positionY = posY;
        this.positionZ = posZ;
        this.rotationX = rotX;
        this.rotationY = rotY;
        this.rotationZ = rotZ;
        this.size = size;
        this.modelMatrix = mat4.create();
        //SET STARTING POSITION 
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [this.size, this.size, this.size]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [this.positionX, this.positionY, this.positionZ]);
        mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotationX, [1, 0, 0]);
        mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotationY, [0, 1, 0]);
        mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotationZ, [0, 0, 1]);
        shader.setMatrixUniform("uMMatrix", this.modelMatrix);
        //CREATE NEW TEXTURE AND LOAD IMAGE DATA INSIDE TEXTURE 
        this.textureId = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.textureId);
        this.imageData = document.getElementById(imageName);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.imageData);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.bindTexture(gl.TEXTURE_2D, null);
        //DEFINE QUAD THAT REPRESENTS BACKGROUND
        this.quadVertices = [
            -0.5, 0.5, 0.0, 0.0, 1.0,
            -0.5, -0.5, 0.0, 0.0, 0.0,
            0.5, -0.5, 0.0, 1.0, 0.0,
            -0.5, 0.5, 0.0, 0.0, 1.0,
            0.5, -0.5, 0.0, 1.0, 0.0,
            0.5, 0.5, 0.0, 1.0, 1.0
        ];
        // CREATE NEW BUFFER AND PUT DATA INSIDE 
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.quadVertices), gl.STATIC_DRAW);
        var vertexPositionAttributeLocation = gl.getAttribLocation(shader.getProgram(), "aVertexPosition");
        gl.vertexAttribPointer(vertexPositionAttributeLocation, 3, gl.FLOAT, false, 20, 0);
        gl.enableVertexAttribArray(vertexPositionAttributeLocation);
        var textureCoordinateAttributeLocation = gl.getAttribLocation(shader.getProgram(), "aVertexTextureCoords");
        gl.vertexAttribPointer(textureCoordinateAttributeLocation, 2, gl.FLOAT, false, 20, 12);
        gl.enableVertexAttribArray(textureCoordinateAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    }
    Plane // WE USE THIS CLASS TO REPRESENT PLANE
    .prototype.update = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo); // BIND BUFFER AND UPDATE MODEL MATRIX 
        var vertexPositionAttributeLocation = gl.getAttribLocation(shader.getProgram(), "aVertexPosition");
        gl.vertexAttribPointer(vertexPositionAttributeLocation, 3, gl.FLOAT, false, 20, 0);
        gl.enableVertexAttribArray(vertexPositionAttributeLocation);
        var textureCoordinateAttributeLocation = gl.getAttribLocation(shader.getProgram(), "aVertexTextureCoords");
        gl.vertexAttribPointer(textureCoordinateAttributeLocation, 2, gl.FLOAT, false, 20, 12);
        gl.enableVertexAttribArray(textureCoordinateAttributeLocation);
        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, [this.positionX, this.positionY, this.positionZ]);
        mat4.scale(this.modelMatrix, this.modelMatrix, [this.size, this.size, this.size]);
        mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotationX, [1, 0, 0]);
        mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotationY, [0, 1, 0]);
        mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotationZ, [0, 0, 1]);
        shader.setMatrixUniform("uMMatrix", this.modelMatrix);
    };
    Plane // CLASS TO REPRESENT PLANE
    .prototype.draw = function () {
        this.update();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.textureId);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    return Plane // REPRESENT PLANE CLASS
    ;
})();
function initWebGL() {
    canvas = document.getElementById("Canvas");
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl"); // GET WEBGL CONTEXT FROM CANVAS 
    }
    catch (e) { }
    if (!gl) {
        alert("Error: Your browser does not appear to support WebGL.");
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
}
function resize() {
    var displayWidth = canvas.clientWidth; // GET CURRENT BROWSER WIDTH AND HEIGHT
    var displayHeight = canvas.clientHeight;
    if (canvas.width != displayWidth || canvas.height != displayHeight) {
        canvas.width = displayWidth; // UPDATE CANVAS
        canvas.height = displayHeight;
    }
}
