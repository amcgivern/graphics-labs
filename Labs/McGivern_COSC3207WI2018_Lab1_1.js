////////////////////////////////////////////////////////////////////////////
//
// Amanda McGivern
// COSC 3207 WI 2018
// January 30, 2018
// Lab 1 Question 1
// Adapted from ClickedPoints.js (c) 2012 matsuda
// Draws coloured points that get darker green the further 
// from the center they are
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
  
  
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position, u_FragColor); };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  console.log('COLOR_BUFFER_BIT==',gl.COLOR_BUFFER_BIT);
  console.log('gl.POINTS==',gl.POINTS);
}

var g_points = []; // The array for all the positions of every mouse press
var g_colors = []; //The array to store the colors of the points

function click(ev, gl, canvas, a_Position, u_FragColor) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  const G_CENTER = 1.0; // value of the green intensity at the origin
  const G_OUTER = 0.1; // value of green intensity furthest from the origin
  
  // Client drawing area.
  var rect = ev.target.getBoundingClientRect() ;

//convert from canvas distance [0,400] to WebGL distance [-1,1]
  
  x = (2.0 * (x - rect.left) - canvas.width) / canvas.width;
  y = (canvas.height - 2.0 * (y - rect.top)) / canvas.height;
    console.log( 'x', x);
   console.log( 'y', y);	
   
	var dist = Math.sqrt(Math.pow(x,2.0)+Math.pow(y,2.0)); //point distance from the origin using distance formula
	var f= (dist/(Math.sqrt(2))); //converts the distance to a fraction of the maximum distance from the origin
	var c=(1-f)*G_CENTER + f*G_OUTER;	//linearly interpolate the value between 1.0 and 0.1 to determine the shade of green

  // Store the coordinates to g_points array
  g_points.push([x,y]); 
  //Add the green colour to the g_colors array
  g_colors.push([0.0,c,0.0,1.0]);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_points.length;
  
  for(var i = 0; i < len; i ++) {
	var xy = g_points[i];
	var rgba = g_colors[i];
  
    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
	
	// Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
	
    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);

  }
}
