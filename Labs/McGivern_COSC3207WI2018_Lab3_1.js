/////////////////////////////////////////
//
// 	3D parametric curve
//	COSC 3207 WI 2018
//  Amanda McGivern
//	Adapted from: Dr. M. Wachowiak
//
//  The shape being made is a coil
//	3D Parametric curves:
//		x = cos(t)
//		y = sin(t);
//		z = t
//		t = 0, ..., 10pi
//		x/ymin = -1, x/ymax = 1, zmin = 0, zmax = 31.416...
//    
//    x = 2.0*sin(3*theta) * cos(theta);
//    y = 2.0 *sin(3*theta) * sin(theta);
//    z = sin (3*theta);
//    t = 0, ..., 2pi

//		x = 3*cos(t)+cos(10*t)*cos(t)
//		y = 3*sin(t)+cos(10*t)*sin(t)
//		z = sin(10*t)
//    t = 0, ..., 2pi
//		x/ymin = -4, x/ymax = 4, zmin = -4, zmax = 4 
//
/////////////////////////////////////////
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);\n' +
  '}\n';

/////////////////////////////////////////////
//
//  Global Variables
//
/////////////////////////////////////////////
var ROTATION_ANGLE = 2.0; // rotation angle in degrees

//initialize the type to the coil, 0=coil, 1=curveOne 2=curveTwo
g_type = 0;

/////////////////////////////////////////////
// Anonymous Trigonometric Functions
////////////////////////////////////////////
var sin = function (t){return Math.sin(t)};
var cos = function (t){return Math.cos(t)};

/////////////////////////////////////////////
//
//	Main function....
//
/////////////////////////////////////////////
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
  
  // Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Get storage location of u_ModelMatrix
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  //  event handler for when the user clicks the coil button
  document.getElementById("coil").onclick = function() {
// generate points for and draw a coil
n = genPoints(gl,0, g_points, u_ModelMatrix, modelMatrix, a_Position);
draw(gl, n, u_ModelMatrix, modelMatrix);};
  
  //  event handler for when the user clicks the curve one button
 document.getElementById("curve1").onclick = function() {
 // generate points for and draw the first parametric curve    
n = genPoints(gl,1, g_points, u_ModelMatrix, modelMatrix, a_Position);
draw(gl, n, u_ModelMatrix, modelMatrix);}; 
  
  //  event handler for when the user clicks the curve two button
 document.getElementById("curve2").onclick = function() {
  // generate points for and draw the second curve
n = genPoints(gl,2, g_points, u_ModelMatrix, modelMatrix, a_Position);
draw(gl, n, u_ModelMatrix, modelMatrix);}; 
  
// Register an event handler to be called on a key press
 document.onkeydown = function(ev){ keydown(ev, gl, n, u_ModelMatrix, modelMatrix, a_Position,g_points);};
// Register an event handler to be called on a mouse press
  canvas.onmousedown = function(ev){ click(ev, gl, n);};
  // Model matrix
  var modelMatrix = new Matrix4();  

  //transform the matrix to its starting position
  modelMatrix.setIdentity();
  modelMatrix.rotate(45, 0.0, 1.0, 0.0);
  modelMatrix.scale(0.2,0.2, 0.2);

//generate the points for the initial coil
var n = genPoints(gl,g_type, g_points, u_ModelMatrix,modelMatrix, a_Position);
//draw the points to the screen
 draw (gl, n, u_ModelMatrix, modelMatrix);
}	// END main()

// The array for the position of the points in the 3D parametric curve.
var g_points = [];  

