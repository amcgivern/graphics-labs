///////////////////////////////////////////////////////
//
//  Lab 4 COSC 3207
//  Amanda McGivern
//  Dr. M. Wachowiak
//  March 20, 2018
//  Adapted from:
//  HelloCube.js (c) 2012 matsuda
//  Vertex shader program
//
//////////////////////////////////////////////////////

var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';
  
  // function for calculating cotangent
  function cotn(x) { return 1 / Math.tan(x); }
  
    const dTheta = 0.3;	// change in theta
	const initTheta = 0.0;	// initial x-shear angle
	const MAX_TH = 0.9;	// maximum shear angle
	const MIN_TH = -0.9;	// minimum shear angle
	
/////////////////////////////////////////////////////////////
//	Main function
/////////////////////////////////////////////////////////////
function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the vertex coordinates and color
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set clear color and enable hidden surface removal
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }

  var modelMatrix = new Matrix4(); // Model matrix
  var viewMatrix = new Matrix4();  // View matrix
  var projMatrix = new Matrix4();  // Projection matrix
  var mvpMatrix = new Matrix4();   // Model view projection matrix

    // Calculate the model, view and projection matrices
	modelMatrix.setIdentity();

// Set the eye point and the viewing volume
	viewMatrix.setLookAt(2, 3, 8, 0.0, -1.0, 0.0, 0, 1, 0);
   projMatrix.setPerspective(30, 1, 1, 100);
  
  // Calculate the model view projection matrix
  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
  // Pass the model view projection matrix to u_MvpMatrix
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  var f = 0.0; // the lerp value, between [0,1]
  var theta = 1.0; //x-shearing value
  var d = true;	// direction, true means positive direction, true = negative direction
  var c = new Float32Array([0.0,-1.0, -0.5]);	// base-center coordinates
  
  // matrix for shearing the house
  var shearZ = new Matrix4([	
  1.0, 0.0, 0.0, 0.0, 
  initTheta, 1.0, 0.0, 0.0,
  0.0,0.0, 1.0, 0.0,
  0.0, 0.0, 0.0, 1.0,
  ]);
  
  // the function called to update the animation
  var tick = function() {
		
	// Shear the z-component	
	if (cotn(theta) <= MAX_TH && cotn(theta) >= MIN_TH){
	theta = animate(theta, dTheta, d);	// update theta
	
	shearZ.setIdentity();
	shearZ.elements[4] = cotn(theta);	// shears the y component by x*cot(theta)
	
	modelMatrix.setIdentity();
	modelMatrix.multiply(shearZ);	// apply the shearing to the modelMatrix
	console.log("1");
	}

	// if theta is past the max
	else if (cotn(theta) > MAX_TH){
	// reset the shear angles
	theta = MAX_TH;
	// reverse the direction
	d = !d;
	theta = animate(theta, dTheta, d);	// update theta
	shearZ.setIdentity();
	shearZ.elements[4] = cotn(theta); // shears the y component by x*cot(theta)
	//shearZ.elements[2] = cotn(theta); // shears the y component by x*cot(theta)
	
  	modelMatrix.setIdentity(); // reinitialize the model matrix
	modelMatrix.multiply(shearZ);
	}
	
	// if theta is less than the min
	else if (cotn(theta) < MIN_TH){
	// reset the shear angles
	theta = MIN_TH;
	// reverse the direction
	d = !d;
	theta = animate(theta, dTheta, d);
	
	//console.log("reverse", theta);
	shearZ.setIdentity();
	shearZ.elements[4] = cotn(theta);// shears the y component by x*cot(theta)
	
	modelMatrix.setIdentity();
	modelMatrix.multiply(shearZ);	// apply the shearing transformation
	}	
	// if theta is not covered, output for debugging
	else{
			console.log(cotn(theta));
			console.log(d);
	}
	
	//viewMatrix.setLookAt(1, 2, 8, c[1],c[2],c[3], -1.0, 0.0, 0, 1, 0);
	mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);  // apply the shearing
	//mvpMatrix = addMatrix4(mvpMatrix, modelMatrix);	// apply the model transformations 
	// Pass the model view projection matrix to u_MvpMatrix
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);	// Draw the house
    requestAnimationFrame(tick, canvas); // Request that the browser calls tick
  };
  
  // Pass the model view projection matrix to u_MvpMatrix
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw the cube
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  
    // Start the clock.
  tick();
}

