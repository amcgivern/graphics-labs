////////////////////////////////////////////////////////////////////////////
//
// Amanda McGivern
// COSC 3207 WI 2018
// January 30, 2018
// Lab 1 Question 2
// Adapted from ColoredPoints.js (c) 2012 matsuda
// Draws a circle on the canvas with a specified radius and number of dots
//
////////////////////////////////////////////////////////////////////////////

// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

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

  // // Get the storage location of a_Position
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
var radius = window.prompt("Enter a radius between 0 and 1:", "0.5");
var num = window.prompt("How many dots?\n3000 at most", "20"); 
//check for valid input, abort if unusable
if (!radius){
	console.log('Undefined radius..');
	return;
}
else if(radius<=0 || radius>1){
	console.log('invalid radius entered');
	return;
}

if (num>4000){
	console.log('Too many dots..');
	return;
}
else if (num<0){
	console.log('Please enter a positive number!');
	return;
}
 var g_points=[]; //array of points written;
 
var th=(2*Math.PI)/num;	//radians in the circle, divided by number of points

for (var i=0; i<num;i++){	//for every point
	var x=Math.cos(th*i)*radius;	//parametric equation for x position
	var y=Math.sin(th*i)*radius;	//parametric equation for y position
	g_points.push([x,y]);	//add points to array

}

 
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
 

    var len = g_points.length;
  for(var i = 0; i < len; i++) {
    var xy = g_points[i];


    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
	
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, 0.9, 0.0, 0.5, 1.0);
	

    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}