///////////////////////////////////////////////////////////////
//
//  event handler for when a key is pressed
//  performs rotation based on value of key using Euler rotations
//  keyCode: 'X'== 88 'Y'== 89 'z'== 90 
//
///////////////////////////////////////////////////////////////
function keydown(ev, gl, n, u_ModelMatrix, modelMatrix, a_Position,g_points) {
  // The user selects an axis or direction of rotation
  switch (ev.keyCode){
    //the r key was pressed, reset the image to intial position
    case 82:
    // Reset the rotation angle to 0
    ROTATION_ANGLE = 5.0;
    genPoints(gl,g_type, g_points, u_ModelMatrix, modelMatrix, a_Position);
    break;
    //The x key was pressed
    case 88: 
    console.log('x');
    //rotate about the x-axis
    modelMatrix.rotate(ROTATION_ANGLE, 1.0, 0.0, 0.0);
    break;

    //The y key was pressed
    case 89:  
    console.log('y');
    //rotate about the y-axis
    modelMatrix.rotate(ROTATION_ANGLE, 0.0, 1.0, 0.0);
    break; 

    //The z key was pressed
    case 90: 
    console.log('z');
    //rotate about the z-axis
    modelMatrix.rotate(ROTATION_ANGLE, 0.0, 0.0, 1.0);
    break;

    default:  // undefined key was pressed, nothing happens
    return; // prevent unnecessary drawing 
  }//end switch (ev.keyCode)

// draw the vertices
draw (gl, n, u_ModelMatrix, modelMatrix);
} //end keydown()

////////////////////////////////////////////////////////
// Event handler for when the user clicks the canvas. 
// The direction of rotation switches everytime the user
// clicks the screen.
////////////////////////////////////////////////////////
function click (ev, gl, n){
// reverse the direction of the angle
  ROTATION_ANGLE = -ROTATION_ANGLE;
}//end click

//////////////////////////////////////
//  Draw the points.
//////////////////////////////////////
function draw(gl, n, u_ModelMatrix, modelMatrix){
  // Pass the model matrix to the vertex shader.
  // .elements extracts all the elements of the matrix, given by Matsuda and Lea
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  // Clear <canvas>.
  gl.clear(gl.COLOR_BUFFER_BIT);

// compare the type to determine which drawArrays to use
if (g_type == 0){
    gl.drawArrays(gl.LINE_STRIP, 0, n);
}
else{
   gl.drawArrays(gl.LINE_LOOP, 0, n);
}
}//end draw()

///////////////////////////////////////////////////////
// Generates points, initializes buffers,
// and returns the number of points
///////////////////////////////////////////////////////
function genPoints (gl,type, g_points, u_ModelMatrix, modelMatrix, a_Position){
 // set the current global type to the type entered
  g_type = type;
  var n;  // the number of vertices

  modelMatrix.setIdentity();
  //rotate it 90 degrees about the y-axis
  modelMatrix.rotate(45, 0.0, 1.0, 0.0);

  // compare type to determine transformations applied
  switch (g_type){
    // coils are scaled uniformly by 0.5
    case 0:
  modelMatrix.scale(0.5,0.5, 0.5);
  n = genCoilPoints(gl, g_points, n, u_ModelMatrix, modelMatrix, a_Position);
    break;
    // curve one is scaled uniformly by 0.4
    case 1:
  modelMatrix.scale(0.4,0.4, 0.4);
    n = genCurveOne(gl, g_points, n, u_ModelMatrix, modelMatrix, a_Position);
    break;
    // curve two is scaled uniformly by 0.2
    case 2:
  modelMatrix.scale(0.2,0.2, 0.2);
    n = genCurveTwo(gl, g_points, n, u_ModelMatrix, modelMatrix, a_Position);
    break;

    default:
    return; // exit if not one of these types
  }// end switch
// return the number of vertices
return n;
}// end genPoints