/////////////////////////////////////////////////////////////
// Takes two 4x4 matrices and adds them together
// Returns a Matrix4 object as the result of the addition
/////////////////////////////////////////////////////////////
function addMatrix4(m1, m2){
	
	var newMatrix = new Matrix4(); // Matrix holding result of matrix addition
	// Matrix4 are stored in row major order 
	for (var j =0; j < 16; j++){
		//console.log(m1[j]);
		//console.log(m2[j]);
			newMatrix.elements[j] = m1.elements[j] + m2.elements[j];	// add the components of each matrix
	}
//	console.log(newMatrix);
	return newMatrix;	// return the resultant matrix
}

//////////////////////////////////////////////////////////////
/// Animates the shearing motion
/// Needs current shear angle, change in angle, and direction
///	Returns updated shear angle
///////////////////////////////////////////////////////////////
// Last time that this function was called
var g_last = Date.now();
function animate(theta, dtheta, dir){
	  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  var newAngle
  console.log("direction", dir);
  
  // shear towards the positive direction
  if(dir){
 newAngle= theta + (dtheta * elapsed) / 1000.0;	// update the angle based on the frame
  }
  // shear towards the negative direction
  else{
	   newAngle= theta - (dtheta * elapsed) / 1000.0; // update the angle based on the frame
  }
return newAngle;
}


