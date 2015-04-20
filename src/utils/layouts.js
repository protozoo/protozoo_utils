

/* ============================================
						LAYOUTS
   ============================================ */
pz.layouts = {};
pz.layouts.oracle = function( list, radius, radiusGap ){
	var result = [];
	var numSlices = list.length;
	var sliceAngle = Math.radians( 360 / numSlices );
	var isTable = list[0] instanceof Array;
	
	if( !isTable ){
		for (var i = 0; i < list.length; i++) {
			var position = {
				x: Math.cos( i*sliceAngle ) * radius,
				y: 0, 
				z: Math.sin( i*sliceAngle ) * radius,
			};
			result.push( position );
		};
	}else{
		for (var i = 0; i < list.length; i++) {
			var column = [];
			for (var j = 0; j < list[i].length; j++) {
				var position = {
					x: Math.cos( i*sliceAngle ) * (radius+(j*radiusGap)),
					y: 0, 
					z: Math.sin( i*sliceAngle ) * (radius+(j*radiusGap)),
				};
				column.push( position );
			}	
			result.push( column );		
		};
	}
	return result;	
}

 
pz.random = {};
pz.random.randomSpherePoint = function(x0,y0,z0,radius){
   var u = Math.random();
   var v = Math.random();
   var theta = 2 * Math.PI * u;
   var phi = Math.acos(2 * v - 1);
   var x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
   var y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
   var z = z0 + (radius * Math.cos(phi));
   return { x:x, y:y, z:z };
}


pz.layouts.randomOnSphere = function( list, radius ){
	var result = [];
	var isTable = list[0] instanceof Array;

	
	if( !isTable ){
		//console.error( "NOt yet implemented");
		for (var j = 0; j < list.length; j++) {
			var position = pz.random.randomSpherePoint(0, 0, 0, radius);
			result.push( position );	
		}	
	}else{

		for (var i = 0; i < list.length; i++) {
			var column = [];
			for (var j = 0; j < list[i].length; j++) {
				var position = pz.random.randomSpherePoint(0, 0, 0, radius);
				column.push( position );
			}	
			result.push( column );		
		};
	}
	return result;	
}

pz.layouts.spiral3D = function( list, radius, radiusGap ){
	var result = [];
	var numSlices = list.length;
	var isTable = list[0] instanceof Array;

	
	if( !isTable ){
		console.error( "NOt yet implemented");
		// for (var i = 0; i < list.length; i++) {
		// 	var sliceAngle = Math.radians( 360 / numSlices );
		// 	var position = {
		// 		x: Math.cos( i*sliceAngle ) * radius,
		// 		y: 0, 
		// 		z: Math.sin( i*sliceAngle ) * radius,
		// 	};
		// 	result.push( position );
		// };
	}else{
		for (var i = 0; i < list.length; i++) {
			var column = [];
			for (var j = 0; j < list[i].length; j++) {
				var position = {
					x: Math.cos(  Math.radians( 360*(list[i][j].normalDate.month()/12) ) ) * (radius+(j*radiusGap)),
					y: i*2, 
					z: Math.sin(  Math.radians( 360*(list[i][j].normalDate.month()/12) ) ) * (radius+(j*radiusGap)),
				};
				column.push( position );
			}	
			result.push( column );		
		};
	}
	return result;	
}