///////////////////////////////////////////////////////////////
// Generates the points for a parametric equation in the shape 
// of a coil for the player to interact with.
///////////////////////////////////////////////////////////////
function genCoilPoints (gl, g_points, n, u_ModelMatrix, modelMatrix, a_Position)
{
  /////////////////////////////////////////////////////////
  //  Generate 3D points for parametric curve.
  /////////////////////////////////////////////////////////
  var theta = 0.0;
  var x;
  var y;
  var z;
  var n;  // number of vertices
  var Npoints = 800;
  var dtheta = 10.0 * Math.PI / Npoints;
  var TwoPI = 2.0 * Math.PI;
  //clear the g_points array
  g_points = [];

  ////////////////////////////////////////////////
  //  Main loop for generating 3D points.
  ////////////////////////////////////////////////
  while (theta < 10.0 * Math.PI) {
  //parametric equation for coil
   x = Math.cos(theta);
   y = Math.sin(theta);
   z = theta;
   
   
   // Adjust to fit into (-1,-1,-1), (1,1,1).
   z = z / 16.0 - 1.0;
     // console.log(x);
   g_points.push(x);
   g_points.push(y);
   g_points.push(z);
   theta = theta + dtheta;
  }
  // get the length of the array of vertices
  var len = g_points.length;
  var n = len / 3; // account for x,y, and z 
  //initialize the vertex buffers
  initVertexBuffers(gl, n, u_ModelMatrix, modelMatrix, a_Position, g_points);
  return n;
}// end genCoilPoints

function genCurveOne(gl, g_points, n, u_ModelMatrix, modelMatrix, a_Position)
{
    /////////////////////////////////////////////////////////
  //  Generate 3D points for parametric curve.
  /////////////////////////////////////////////////////////
  var theta = 0.0;
  var x;
  var y;
  var z;
  var n;  // number of vertices
  var Npoints = 800;
  var dtheta = 10.0 * Math.PI / Npoints;
  var TwoPI = 2.0 * Math.PI;
  //clear the g_points array
  g_points = [];

  ////////////////////////////////////////////////
  //  Main loop for generating 3D points.
  ////////////////////////////////////////////////
  while (theta < TwoPI){
  //parametric equation for first curve
  x = 2.0*sin(3*theta) * cos(theta);
  y = 2.0 *sin(3*theta) * sin(theta);
  z = sin (3*theta);

  g_points.push(x);
  g_points.push(y);
  g_points.push(z);
  theta += dtheta;
}// end while

  // get the length of the array of vertices
  var len = g_points.length;
  var n = len / 3; // account for x,y, and z 
  //initialize the vertex buffers
  initVertexBuffers(gl, n, u_ModelMatrix, modelMatrix, a_Position, g_points);
  return n;
}// end genCurveOne

function genCurveTwo(gl, g_points, n, u_ModelMatrix, modelMatrix, a_Position){

  /////////////////////////////////////////////////////////
  //  Generate 3D points for parametric curve.
  /////////////////////////////////////////////////////////
    //clear the g_points array
  g_points = [];

  var theta = 0.0;
  var x;
  var y;
  var z;
  var Npoints = 800;
  var dtheta = 10.0 * Math.PI / Npoints;
  var TwoPI = 2.0 * Math.PI;

  ////////////////////////////////////////////////
  //  Main loop for generating 3D points.
  ////////////////////////////////////////////////
  while (theta < TwoPI){
    // parametric equation for third curve
    x = 3*cos(theta) + cos(10*theta) * cos(theta);
    y = 3*sin(theta) + cos(10*theta) * sin(theta);
    z = sin(10*theta);

  g_points.push(x);
  g_points.push(y);
  g_points.push(z);
  theta += dtheta;
  }// end while

  // get the length of the array of vertices
  var len = g_points.length;
  var n = len / 3;// account for x,y, and z 
  //initialize the vertex buffers
  initVertexBuffers(gl, n, u_ModelMatrix, modelMatrix, a_Position, g_points);
  return n;
}// end genCurveTwo

function initVertexBuffers(gl, n, u_ModelMatrix, modelMatrix, a_Position, g_points){
///////////////////////////////////////////////////
//
//  Initialize the buffer objects
//
///////////////////////////////////////////////////
  var vertices = new Float32Array(g_points);
   
  // Create a buffer object.
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
 
  // Bind the buffer object to target.
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  
  // Write data into the buffer object.
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Assign the buffer object to a_Position variable.
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable.
  gl.enableVertexAttribArray(a_Position);
    // Specify the color for clearing <canvas>.
  gl.clearColor(0.0, 0.0, 0.0, 1);
}//end initVertexBuffers
