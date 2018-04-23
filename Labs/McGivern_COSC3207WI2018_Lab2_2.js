////////////////////////////////////////////////////////////////////////////
//
// Amanda McGivern
// COSC 3207 WI 2018
// February 10, 2018
// Lab 2 Question 2
// Adapted from ColoredPoints.js (c) 2012 matsuda
// Takes as input the number of polygon sides, radius of a circle, inscribed/circumscribed 
// and then draws the polygon and circle as described
//	
////////////////////////////////////////////////////////////////////////////

// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 5.0;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(0.0, 1.0, 0.2, 1.0);\n' +
  '}\n';

//anonymous function to compute sin(theta)
 var sin = function(th) {
	
	return Math.sin(th);
}

//anonymous function to compute cos(theta)
	var cos = function(th){
	return Math.cos(th);
  }

function main(){
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
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

var r = window.prompt("Enter a radius between 0 and 1:", "0.5");
var num_sides = window.prompt("How many sides in the polygon?", "4"); 
var inscribed = window.prompt("Is the polygon inscribed in the circle? (y/n)",'n');

if (!inscribed|| !num_sides|| !inscribed  ){
	console.log('invalid or missing information');
	return;
}

//easier to deal with 0s and 1s rather than strings 
if(inscribed=='y'||inscribed=='Y'){
	inscribed=1;
}
else if (inscribed == 'n'|| inscribed == 'N'){
	inscribed=0;
}
else {
	console.log('invalid inscribed value');
	return;
}
//check to see if there is a reasonable number of sides
if (num_sides<=2 || num_sides>5000){
	console.log('unreasonable side amount');
	return;
}

//checks for valid radius based on the size of the webGL grid
if (r<=0||r>1){
console.log('invalid radius entered');
return;
}

var n = initCircVertexBuffers(gl, num_sides, r, inscribed, a_Position)
 // Write the positions of vertices to a vertex shader

 // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the polygon
  gl.drawArrays(gl.LINE_LOOP, 0, n);

  n = initPolyVertexBuffers(gl, num_sides, r, inscribed, a_Position);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }
    // Draw the polygon
  gl.drawArrays(gl.LINE_LOOP, 0, n);

}//end main


////////////////////////////////////////////////////////////////
// 	Initializes vertex buffers for the circle based on whether
//  it's inscribed or circumscribed
////////////////////////////////////////////////////////////////

function initCircVertexBuffers(gl, num_sides, r, inscribed, a_Position){

//stores circle vertices
  var c_points= [];
const NUM_POINTS = 150.0;	//the number of points to approximate the circle with

	//create points for the circle circumscribing the polygon
	theta = (2*Math.PI)/NUM_POINTS;	//
console.log('theta', theta);

// for every point in the curve
	for (i = 0.0; i < NUM_POINTS; i++){

    //parametric equations for circle
		var x = r*(cos(theta*i));
		var y = r*(sin(theta*i));

    // add the circle coordinates to the circle array
		c_points.push([x]);
		c_points.push([y]);
	}

var c_f_points= new Float32Array(c_points);	//stores points as floats to draw circle

  //////////////////////////////////////////////////
  //  Create and bind buffer object for circle
  /////////////////////////////////////////////////

	// Create a buffer object
  var cBuffer = gl.createBuffer();
  if (!cBuffer) {
    console.log('Failed to create the circle buffer object');
    return -1;
  }

    // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  // Write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, c_f_points, gl.STATIC_DRAW);
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
//console.log(c_points);
return c_points.length/2; //return number of vertices
}//end initCircVertexBuffers

var poly_midpoints = [];  //stores points of intersection with the circle 
var poly_points = []; //stores polygon vertices

////////////////////////////////////////////////////////////////
// 	Initializes vertex buffers for the polygon based on whether
//  it's inscribed or circumscribed
////////////////////////////////////////////////////////////////

