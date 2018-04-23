// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 3.0;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n' +
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

function main() {

  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  console.log('got context');

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }


var len = initVertexBuffers(gl);
  if (len < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }


 // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

// Draw
gl.drawArrays(gl.LINE_LOOP, 0, len);
console.log('drawn');

}//end main

function initVertexBuffers(gl){
  var g_points= [];
  const NUM_POINTS = 1000.0;
var theta = (8*Math.PI)/NUM_POINTS; 
var a = 1.0;
var b = 1.0;
var yx = 0.08;  // x damping parameter
var yy = 0.02;  // y damping parameter
var wx = 15.8;  // x-axis frequency
var wy = 9.5;  //y-axis frquency
var phi = Math.PI/2.0;

for (var i=0.0; i<NUM_POINTS;i++){  //for every point

    var theta1 = theta*i;
    console.log ('theta', theta1);
  var x = exp(a*Math.E,(-yx*theta1)) * sin((wx*theta1)+phi);
  var y = exp(b*Math.E, (-yy*theta1)) * sin(wy*theta1);
  g_points.push([x,y]); //add points to array

}//end for(i)
console.log(g_points);
var g_f_points= new Float32Array(g_points); //stores points to draw curve

console.log(g_f_points);


  //////////////////////////////////////////////////
  //  Create buffer object for circle
  /////////////////////////////////////////////////

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

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

return g_points.length/2;
}