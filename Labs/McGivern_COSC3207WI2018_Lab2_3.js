
////////////////////////////////////////////////////////////////////////////
//
// Amanda McGivern
// COSC 3207 WI 2018
// February 16, 2018
// Lab 2 Question 3
// Adapted from ColoredPoints.js (c) 2012 matsuda
// Draws a parametric curve based on the supplied parametric equations
// 
// Q1: The y parameters are called damping parameters because they describe
//     how the oscillations lessen after a disturbance. A high damping paramter
//     means that the curve will quickly lessen in height and a low one will 
//     maintain its height for longer
// Q2: The w parameters are called frequency parameters because they control how 
//     many oscillations happen in the range
// 
////////////////////////////////////////////////////////////////////////////

var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_FragColor;\n' +
  'varying vec4 v_FragColor;\n' + // varying variable
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '  v_FragColor = a_FragColor;\n' +  // Pass the data to the fragment shader
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' + // Precision qualifier (See Chapter 6)
  'varying vec4 v_FragColor;\n' +    // Receive the data from the vertex shader
  'void main() {\n' +
  '  gl_FragColor = v_FragColor;\n' +
  '}\n';

// anonymous function for calculating sin(theta)
  var sin = function(th) {
  
  return Math.sin(th);
}

// anonymous function for calculating cos(theta)
  var cos = function(th){
  return Math.cos(th);
  }

// anonymous function for calculating exponents
  var exp = function(b, e){
  return Math.pow(b,e);
  }

//anonymous function that calculates a point's distance from the origin
var dist = function (x, y){
  return Math.sqrt(exp(x,2.0)+exp(y,2.0)); //point distance from the origin using distance formula
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

     // Get the storage location of a_FragColor
  var a_FragColor = gl.getAttribLocation(gl.program, 'a_FragColor');
  if (!a_FragColor) {
    console.log('Failed to get the storage location of a_FragColor');
   return -1;
  }

  //get the storage location of a_Position
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

//initialize vertex buffers with vertices
var len = initVertexBuffers(gl, a_FragColor);
  if (len < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

 // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the lines
  gl.drawArrays(gl.LINE_STRIP, 0, len);

}//end main



//////////////////////////////////////////////////
//
//  Initialize the vertex buffers
//
///////////////////////////////////////////////////
function initVertexBuffers(gl, a_FragColor, a_Position)
{
var g_points = [];  //array of  vertices
var g_colours = []; //The array to store the colors of the points

const NUM_POINTS = 4000.0;  //number of vertices to approximate the curve
var theta = (8*Math.PI)/NUM_POINTS; //amount that theta changes between points
var a = 1.0;
var b = 1.0;
var yx = 0.08;  // x damping parameter
var yy = 0.02;  // y damping parameter
var wx = 15.8;  // x-axis frequency
var wy = 9.5;  //y-axis frquency
var phi = Math.PI/2.0;

//for every point in the curve
  for (var i=0.0; i<NUM_POINTS;i++){  

  //update theta based on point
  var theta1 = theta*i; 
  // parametric equations for the curve
  var x = exp(a*Math.E,(-yx*theta1)) * sin((wx*theta1)+phi);
  var y = exp(b*Math.E, (-yy*theta1)) * sin(wy*theta1);


  var d = dist(x,y);
  var f = Math.round(63.0*(d/Math.sqrt(2.0))); //converts the distance to a fraction of the maximum distance from the origin and then 
console.log('f',f);

  //Add the colours from the diverging colour map to the g_colors array
  // Add the red value to the array, multiply by three 
  g_colours.push(DIV_CMAP[f*3]);
  //add the green value to the array
  g_colours.push(DIV_CMAP[(f*3+1)]);
  //add the blue value to the array
  g_colours.push(DIV_CMAP[(f*3+2)]);
  //add the alpha value to the array
  g_colours.push(1.0);

  g_points.push([x]); //add x-coordinate of vertex to array
  g_points.push([y]); //add y-coordinate of vertex to array

}//end for(i)


  //////////////////////////////////////////////////
  //  Create buffer object for curve points
  /////////////////////////////////////////////////

  var g_f_points= new Float32Array(g_points); //stores points to draw curve

  // Create a buffer object
  var gBuffer = gl.createBuffer();
  if (!gBuffer) {
    console.log('Failed to create buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, gBuffer);

  // Write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, g_f_points, gl.STATIC_DRAW);


  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);


  //////////////////////////////////////////////////
  //  Create buffer object for colours
  /////////////////////////////////////////////////

  var g_f_colours = new Float32Array(g_colours);  //stores the colours as floats

  // Create a colour buffer object
  var colourBuffer = gl.createBuffer();
  if (!colourBuffer) {
    console.log('Failed to create buffer object');
    return -1;
  }

  // Bind the colour buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);

  // Write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, g_f_colours, gl.STATIC_DRAW);
  
//*** ASSIGNING THE BUFFER OBJECT MESSES UP THE GRAPHICS

  // Assign the buffer object to a_FragColor variable
  gl.vertexAttribPointer(a_FragColor, 4, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_FragColor variable
 gl.enableVertexAttribArray(a_FragColor);

return g_points.length/2.0; //returns the number of vertices

}// end initVertexBuffers