function initPolyVertexBuffers(gl, num_sides, r, insc, a_Position){

/////////////////////////////////////////////////
// Create  and bind a buffer object for circle
/////////////////////////////////////////////////

    // Create a buffer object
  var polyBuffer = gl.createBuffer();
  if (!polyBuffer) {
    console.log('Failed to create the polygon buffer object');
    return -1;
  }

switch(insc){
  /*////////////////////////////////////////////
  //   Draw polygon circumscribing circle 
  ////////////////////////////////////////////
  case 0:
  // variables evaluate to infinity so this part of the code must be left commented out

  var theta = (2.0*Math.PI)/num_sides;  //determines angle between points of intersection with the triangle
  
  //calculate the tangent lines to the circle which are the polygon lines
  for(i=0.0; i<num_sides; i++){
    //update theta
    theta1 = theta * i;

    //points of intersection with the circle
    var x = r * cos(theta1);
    var y = r * sin(theta1);

    //slope of tangent line to circle based on derivative of the circle equation
    var m = (cos(theta1) - theta1 * sin(theta1)) / (sin(theta1) + theta1 * cos(theta1));
    console.log('m', m);
    // find b to obtain the equation of the tangent line
    var b = y - m * x;
    console.log ('b', b);
    // add the line equation variables to the array of lines 
    poly_midpoints.push([m]);
    poly_midpoints.push([b]);

    console.log(poly_midpoints[i]);
    console.log(poly_midpoints[i+1]);

    console.log(poly_midpoints)
  } // end for(i)

//find points of intersection between the tangent lines to determine the vertices of the polygon
    for(i=0.0; i<num_sides; i++){

      //slope for the first line
      var m1 = poly_midpoints [i];
      console.log ('m1', m1);
      //y-intercept for first line
      var b1 = poly_midpoints [(i + 1) % num_sides];

      //slope for the second line
      var m2 = poly_midpoints [(i + 2) % num_sides];
      console.log ('m2', m2);
      //y-intercept for second line
      var b2 = poly_midpoints [(i + 3) % num_sides];

      // calculate x-coordinates of point of intersection
      var x = (b2-b1)/(m1-m2);
      console.log('x',x);
      // calculate y-coordinates of point of intersection
      var y = ((m1 * b2) - (m2 * b1))/(m1-m2);
      console.log('y',y);
      poly_points.push([x]);
      poly_points.push([y]);

  } // end for(i)
console.log ('this feature doesn\'t work quite yet' );
break;
*/
  ////////////////////////////////////////////
	//   Draw polygon circumscribing circle	
  ////////////////////////////////////////////
	case 0:
  // variables evaluate to infinity so this part of the code must be left commented out

console.log('polygon circumscribing circle');
var dtheta = (2.0*Math.PI)/num_sides; //determines angle between points of intersection with the triangle
  var totAngles = (num_sides - 2)*180;
  var th = totAngles/num_sides;

  rPoly = sin(180-th/2-dtheta)*r/sin(th/2);

console.log (rPoly);
	
 
  //calculate the tangent lines to the circle which are the polygon lines
	for(i=0.0; i<num_sides; i++){
    //update theta
    var theta = dtheta * i;
    //points of intersection with the circle
    var x = rPoly * cos(theta);
    var y = rPoly * sin(theta);
        //add the points of intersection as vertices of the polygon
    poly_points.push([x]);
    poly_points.push([y]);
	} // end for(i)
console.log ('case 0' );
break;

	//draw polygon inscribed in circle
	case 1:
  console.log("draw polygon inscribed in circle");

	//create points for the polygon
	 var dtheta = (2.0*Math.PI)/num_sides;	//determines angle between points of intersection with the triangle
	
	for (i = 0.0; i < num_sides; i++)
	{
    var theta = dtheta *i;
    //parametric equations to find points where the polygon intersects the circle
    var  x = r*cos(theta);
    var y = r*sin(theta);

    //add the points of intersection as vertices of the polygon
		poly_points.push([x]);
		poly_points.push([y]);
	}// end for
  console.log(poly_points);
	break;
}//end switch

var poly_f_points = new Float32Array (poly_points);	//stores polygon vertices

/////////////////////////////////////////////////
// Create  and bind a buffer object for polygon
/////////////////////////////////////////////////

	  // Create a buffer object
  var polyBuffer = gl.createBuffer();
  if (!polyBuffer) {
    console.log('Failed to create the polygon buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, polyBuffer);
  // Write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, poly_f_points, gl.STATIC_DRAW);
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
  
  num_sides = poly_points.length/2;

return num_sides; //number of vertices
}//end initVertexBuffers