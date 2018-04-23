////////////////////////////////////////////////////////////////
//
//	Example of image processing - display grey level image. 
//
//	Amanda McGivern
// //	Adapted from Dr. Wachowiak
//	April 10, 2018
//	COSC 3207 WI 2018	
//
/////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////
//
//	Main function....
//
//////////////////////////////////////////////////////////////////////////
function main(){

	
	var canvas = document.getElementById("webgl");
	var ctx = canvas.getContext("2d");
	
	var width = canvas.width;
	var height = canvas.height;
	drawImage(ctx, width, height)
}	// Main

//////////////////////////////////////////////////////////
//
//	Draw the image....
//
//////////////////////////////////////////////////////////	
function drawImage(ctx, width, height) {
	
	var tMin = 9999999.9;	//minimum z value very large to start
	var tMax = -999999.9;	// maximum z value very small to start
	var xMin = -1.5;	// min x value
	var yMin = -1.5;	// min y values
	var xMax = 1.5;	// max x value
	var yMax = 1.5;	// max y value
	var c = {Real: 0.0, Imag:-0.8};	// complex number to check orbit
	const maxIterations = 300;	// maximum number of iterations
	var t; // time
	var x =0;
var y =0;
var z =0;	// variables for the x and y positions
	var escOrbit; // flag for when the number has escaped it orbit
	var zValue;	// the real value of the complex number
	var row, col,j;
	// Precomputing values for efficiency
	var yMult = (1/height)*(yMax - yMin);
	var xMult = (1/width)*(xMax - xMin)
	
	// create a 2D array to store the image data
	var img = new Array(width);
	for (var k = 0; k < width; k++) {
	img[k] = new Array(height);
	}
	
		// iterate through the columns
	 for (col = 0; col < width; col++){
		 x = (col * xMult)+ xMin;	// scale the x value
		// iterate through the rows
		for (row = 0; row < height; row ++){
			y = (row * yMult) + yMin;	// scale the y value
			z = {Real: x, Imag: y};	// create a new complex value for z
					// console.log(y);

			// Iterate to maximum amount
			while(t < maxIterations && !escOrbit){
				t++; // increase the time
				z = cplxSqr(z);	// square the current z value
				z = cplxAdd(z, c);	// Add the c value
				zValue = cplxMod(z);	// save the real value for comparison

				
				// check if the value is in the orbit
				if (zValue > 2.0){
				//console.log(t);	
				escOrbit = true;	// set the flag to true to escape loop
				}	
				else{
					escOrbit = false;
				}
			}
			if (t < tMin){
			tMin = t; // update minimum z value
			//console.log(tMin);
			}
			else if (t > tMax){
			tMax = t;
			//console.log(zMax);
			}	// update maximum z value
			//console.log(t);
			img[row][col] = t; // subtract one based on definition

			t = 0;
			escOrbit = false; // reset the escape flag
		}			
	 }

	var i, j, k;
	var imgData = ctx.createImageData(width, height);
	
	//////////////////////////////////////////////
	//	Chroma colour map.
	//	Named colours are available at:
	//  http://cng.seas.rochester.edu/CNG/docs/x11color.html
	//////////////////////////////////////////////
	console.log(tMin + " " + tMax);
	// Set an appropriate heatmap domain.
	//var heatmapScale = chroma.scale(['darkblue', 'blue', 'white', 'red', 'darkred']).domain([tMin, tMax]);
	var heatmapScale = chroma.scale(['darkolivegreen', 'pink', 'lavender', 'orchid', 'darkmagenta']).domain([tMin, tMax]);
	//var heatmapScale = chroma.scale(['black', 'white']).domain([0.0, 1.0]);	// min==0 to max= maxIt
	
	// the gray-level
	var colour;
	//console.log(img[50][500]);
	////////////////////////////////////////
	//	Set the image colours.
	////////////////////////////////////////
	k = 0;
	ki = 0;
	
	// for each column
	for (i = 0; i < width; i++) {	
		// for each row	
		for (j = 0; j < height; j++) {			
			// raw is a global variable from NU_0
			// Convert from decimal to range from 0-255
		//	colour = 255.0 * (1.0-raw[ki]); // currently negative

			/*imgData.data[k+0] = colour;	// red
			imgData.data[k+1] =	colour;	// green
			imgData.data[k+2] = colour;	// blue
			imgData.data[k+3] = 255.0;	// alpha -- opacity
			*/
			// For colour-mapping....
			colour = heatmapScale(img[i][j]).rgb();

			imgData.data[k+0] = colour[0];
			imgData.data[k+1] = colour[1];
			imgData.data[k+2] = colour[2];
			imgData.data[k+3] = 255.0;	// alpha -- opacity
		
			k += 4;	// stride is 4
			ki++; // increment raw index
		}
	}
    
	// Display the bit-mapped image using  a 2D Context method
	ctx.putImageData(imgData, 0, 0, 0, 0, width, height);
}


///////////////////////////////////////
//	Modulus of a complex number.
///////////////////////////////////////
function cplxMod(a) {
	  var c;
	  
	  c = Math.sqrt(a.Real * a.Real + a.Imag * a.Imag);
	  return(c);
}
///////////////////////////////////////////
//	Square a complex number.
//	(a + bi)(a + bi) = a^2 + 2abi - b^2
///////////////////////////////////////////
function cplxSqr(a) {
	var c = {Real: 0.0, Imag: 0.0};
	
	c.Real = ((a.Real * a.Real) - (a.Imag * a.Imag));
	c.Imag = 2.0 * a.Real * a.Imag;
	return(c);
}
///////////////////////////////////////
//	Add two complex numbers.
///////////////////////////////////////
function cplxAdd(a, b) {
		  
	  var c = {Real: 0.0, Imag: 0.0};
	  c.Real = a.Real + b.Real;
	  c.Imag = a.Imag + b.Imag;
	  return(c);
}

//////////////////////////////////////////////
//
//	Future image processing functions....
//
//////////////////////////////////////////////

