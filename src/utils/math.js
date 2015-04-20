
// Projects a value from one numerical interval to another
pz.math.map = function( a1, a2, b1, b2, value ){
	var t = b1 + ( (value-a1)*(b2-b1) ) / (a2-a1);
	return t;
}

// Converts degrees to radians
pz.math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts radians to degrees
pz.math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

// Returns the radius of a given area
pz.math.areaToRadius = function( value )
{
	return Math.sqrt(value / Math.PI) * 2;
}