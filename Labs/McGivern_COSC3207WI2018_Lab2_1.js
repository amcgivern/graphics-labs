
////////////////////////////////////////////////////////////////////////////
//
// Amanda McGivern
// COSC 3207 WI 2018
// February 10, 2018
// Lab 2 Question 1
// Adapted from ColoredPoints.js (c) 2012 matsuda
// Draws a parametric curve based on the supplied parametric equations
////////////////////////////////////////////////////////////////////////////

// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 3.0;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

// anonymous function to calulate the sin(theta) where theta is an angle
 var sin = function(th) {
  
  return Math.sin(th);;
}
// anonymous function to calulate the cos(theta) where theta is an angle
  var cos = function(th){
  return Math.cos(th);
  }


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

  // Get the storage location of u_FragColor
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

 // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
 
    var len = initVertexBuffers(gl, a_Position);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, 1.0, 0.3, 0.4, 1.0);
	
    // Draw
    gl.drawArrays(gl.LINE_LOOP, 0, len);

}//end main

function initVertexBuffers(gl, a_Position){

const NUM_POINTS = 5000.0;  //number of points to approximate curve with
var theta = (8*Math.PI)/NUM_POINTS; // value of change in theta

var g_points = [];  //array of points written

//for every point in the curve
  for (var i=0.0; i<NUM_POINTS;i++){  
   //update theta 
    var theta1 = theta*i;

  //parametric equation for x-position
  var x = (4.5*sin(theta1)-sin(3*theta1)+(0.8*sin(15.25*theta1)));  
  x = (1/6.4)*x;
  // parametric equation for y-position
  var y = (1/6.4)*(4.0*cos(theta1)-1.5*cos(2*theta1)-0.6*cos(3*theta1)-0.3*cos(4*theta1)+0.8*cos(15.25*theta1));

  g_points.push([x]); //add x-coordinate to array
  g_points.push([y]); //add y-coordinate to array

}//end for

// array of vertices as floats
var g_f_points =  new Float32Array(g_points);

/////////////////////////////////////////////////
// Create  and bind a buffer object 
/////////////////////////////////////////////////

    // Create a buffer object
  var vBuffer = gl.createBuffer();
  if (!vBuffer) {
    console.log('Failed to create the polygon buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  // Write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, g_f_points, gl.STATIC_DRAW);
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

return g_f_points.length/2; // return number of points
}// end initVertexBuffers


