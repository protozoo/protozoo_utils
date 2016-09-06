
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

pz.math.getUniqueRandomIntegers( min, max, count, sorted ) = function{
 if( min >= max || count > max-min ){
    throw( "Out of range. Please check your parameters");
 }
 // Generate list of integers
 var int_list = [];
 for( var i=min; i<max; i++ ){
   int_list.push(i);
 }
 // Pick random ones
 var results = [];
 for (var i = 0; i < count; i++) {
     var randIndex = Math.floor( Math.random()*int_list.length );
     var element = int_list.splice( randIndex, 1 );
     results.push( element[0] );     
 }
 // Sort, if requested to do so
 if( sorted )
    results.sort(function(a,b){ return a<b?-1:1});

 //console.log( results );
 return results;
};