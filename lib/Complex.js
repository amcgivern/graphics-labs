////////////////////////////////////////////////////////
//
//	Library for simple complex number operations
//
//	Dr. M. Wachowiak
//	COSC 3207 WI 2018
//
////////////////////////////////////////////



/////////////////////////////////////////////////////////////
//
//	Entry point
//
/////////////////////////////////////////////////////////////
function main() {
	var z0 = {Real: 0.0, Imag: 0.0};
	var z1 = {Real: 0.0, Imag: 0.0};
	var z2 = {Real: 0.0, Imag: 0.0};
	var z3 = {Real: 0.0, Imag: 0.0};
	var z = {Real: 0.0, Imag: 0.0};					// For answers.
	var v;											// For real-valued answers.
	
	z0.Real = 4.0;
	z0.Imag = -2.3;
	
	z1.Real = 11.7;
	z1.Imag = 0.5;
	
	z2.Real = 10.0;
	z2.Imag = 0.0;
	
	z3.Real = 0.0;
	z3.Imag = 3.8;
	
	// Test it.
	z = cplxMult(z0, z1);
	console.log('(' + cplxDisp(z0) + ')(' + cplxDisp(z1) + ') = ' + cplxDisp(z));

	z = cplxMult(z1, z2);
	console.log('(' + cplxDisp(z1) + ')(' + cplxDisp(z2) + ') = ' + cplxDisp(z));
	
	
	z = cplxAdd(z0, z1);
	console.log('(' + cplxDisp(z0) + ') + (' + cplxDisp(z1) + ') = ' + cplxDisp(z));

	z = cplxAdd(z2, z3);
	console.log('(' + cplxDisp(z2) + ') + (' + cplxDisp(z3) + ') = ' + cplxDisp(z));
	
	v = cplxMod(z0);
	console.log('||' + cplxDisp(z0) + '|| = ' + v);

	v = cplxMod(z1);
	console.log('||' + cplxDisp(z1) + '|| = ' + v);

	v = cplxMod(z2);
	console.log('||' + cplxDisp(z2) + '|| = ' + v);

	v = cplxMod(z3);
	console.log('||' + cplxDisp(z3) + '|| = ' + v);
	
	v = cplxPhase(z0);
	console.log('arg(' + cplxDisp(z0) + ') = ' + v);

	v = cplxPhase(z1);
	console.log('arg(' + cplxDisp(z1) + ') = ' + v);

	v = cplxPhase(z2);
	console.log('arg(' + cplxDisp(z2) + ') = ' + v);

	v = cplxPhase(z3);
	console.log('arg(' + cplxDisp(z3) + ') = ' + v);

	z = cplxSqr(z0);
	console.log('(' + cplxDisp(z0) + ')^2 = ' + cplxDisp(z));

	z = cplxSqr(z1);
	console.log('(' + cplxDisp(z1) + ')^2 = ' + cplxDisp(z));

	z = cplxSqr(z2);
	console.log('(' + cplxDisp(z2) + ')^2 = ' + cplxDisp(z));

	z = cplxSqr(z3);
	console.log('(' + cplxDisp(z3) + ')^2 = ' + cplxDisp(z));
	
	
	
}	// Main




//////////////////////////////////////////////
//
//	Complex number functions
//
//////////////////////////////////////////////

///////////////////////////////////////
//	Multiply two complex numbers.
///////////////////////////////////////
function cplxMult(a, b) {
	  var c = {Real: 0.0, Imag: 0.0};
	  
	  c.Real = a.Real * b.Real - a.Imag * b.Imag;
	  c.Imag = a.Real * b.Imag + a.Imag * b.Real;
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

///////////////////////////////////////
//	Modulus of a complex number.
///////////////////////////////////////
function cplxMod(a) {
	  var c;
	  
	  c = Math.sqrt(a.Real * a.Real + a.Imag * a.Imag);
	  return(c);
}
 
///////////////////////////////////////
//	Phase of a complex number.
///////////////////////////////////////
function cplxPhase(a) {
	  var c;
	  c = Math.atan2(a. Imag, a.Real);
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
//	Display a complex number.
///////////////////////////////////////
function cplxDisp(a) {
	if (a.Imag >= 0.0)
		return(a.Real.toString() + ' + ' + a.Imag.toString() + 'i');
	else
		return(a.Real.toString() + ' - ' + (-a.Imag).toString() + 'i');
}

//////////////////////////////////////////////
//	Ensure that a number is indeed complex.
//////////////////////////////////////////////
function ensureCplx(x) {
	  var z = {Real: 0, Imag: 0};
	  if (x.hasOwnProperty('Real')) {
		  z.Real = x.Real;
		  z.Imag = x.Imag;
	  }
	  else {
		  z.Real = x;
	  }
	  return(z);
}