////////////////////////////////////////////////////////////////
///	Creates and initializes vertex buffers for drawing a house
/////////////////////////////////////////////////////////////////
function initVertexBuffers(gl) {

    var vertices = new Float32Array([   // Vertex coordinates
    1.0, 0.5, 1.0, 	  -1.0, 0.5, 1.0,   -1.0, 0.0, 1.0,  	1.0, 0.0, 1.0, // v0, v1, v13, v10 front top
    -0.25, 0.0,1.0,	  -1.0, 0.0, 1.0,  -1.0, -1.0,  1.0,   -0.25, -1.0, 1.0, // v12, v13, v2, v15 front bottom left
    1.0, 0.0, 1.0,    0.25, 0.0, 1.0,  0.25, -1.0, 1.0,  	1.0, -1.0,  1.0, // v10, v11,v14, v3 front bottom right
   1.0, 0.5, 1.0,	  1.0,-1.0, 1.0,   1.0,-1.0,-1.0,  		1.0, 0.5,-1.0,  // v0-v3-v4-v5 right
    1.0, 0.5, 1.0, 	  1.0, 0.5,-1.0,  -1.0, 0.5,-1.0, 		-1.0, 0.5, 1.0,  // v0-v5-v6-v1 up
    -1.0, 0.5, 1.0,  -1.0, 0.5,-1.0,  -1.0,-1.0,-1.0,	    -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0, 		-1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
    1.0,-1.0,-1.0, 	 -1.0,-1.0,-1.0,  -1.0, 0.5,-1.0,  		 1.0,0.5,-1.0,  // v4-v7-v6-v5 back
    0.0, 1.0,1.0,     1.0,  0.5, 1.0,   1.0, 0.5, -1.0, 	 0.0,  1.0 , -1.0,// v8, v0, v5, v9 roof right
    -1.0, 0.5,1.0,  -1.0,  0.5,-1.0,   0.0,  1.0,  1.0,      0.0,  1.0, -1.0, // v1, v6, v8, v9 roof left
    -1.0, 0.5,1.0,   1.0,  0.5, 1.0,   0.0,  1.0,  1.0, // v1, v0, v8 roof front
    -1.0, 0.5,-1.0,  1.0,  0.5,-1.0,   0.0,  1.0, -1.0, // v6, v5, v9 roof back
	 0.25, 0.0, 1.0,  0.25, -1.0, 1.0, -0.25, 0.0, 1.0, -0.25, -1.0, 1.0,	// Door
	0.4, 0.2, 1.01,    0.4, -0.2, 1.01,   0.8, 0.2, 1.01, 0.8, -0.2, 1.01,	// front window

  ]);
  
  var colours = new Float32Array([     // Colors
  // BlUE
   0.0, 0.0, 1.0, 	0.0, 0.0, 1.0,   0.0, 0.0, 1.0,	 0.0, 0.0, 1.0, //front top
   0.0, 0.0, 1.0,	 0.0, 0.0, 1.0,  0.0, 0.0, 1.0,	 0.0, 0.0, 1.0, //front bottom left
   0.0, 0.0, 1.0,	 0.0, 0.0, 1.0,  0.0, 0.0, 1.0,	 0.0, 0.0, 1.0, // front bottom right
   0.0, 0.0, 1.0,	 0.0, 0.0, 1.0,  0.0, 0.0, 1.0,	 0.0, 0.0, 1.0,// right
   0.0, 0.0, 1.0,	 0.0, 0.0, 1.0,  0.0, 0.0, 1.0,	 0.0, 0.0, 1.0,// up
   0.0, 0.0, 1.0,	 0.0, 0.0, 1.0,  0.0, 0.0, 1.0,	 0.0, 0.0, 1.0,// left
   0.0, 0.0, 1.0,	 0.0, 0.0, 1.0,  0.0, 0.0, 1.0,	 0.0, 0.0, 1.0, // down
   0.0, 0.0, 1.0,	 0.0, 0.0, 1.0,  0.0, 0.0, 1.0,	 0.0, 0.0, 1.0, // back
   // RED
   1.0, 0.0, 0.0,	 1.0, 0.0, 0.0,	 1.0, 0.0, 0.0,	 1.0, 0.0, 0.0,  // roof right
   1.0, 0.0, 0.0,	 1.0, 0.0, 0.0,	 1.0, 0.0, 0.0,	 1.0, 0.0, 0.0,  // roof left
   0.8, 0.0, 0.0,	 0.8, 0.0, 0.0,	 0.8, 0.0, 0.0,	// roof front 
   0.8, 0.0, 0.0, 	 0.8, 0.0, 0.0,	 0.8, 0.0, 0.0, // roof back
   // BROWN
   0.8, 0.5, 0.5,  0.8, 0.5, 0.5,  0.8, 0.5, 0.5,  0.8, 0.5, 0.5, //Door
   // CYAN7
   0.0, 0.9, 0.9,  0.0, 0.9, 0.9,  0.0, 0.9, 0.9,  0.0, 0.9, 0.9, //Window

  ]);
 
  // Indices of the vertices
  var indices = new Uint8Array([
    2, 3, 0, 0, 1, 2, //front top
    6, 4, 5, 6, 7, 4,   //front bottom left
    10, 8, 9, 10, 11, 8, // front bottom right
    12, 13, 14, 12, 14, 15,   // right 
    16, 17, 18, 16, 18, 19,  //up   
    20, 21, 22, 20, 22, 23, //left
    24, 25, 25, 24, 26, 27, //down
    28, 29, 30, 28, 30, 31, // back
    32, 33, 34, 34, 35, 32, // roof right
    36, 37, 38, 37, 39, 38, // roof left
    40, 41, 42, 43,44, 45, // roof front and back
	47, 46, 48,	48, 49, 47,// Door
	51, 50, 52, 52, 53, 51,// Window
 ]);

  // Create a buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) 
    return -1;

  // Write the vertex coordinates and color to the buffer object
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position'))
    return -1;

  if (!initArrayBuffer(gl, colours, 3, gl.FLOAT, 'a_Color'))
    return -1;

  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

// initialize the array bufferss
function initArrayBuffer(gl, data, num, type, attribute) {
  var buffer = gl.createBuffer();   // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}