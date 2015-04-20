/*! protozoo_utils 2015-04-20 */
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();


// Set the com.protozoo namespace and "pz" as shorcut access
var com = com || {};
com.protozoo = {
  math:{}
};
pz = window.com.protozoo;


// Make sure console.log exists, to prevent JS error in older Internet Explorer versions
if( window.console == undefined ){ 
	window.console = { 
		log : function( str ) {} 
	}
}

// A shortcut for console.log
//var log = console.log.bind(console);








// A simple dictionary structure with accessible contents list
pz.HashMap = Class.extend({
	init: function(){
		console.log( "New HashMap created" );
		this.list = [];
		this.dictionary = {};
	}, 

	addItem: function( item, idAttribute )
	{
		//console.log( "addItem() called" );
		if( !idAttribute ){
			idAttribute = "id";
		}
		if( !item[ idAttribute ] ){
			console.info( "Item doesn't include requested idAttribute '"+idAttribute+"' (by default will use 'id')"); return;
		}
		if( this.dictionary[ item[ idAttribute ] ] ){
			console.info( "Item with id '"+item[ idAttribute ]+"' already exists"); return false;
		}
		this.list.push( item );
		this.dictionary[ item[ idAttribute ] ] = item;
		return true;
	},

	getById: function( id )
	{
		return this.dictionary[id];
	}
});


// Creates a HashMap from an array of objects
pz.HashMap.fromArray = function( array, idAttribute )
{
	console.log( "HashMap.fromArray() called" );
	if( !idAttribute ){
		idAttribute = "id";
	}
	var result = new pz.HashMap();
	for (var i = 0; i < array.length; i++) {
		var item = array[i];
		result.addItem( item, idAttribute );
	};
	return result;
}
/*
	List datastructure, as described in
	"Data Structures and Algorithms with Javascript", O'Reilly

	Iterator implementation example:
	for(names.front(); names.currPos() < names.length(); names.next()) { 
		print(names.getElement());
	}
*/

function List()
{
	this.listSize = 0;
	this.pos = 0;
	this.dataStore = [];
	this.clear = clear;
	this.find = find;
	this.toString = toString;
	this.insert = insert;
	this.append = append;
	this.remove = remove;
	this.front = front;
	this.end = end;
	this.prev = prev;
	this.next = next;
	this.length = length;
	this.currPos = currPos;
	this.moveTo = moveTo;
	this.getElement = getElement;
	this.length = length;
	this.contains = contains;

	this.append = function(element) { 
		this.dataStore[this.listSize++] = element;
	}

	this.find = function(element) {
		for (var i = 0; i < this.dataStore.length; ++i) {
			if (this.dataStore[i] == element) { 
				return i;
			} 
		}
		return -1; 
	}

	this.remove = function(element) {
		var foundAt = this.find(element); 
		if (foundAt > -1) {
			this.dataStore.splice(foundAt,1); --this.listSize;
			return true;
		}
		return false; 
	}

	this.length = function() { 
		return this.listSize;
	}

	this.toString = function() { 
		return this.dataStore;
	}

	this.insert = function(element, after) { 
		var insertPos = this.find(after); 
		if (insertPos > -1) {
			this.dataStore.splice(insertPos+1, 0, element); ++this.listSize;
			return true;
		}
		return false; 
	}

	this.clear = function() {
		delete this.dataStore; this.dataStore = []; 
		this.listSize = this.pos = 0;
	}

	this.contains = function(element) {
		for (var i = 0; i < this.dataStore.length; ++i) {
			if (this.dataStore[i] == element) { 
				return true;
			} 
		}
		return false; 
	}

	this.front = function() { 
		this.pos = 0;
	}

	this.end = function() {
		this.pos = this.listSize-1;
	}

	this.prev = function() {
		if (this.pos > 0) {
		--this.pos; 
		}
	}

	this.next = function() {
		if (this.pos < this.listSize-1) {
			++this.pos; 
		}
	}

	this.currPos = function() { 
		return this.pos;
	}

	this.moveTo = function(position) { 
		this.pos = position;
	}

	this.getElement = function() {
		return this.dataStore[this.pos];
	}


}
function Node(element) { 
	this.element = element;
 	this.next = null;
 	this.previous = null;

}

function LList( circular ) {
	if( circular)
		this.circular = true;
	else
		this.circular = false;
	this.head = new Node("head");
	if( this.circular )
		this.head.next = this.head
	this.find = find;

	this.insert = insert;
	this.display = display;
	this.remove = remove;
	this.findLast = findLast;
	this.dispReverse = dispReverse;
}

function dispReverse() {
	var currNode = this.head;
	currNode = this.findLast();
	while (!(currNode.previous == null)) {
		print(currNode.element);
		currNode = currNode.previous;
	}
}

function findLast() {
	var currNode = this.head;
	if( !this.circular ){
		while (!(currNode.next == null)) {
			currNode = currNode.next;
		}
		return currNode;
	}else{
		while (!(currNode.next == null) &&
              !(currNode.next.element == "head")) {
			print(currNode.next.element);
			currNode = currNode.next;
		}
	}
}

function remove(item) {
	var currNode = this.find(item);
	if (!(currNode.next == null)) {
		currNode.previous.next = currNode.next;
		currNode.next.previous = currNode.previous;
		currNode.next = null;
		currNode.previous = null;
	}
}

function display() {
	var currNode = this.head;
	while (!(currNode.next == null)) {
		print(currNode.next.element);
		currNode = currNode.next;
	}
}

function find(item) {
	var currNode = this.head;

	while (currNode.element != item) {
		currNode = currNode.next;
	}
	return currNode;
}

function insert(newElement, item) { 
	var newNode = new Node(newElement);
	var current = this.find(item);
	newNode.next = current.next;
	newNode.previous = current;
	current.next = newNode;
}
function Queue() { 
	this.dataStore = [];
	this.enqueue = enqueue;
	this.dequeue = dequeue;
	this.front = front;
	this.back = back;
	this.toString = toString;
	this.empty = empty;

	function enqueue(element) { 
		this.dataStore.push(element);
	}

	function dequeue() {
		return this.dataStore.shift();
	}

	function front() {
		return this.dataStore[0];
	}

	function back() {
		return this.dataStore[this.dataStore.length-1];
	}

	function toString() {
		var retStr = "";
		for (var i = 0; i < this.dataStore.length; ++i) {
			retStr += this.dataStore[i] + "\n"; 
		}
		return retStr; 
	}
	
	function empty() {
		if (this.dataStore.length == 0) {
			return true; 
		}else {
			return false;
		} 
	}
}


function Stack() { 
	this.dataStore = []; 
	this.top = 0; 
	this.push = push; 
	this.pop = pop; 
	this.peek = peek;

	function push(element) { 
		this.dataStore[this.top++] = element;
	}

	function pop() {
		return this.dataStore[--this.top];
	}

	function peek() {
		return this.dataStore[this.top-1];
	}

	function length() { 
		return this.top;
	}

	function clear() {
		// Should we clear the array as well??
		// this.dataStore = [];
		this.top = 0;
	}
}

Array.zeroFilledArray = function(size) {
    return new Array(size + 1).join('0').split('');
}

Array.prototype.getRandom = function(){
	var result = this[Math.floor(Math.random()*this.length)];
	return result;
}

// Splits an array in multiple subarrays with arbitrary length
Array.prototype.chunk = function(chunkSize) {
    var R = [];
    for (var i=0; i<this.length; i+=chunkSize)
        R.push(this.slice(i,i+chunkSize));
    return R;
}


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

pz.utils = {
	// Sets multiple values from one object to another
	setMultipleValuesFromObject: function( targetObject, sourceObject )
	{
		for( var p in sourceObject ){
			targetObject[p] = sourceObject[p];
		}
	}, 

	CSVtoJSON: function( strData, strDelimiter ){
	// Function borrowed from here: https://gist.github.com/tracend/6011515
	// Check to see if the delimiter is defined. If not,
	// then default to comma.
		strDelimiter = (strDelimiter || ",");
		// FIX: add an ending carriage return if missing
		if( strData.substr(-1) !== "\n" ) strData += "\n";

		// Create a regular expression to parse the CSV values.
		var objPattern = new RegExp(
			(
				// Delimiters.
				"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

				// Quoted fields.
				"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

				// Standard fields.
				"([^\"\\" + strDelimiter + "\\r\\n]*))"
			),
			"gi"
			);


		// Create an array to hold our data.
		var jsonData = [];

		// Create an array to hold our individual pattern
		// matching groups.
		var arrMatches = null;
		var keys = [];
		var row = [];

		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec( strData )){

			// Get the delimiter that was found.
			var strMatchedDelimiter = arrMatches[ 1 ];

			// Check to see if the given delimiter has a length
			// (is not the start of string) and if it matches
			// field delimiter. If id does not, then we know
			// that this delimiter is a row delimiter.
			var newRow = strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter);

			if ( newRow ){
				// first row is the keys
				if(!keys.length){
					keys = row;
				} else {
					// Since we have reached a new row of data,
					// add an empty row to our data array.
					// combine row with keys
					var data = {};
					for( var i in row){
						data[ keys[i] ] = row[i];
					}
					jsonData.push( data );
				}
				// eighter way reset the row
				row = [];
			}


			// Now that we have our delimiter out of the way,
			// let's check to see which kind of value we
			// captured (quoted or unquoted).
			if (arrMatches[ 2 ]){

				// We found a quoted value. When we capture
				// this value, unescape any double quotes.
				var strMatchedValue = arrMatches[ 2 ].replace(
					new RegExp( "\"\"", "g" ),
					"\""
					);

			} else {

				// We found a non-quoted value.
				var strMatchedValue = arrMatches[ 3 ];

			}

			// Now that we have our value string, let's add
			// it to the data array.
			row.push( strMatchedValue );
		}

		// Return the parsed data.
		return( jsonData );
	}, 


	countDistinct: function( array, property )
	{
		var result_ob = {};
	  	var result_ar = [];

		if( property ){
			for (var i = 0; i < array.length; i++) {
		  		var item = array[i];
		  		var propertyValue = item[property];
		  		if( !result_ob[propertyValue] ){
		  			result_ob[propertyValue] = { count: 0 };
		  			result_ob[propertyValue][property] = propertyValue;
		  			result_ar.push( result_ob[propertyValue] );
		  		}
		  		result_ob[propertyValue].count++;
		  	};	
		}
		else
		{
			property = "name";	
			for (var i = 0; i < array.length; i++) {
		  		var item = array[i];
		  		var propertyValue = item;
		  		if( !result_ob[propertyValue] ){
		  			result_ob[propertyValue] = { count: 0 };
		  			result_ob[propertyValue][property] = propertyValue;
		  			result_ar.push( result_ob[propertyValue] );
		  		}
		  		result_ob[propertyValue].count++;
		  	};			
		}
	  	
	  	return result_ar;
	}, 


	groupBy: function( array, property )
	{
		var result_ob = {};
	  	var result_ar = [];
		for (var i = 0; i < array.length; i++) {
	  		var item = array[i];
	  		var propertyValue = item[property];
	  		if( !result_ob[propertyValue] ){
	  			result_ob[propertyValue] = [];
	  			result_ar.push( result_ob[propertyValue] );
	  		}
	  		result_ob[propertyValue].push(item);
	  	};	
	  	
	  	return result_ar;
	}, 


	sortArray: function( array, property, direction )
	{
		if( !direction ) direction = "desc";
	  	array.sort( function(a,b){
	  		if( direction == "asc" ){
		  		if(a[property] < b[property]) return -1;
			    if(a[property] > b[property]) return 1;
			    return 0;
		  	}else if( direction == "desc" ){
		  		if(a[property] > b[property]) return -1;
			    if(a[property] < b[property]) return 1;
			    return 0;
		  	}else{
		  		console.error( "direction must be 'asc' or 'desc'")
		  	}
		  })
	}, 


	concatenateProperty: function( array, property, concatChar )
	{
		var result = "";
		for (var i = 0; i < array.length; i++) {
			var item = array[i];
			var value = item[property];
			result += value + concatChar;
		};
		return result;
	}, 


};

pz.three = {};
pz.three.createWorld = function( containerId, eventHandlers, cameraOptions, rendererOptions )
{
	// Create the world object
	var world = {};
	world.objects = [];

	world.clickHandler = eventHandlers.clickHandler;
	world.mouseOverHandler = eventHandlers.mouseOverHandler;
	world.mouseOutHandler = eventHandlers.mouseOutHandler;
	world.mouseMoveHandler = eventHandlers.mouseMoveHandler;
	world.mouseWheelHandler = eventHandlers.mouseWheelHandler;

	// Find container. If not present, exit
	var container = document.getElementById( containerId );
	if( !container )
		throw new Error( { message:"Element with id="+containerId + " not found in document"} );
	world.container = container;

	// set CAMERA
	// -------------------------------------------------------
	var defaultCameraOptions = { 
									fov:45, 
									aspectRatio:window.innerWidth / window.innerHeight,  
									near: 0.1, 
									far: 2000, 
									cameraBoundsX: [0, 1000], 
									cameraBoundsY: [0, 100]
								};
	// override default values with requested ones
	for( var p in cameraOptions ){
		if( p != "type" ){
			defaultCameraOptions[p] = cameraOptions[p];
		}
	}

	// Create CAMERA
	//f( !cameraOptions )
	cameraOptions = defaultCameraOptions;
	world.cameraOptions = cameraOptions;

	var camera;
	if( cameraOptions.type == "perspective" || !cameraOptions.type )
	{
		camera = new THREE.PerspectiveCamera( defaultCameraOptions.fov, defaultCameraOptions.aspectRatio, defaultCameraOptions.near, defaultCameraOptions.far );
	}else{
		throw new Error( {message:"Unable to create camera with type="+cameraOptions.type } );
	}

	var mouseDetect_L = d3.scale.pow();
	mouseDetect_L.domain([500,300])
	mouseDetect_L.range([0,1]);

	var mouseDetect_R = d3.scale.pow();
	mouseDetect_R.domain([window.innerWidth-200,window.innerWidth])
	mouseDetect_R.range([0,1]);

	var mouseDetect_T = d3.scale.pow();
	mouseDetect_T.domain([150,0])
	mouseDetect_T.range([0,1]);

	var mouseDetect_B = d3.scale.pow();
	mouseDetect_B.domain([window.innerHeight-150,window.innerHeight])
	mouseDetect_B.range([0,1]);

	camera.update = function()
	{
		switch( camera.interactionMode ){
			case "horizontalScroll":	

				var friction = 0.95;
				var maxSpeedX = 10;
				var maxSpeedY = 0.25;

				if( !camera.angularSpeedX )
					camera.angularSpeedX = 0;
				if( !camera.angularSpeedY )
					camera.angularSpeedY = 0;

				var accelX1 = mouseDetect_L(window.mouseX);
				var accelX2 = mouseDetect_R(window.mouseX);
				var accelY1 = mouseDetect_T(window.mouseY);
				var accelY2 = mouseDetect_B(window.mouseY);

				// To-do: this is a dirty patch for Warp's app
				// it should be handled correctly
				if( accelX1 > 1 )
					accelX1 = 0;

				//console.log( "accelX1: ", accelX1 );	
				
				var accelX = 0;
				var accelY = 0;
				var directionX;
				var directionY;
				if( accelX1 > 0){
					accelX = accelX1;
					directionX = -1;
				}else if( accelX2 > 0){
					accelX = accelX2;
					directionX = 1;
				}
				if( accelY1 > 0){
					accelY = accelY1;
					directionY = -1;
				}else if( accelY2 > 0){
					accelY = accelY2;
					directionY = 1;
				}

				var camYGain = Mathutils.map( 
						world.cameraOptions.cameraBoundsY.min, 
						world.cameraOptions.cameraBoundsY.max, 
						0.5, 
						2, 
						world.camera.position.y
					);
				accelX *= camYGain;




				//console.log( "accelX: " + accelX );
				if( Math.abs(accelX) > 0 )
					camera.angularSpeedX += accelX*0.1*directionX;
				if( Math.abs(accelY) > 0 )
					camera.angularSpeedY += accelY*0.1*directionY;

				camera.angularSpeedX*=friction;
				camera.angularSpeedY*=friction;

				if( camera.angularSpeedX > maxSpeedX )
					camera.angularSpeedX = maxSpeedX;
				if( camera.angularSpeedX < -maxSpeedX )
					camera.angularSpeedX = -maxSpeedX;
				if( camera.angularSpeedY > maxSpeedY )
					camera.angularSpeedY = maxSpeedY;
				if( camera.angularSpeedY < -maxSpeedY )
					camera.angularSpeedY = -maxSpeedY;
				//camera.angularSpeedY += (window.mouseY/window.innerHeight-0.5)*0.02;

				world.camera_pointer.position.x += camera.angularSpeedX;
				world.camera_pointer.position.z += camera.angularSpeedY;

				//console.log( "XXX ", world.camera_pointer.position.z )
				if(world.camera_pointer.position.z > 0 )
					world.camera_pointer.position.z = 0 ;
				if(world.camera_pointer.position.z < -40 )
					world.camera_pointer.position.z = -40 ;

				if(world.camera_pointer.position.x > world.cameraOptions.cameraBoundsX.max )
					world.camera_pointer.position.x = world.cameraOptions.cameraBoundsX.max ;
				if(world.camera_pointer.position.x < world.cameraOptions.cameraBoundsX.min )
					world.camera_pointer.position.x = world.cameraOptions.cameraBoundsX.min ;
				
				//world.camera.position.y = 150;
				world.camera.position.x += ((world.camera_pointer.position.x-5 - world.camera.position.x)/2);
				world.camera.position.z += ((world.camera_pointer.position.z+20 - world.camera.position.z)/2);
				//world.camera.position.y = 30+Math.sqrt( Math.abs(world.camera.angularSpeedX)*Math.abs(world.camera.angularSpeedY))*100;
				//camera.angularSpeedX = 0;
				// var timer = Date.now() * 0.0001;
				//world.camera.position.x = Math.cos( camera.angularSpeedX ) * 520;
				//world.camera.position.z = Math.sin( camera.angularSpeedX ) * 520;
				//world.camera.position.y = 100 - (window.mouseY/window.innerHeight-0.5)*50;
				// if( world.selectedObject )
				// 	world.camera.lookAt( world.selectedObject.position );
				// else
				// 	world.camera.lookAt( world.scene.position );
				break;


			case "lockedPosition":	
				break;

		}
		world.camera.lookAt( world.camera_pointer.position );
	}

	camera.position.x = 0;
	camera.position.y = 100;
	camera.position.z = 1000;

	camera.angularSpeedX = 0;
	camera.angularSpeedY = 0;
	camera.angularSpeedZ = 0;

	camera.interactionMode = "horizontalScroll";
	camera.setMode = function( mode, options ){
		camera.interactionMode = mode;	
		camera.interactionModeOptions = options;	
		switch( camera.interactionMode ){
			case "horizontalScroll":				
				break;
			case "lockedPosition":	
				var distX = Math.abs( options.position.x-world.camera_pointer.position.x )*10;
				var camSpeed = Math.min( 3000, distX );
		    	world.pointerGoto( options.position.x, options.position.y, options.position.z-2, camSpeed);
		    	world.cameraGoto( options.position.x < world.camera_pointer.position.x ? options.position.x-options.offset.x : options.position.x+options.offset.x, options.position.y+options.offset.y, options.position.z+options.offset.z, camSpeed ); 
				break;
		}
	}

	world.camera = camera;
	world.camera.defaultPosition = { x: 0, y: 100, z: -500 };

	world.camera_pointer = { 
		defaultPosition:{ x:0, y:0, z:0 },  
		position:{ x:0, y:0, z:0 } 
	};
	world.cameraGoto = function( x, y, z, duration, onComplete )
	{
		world.camera.animationMode = true;	
		world.camera.angularSpeedX = 0;
		world.camera.angularSpeedY = 0;
		duration = duration || 1000;
		$( world.camera.position ).stop().animate( { 
	  		x:x || world.camera.position.x, 
	  		y:y || world.camera.position.y, 
	  		z:z || world.camera.position.z 
	  	}, duration, "easeInOutCubic", function(){
	  		world.camera.animationMode = false;
	  		if( onComplete )
	  			onComplete();
	  	 })
	}
	world.pointerGoto = function( x, y, z, duration, onComplete )
	{
		world.camera.animationMode = true;	
		world.camera.angularSpeedX = 0;
		world.camera.angularSpeedY = 0;
		duration = duration || 1000;
		$( world.camera_pointer.position ).stop().animate( { 
	  		x:x, 
	  		y: y, 
	  		z:z 
	  	}, duration, "easeInOutCubic", function(){
			world.camera.animationMode = false;	
	  		if( onComplete )
	  			onComplete();
	  	 })
	}
	world.resetPointerPosition = function()
	{
		var pointer = world.camera_pointer;
		$( pointer.position ).animate( { 
	  		x:pointer.defaultPosition.x, 
	  		y: pointer.defaultPosition.y, 
	  		z:pointer.defaultPosition.z 
	  	}, 1000, "easeInOutCubic" );
	}
	world.resetCameraPosition = function()
	{
		var camera = world.camera;
		$( camera.position ).animate( { 
	  		x:camera.defaultPosition.x, 
	  		y: camera.defaultPosition.y, 
	  		z:camera.defaultPosition.z 
	  	}, 1000, "easeInOutCubic" );
	}

	// Create SCENE
	// -------------------------------------------------------
	world.scene = new THREE.Scene();
	
	// Create Projector
	// -------------------------------------------------------
	world.projector = new THREE.Projector();

	// Create RENDERER
	// -------------------------------------------------------
	world.renderer = new THREE.WebGLRenderer();
	world.renderer.setClearColor( 0x201d2d );
	world.renderer.setSize( window.innerWidth, window.innerHeight );
	world.container.appendChild( world.renderer.domElement );


	// Create LIGHTS
	// To-do: make this configurable
	// var ambientLight = new THREE.AmbientLight( Math.random() * 0x10 );
	// world.scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
	directionalLight.position.x = Math.random() - 0.5;
	directionalLight.position.y = Math.random() - 0.5;
	directionalLight.position.z = Math.random() - 0.5;
	directionalLight.position.normalize();
	world.scene.add( directionalLight );

	var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
	directionalLight.position.x = Math.random() - 0.5;
	directionalLight.position.y = Math.random() - 0.5;
	directionalLight.position.z = Math.random() - 0.5;
	directionalLight.position.normalize();
	world.scene.add( directionalLight );

	// Create STATS
	// -------------------------------------------------------
	// world.stats = new Stats();
	// world.stats.domElement.style.position = 'absolute';
	// world.stats.domElement.style.top = '0px';
	// container.appendChild( world.stats.domElement );

	// REgister to window events
	world.onMouseMove = function(e){
		//console.log( "Mouse move: " + e.clientX + ", " + e.clientY );
		window.mouseX = e.clientX;
		window.mouseY = e.clientY;
		world.mouseMoveHandler(e);
	}

	world.onWindowResize = function()
	{
		world.camera.left = window.innerWidth / - 2;
		world.camera.right = window.innerWidth / 2;
		world.camera.top = window.innerHeight / 2;
		world.camera.bottom = window.innerHeight / - 2;


		world.renderer.setSize( window.innerWidth, window.innerHeight );
		world.camera.aspect = window.innerWidth / window.innerHeight;
		world.camera.updateProjectionMatrix();

	}
	
	world.lastObjectUnderMouse = null;

	world.findObjectUnderMouse = function( event )
	{
		if( !event )
			event = { clientX:window.mouseX || 0, clientY:window.mouseY || 0 };
		var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		world.projector.unprojectVector( vector, world.camera );

		var raycaster = new THREE.Raycaster( world.camera.position, vector.sub( world.camera.position ).normalize() );

		var intersects = raycaster.intersectObjects( world.objects );

		if ( intersects.length > 0 ) {
			return intersects[ 0 ].object;
		}
		return null;
	}


	world.onMouseDown = function(event)
	{
		//event.preventDefault();
		var object = world.findObjectUnderMouse( event );
		//if( object ){
			if( event.target.parentNode == world.container )
				world.clickHandler( object );
		//}
		
	}

	world.onMouseWheel = function(e) {
		e.preventDefault();
		// cross-browser wheel delta
		var e = window.event || e; // old IE support
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		//world.cameraGoto( null, world.camera.position.y+(delta*2), null, 100)
		world.camera.position.y += -delta*5;
		
		console.log(" Wheel: ", delta, world.camera.position.y, world.cameraOptions.cameraBoundsY );
		// Make sure camera Y position os within bounds
		if( world.camera.position.y < world.cameraOptions.cameraBoundsY.min )
			world.camera.position.y = world.cameraOptions.cameraBoundsY.min;
		if( world.camera.position.y > world.cameraOptions.cameraBoundsY.max )
			world.camera.position.y = world.cameraOptions.cameraBoundsY.max;

		world.mouseWheelHandler(e);
	}

	window.addEventListener( 'resize', world.onWindowResize, false );
	window.addEventListener( 'mousemove', world.onMouseMove, false );
	document.addEventListener( 'mousedown', world.onMouseDown, false );

	// IE9, Chrome, Safari, Opera
	world.container .addEventListener("mousewheel", world.onMouseWheel, false);
	// Firefox
	document.addEventListener("DOMMouseScroll", world.onMouseWheel, false);

	// Animation engine
	world.render = function()
	{
		world.camera.update();

		world.renderer.render( world.scene, world.camera );

	}

	world.animate = function()
	{
		requestAnimationFrame( world.animate );
		var object = world.findObjectUnderMouse(  );
		

		// if( object && object != world.lastObjectUnderMouse ){
		// 	//console.log( "OVER: ", object.data.author );
		// 	if( world.lastObjectUnderMouse )
		// 		world.lastObjectUnderMouse.material.color.setHex( world.lastObjectUnderMouse.normalColor );
		// 	world.lastObjectUnderMouse = object;
		// 	world.lastObjectUnderMouse.material.color.setHex( world.lastObjectUnderMouse.overColor );
		// 	world.mouseOverHandler( object );
			

		// }
		// if( !object && world.lastObjectUnderMouse){
		// 	world.lastObjectUnderMouse.material.color.setHex( world.lastObjectUnderMouse.normalColor );
		// 	world.lastObjectUnderMouse = null;
		// 	world.mouseOutHandler( object );
		// }

		// if( object ){
		// 	world.mouseM
		// }
		world.render();
		//world.stats.update();
	}

	
	




	world.addMesh = function( geometry, color, position, texture )
	{
		// Create the material
		var config = { 
						color: color, 
						shading: THREE.FlatShading, 
						overdraw: 0.5						
					} ;
		if( texture )
			config.map = THREE.ImageUtils.loadTexture( texture )

		var material = new THREE.MeshBasicMaterial( config );
		// Create the mesh
		var mesh = new THREE.Mesh( geometry, material );

		// position
		if( !position ){
			position = { x:0, y:0, z:0 };
		}else if( position == "random" ){
			position = { x:Math.random()*1000-500, y:Math.random()*1000-500, z:Math.random()*1000-500 };
		}
		mesh.position.x = position.x;
		mesh.position.y = position.y;
		mesh.position.z = position.z;

		// Add it to the scene
		world.scene.add( mesh );

		// Store it in the objects list
		world.objects.push(mesh);

		// Return it
		return mesh;
	}



	world.addPlane = function( options, position )
	{
		// DEfault options
		var defaultOptions = { 
								width: 10, 
								height: 10, 
								texture: null
							};

		// override default values with requested ones
		pz.utils.setMultipleValuesFromObject( defaultOptions, options );



		// actual text
		var materialConfig = {
          	side: THREE.DoubleSide
          };
	      if( defaultOptions.texture ){
				materialConfig.map = THREE.ImageUtils.loadTexture( defaultOptions.texture );
			}

          var material = new THREE.MeshBasicMaterial(materialConfig);
          material.transparent = true;
          
         //material.transparent = true;
          var geom = new THREE.PlaneGeometry( defaultOptions.width, defaultOptions.height );
          //var geom = new THREE.PlaneGeometry( 10, 10 );
          var text = new THREE.Mesh( geom, material );
          //text.doubleSided = true;
          //text.rotation.x = Math.PI/2;
          text.position.x = position.x;
          text.position.y = position.y;
          text.position.z = position.z;
          world.scene.add( text );
          world.objects.push(text);
          return text;
	}

	world.addCube = function( options, color, position )
	{
		// DEfault options
		var defaultOptions = { 
								width: 10, 
								height: 10, 
								depth: 10, 
								widthSegments: 1, 
								heightSegments: 1, 
								depthSegments: 1, 
								texture: null
							};

		// override default values with requested ones
		pz.utils.setMultipleValuesFromObject( defaultOptions, options );

		// Create the primitive
		var geometry = new THREE.BoxGeometry( defaultOptions.width, 
												defaultOptions.height, 
												defaultOptions.depth, 
												defaultOptions.widthSegments, 
												defaultOptions.heightSegments, 
												defaultOptions.depthSegments 
											);
		// Create the mesh
		var mesh = world.addMesh( geometry, color, position, defaultOptions.texture );		

		// And return it
		return mesh;
	}


	world.addCylinder = function( options, color, position )
	{
		// DEfault options
		var defaultOptions = { 
								radiusTop: 10, 
								radiusBottom: 10, 
								height: 10, 
								radiusSegments: 6, 
								heightSegments: 1, 
								openEnded: false
							};

		// override default values with requested ones
		pz.utils.setMultipleValuesFromObject( defaultOptions, options );

		// Create the primitive
		var geometry = new THREE.CylinderGeometry( defaultOptions.radiusTop, 
												defaultOptions.radiusBottom, 
												defaultOptions.height, 
												defaultOptions.radiusSegments, 
												defaultOptions.heightSegments, 
												defaultOptions.openEnded 
											);
		// Create the mesh
		var mesh = world.addMesh( geometry, color, position );		

		// And return it
		return mesh;
	}





	world.addCurveLine = function( pointA, pointB, color, lineWidth )
	{
		var numPoints = 100;

		var distX = pointB.x-pointA.x;
		var distY = pointB.y-pointA.y;
		var dist = Math.sqrt( (distX*distX)+(distY*distY) );

		var spline = new THREE.SplineCurve3([
		   new THREE.Vector3(pointA.x, pointA.y, pointA.z),
		   new THREE.Vector3(pointA.x+(pointB.x-pointA.x)/2, pointA.y+(pointB.y-pointA.y)/2+dist*0.3, pointA.z+(pointB.z-pointA.z)/2), 
		   new THREE.Vector3(pointB.x, pointB.y, pointB.z)
		]);

		var material = new THREE.LineBasicMaterial({
		    color: color,
		    linewidth: lineWidth || 1
		});

		var geometry = new THREE.Geometry();
		var splinePoints = spline.getPoints(numPoints);

		for(var i = 0; i < splinePoints.length; i++){
		    geometry.vertices.push(splinePoints[i]);  
		}

		var line = new THREE.Line(geometry, material);
		world.scene.add(line);

		return line;
	}

	world.addLine = function( pointA, pointB, color, lineWidth )
	{
		var numPoints = 100;

		var distX = pointB.x-pointA.x;
		var distY = pointB.y-pointA.y;
		var dist = Math.sqrt( (distX*distX)+(distY*distY) );

		var material = new THREE.LineBasicMaterial({
		    color: color,
		    linewidth: lineWidth || 1
		});

		var geometry = new THREE.Geometry();
		geometry.vertices.push( pointA );
		geometry.vertices.push( pointB );

		var line = new THREE.Line(geometry, material);
		world.scene.add(line);
		console.log( "Line: ", line );

		return line;


		
	}

	world.animate();
	return world;

}

// Angular service to dynamicaly load D3 lib
window.visAngular = angular.module('d3BasicCharts', [] );

  // d3 module
  angular.module('d3', [])
  .factory('d3Service', ['$document', '$q', '$rootScope',
    
    function($document, $q, $rootScope) 
    {
      log( "d3Service");
      var d = $q.defer();

      function onScriptLoad() {
        // Load client in the browser
        $rootScope.$apply(function() { d.resolve(window.d3); });
      }

      // Create a script tag with d3 as the source
      // and call our onScriptLoad callback when it
      // has been loaded
      var scriptTag = $document[0].createElement('script');
      scriptTag.type = 'text/javascript'; 
      scriptTag.async = true;
      scriptTag.src = 'http://d3js.org/d3.v3.min.js';

      // Register ready state
      scriptTag.onreadystatechange = function () {
        if (this.readyState == 'complete') onScriptLoad();
      }
      scriptTag.onload = onScriptLoad;

      // Inject script tag
      var s = $document[0].getElementsByTagName('body')[0];
      s.appendChild(scriptTag);

      return {
        d3: function() { return d.promise; }
      };
}]);
/*
  A simple D3 bar chart as an Angular directive
 */
visAngular
  .directive('horizontalBars', ['d3Service', function(d3Service) {
    return {
      restrict: 'EA',
      scope: {}, 
      link: function(scope, element, attrs) {
        console.log("d3Service 2", scope, element, attrs);
        d3Service.d3().then(function(d3) {

          scope.onElementClick = function(element)
          {
            console.log( "element clicked: ", element );
            scope.elementClickHandler( element );
          }

          // Collect variables from HTML attributes
          var margin = parseInt(attrs.margin) || 20,
          barWidth = parseInt(attrs.barWidth) || 20,
          barPadding = parseInt(attrs.barPadding) || 5, 
          valueProperty = attrs.valueProperty, 
          fillColor = attrs.fillColor;

          // Store element click event handler
          scope.elementClickHandler = eval( attrs.elementClickHandler );

          // Attempt to get dataset from HTML attribute
          try
          {
            dataset = eval(attrs.dataset) || [];
          }catch(e){
            console.log( "no dataset at bars");
            return;

          }

          // Store dataset
          scope.dataset = dataset;

          // Create theSVG object
          var svg = d3.select(element[0])
            .append('svg')
            .style('width', '100%')        
            .style('height', '100%');      

          // Browser onresize event
          window.onresize = function() {
            scope.$apply();
          };          

          // Watch for resize event
          scope.$watch(function() {
            return angular.element(window)[0].innerWidth;
          }, function() {
            scope.render();
          });

          
          // *********    RENDER Function    ********
          // ========================================
          scope.render = function() {
            // remove all previous items before render
            svg.selectAll('*').remove();

            // If we don't pass any scope.dataset, return out of the element
            if (!scope.dataset)
            { 
              console.log( "·LINK NOT scope.dataset");
              return;
            }

            
            // setup variables
            var canvasWidth = d3.select(element[0]).node().offsetWidth;
            var canvasHeight = d3.select(element[0]).node().offsetHeight;

            var width = d3.select(element[0]).node().offsetWidth - margin*2,
                height = d3.select(element[0]).node().offsetHeight - margin*2,
                // our xScale
                xScale = d3.scale.linear()
                  .domain([0, d3.max(scope.dataset, function(d) {
                    return d[valueProperty];
                  })])
                  .range([0, height]);
            var color = d3.scale.linear()
              .domain( [0, d3.max(scope.dataset, function(d) {
                    return d[valueProperty];
                  })])
              .range( [ fillColor, fillColor ] );

            // set the height based on the calculations above
            svg.attr('height', canvasHeight);
            svg.attr('width', canvasWidth);
            
            barWidth = Math.max(2, (width-margin)/scope.dataset.length)

            //create the rectangles for the bar chart
            var barSprites = svg.selectAll('g')
              .data(scope.dataset)
              .enter()
              .append("g")
                .on("click", function(d){
                  scope.onElementClick(d)
                })



            var bars = barSprites.append('rect')
                .attr('height', 1)
                .attr('width', barWidth-barPadding)
                .attr('class', "horizontalBar")
                .attr('x',function(d,i) {
                  return margin + (i * (barWidth + barPadding));
                })
                .attr('y', height+margin)
                .attr('fill', function(d) { return color(d[valueProperty]); })
                // .on("mouseover", function(d), function(d){
                //   log( "OVER: ", d.id, d);
                // })
                
                .transition()
                  .duration(1000)
                  .attr('height', function(d) {
                    return xScale(d[valueProperty]);
                  })
                  .attr('y', function(d) {
                    return margin+height-xScale(d[valueProperty]);
                  })
                ;
            var labels = barSprites.append("text")
                .attr("class", "caption2")
                .attr('x',function(d,i) {
                  return margin + (i * (barWidth + barPadding));
                })
                .attr('y', canvasHeight-margin/2)
                .text(function(d){ 
                  // To-do: this should be parametrized
                   var year = d.id;
                   return year % 5 == 0 ? year : null;
                });

            var barSensibleAreas = barSprites.append('rect')
                .attr('height', height)
                .attr('fill', "rgba(0,0,0,0)" )
                .attr('width', barWidth-barPadding)
                .attr('x',function(d,i) {
                  return margin + (i * (barWidth + barPadding));
                })
                .attr('y', margin)
                .on("mouseover", function() { 
                  console.log( this.parentElement.children[0] );
                    d3.select(this.parentElement.children[0])
                      .transition()
                      .duration(100)
                      .attr("fill", "white");
                  })
                  .on("mouseout", function() { 
                    d3.select(this.parentElement.children[0])
                      .transition()
                      .duration(300)
                      .attr("fill", fillColor);
                  });

          }
        });
      }};
  }]);

visAngular
  .directive('forceGraph', ['d3Service', function(d3Service) {
    return {
      restrict: 'EA',
      scope: {}, 
      link: function(scope, element, attrs) {
        console.log("forceGraph", scope, element, attrs);
        d3Service.d3().then(function(d3) {

          // Collect variables from HTML attributes
          var margin = parseInt(attrs.margin) || 20,
          barWidth = parseInt(attrs.barWidth) || 20,
          barPadding = parseInt(attrs.barPadding) || 5, 
          valueProperty = attrs.valueProperty, 
          fillColor = attrs.fillColor, 
          dataset = eval(attrs.dataset) || [];


          var color = d3.scale.category20();


          var svg = d3.select(element[0]).append("svg")
            .style('width', '100%')        
            .style('height', '100%');   


          // Browser onresize event
          window.onresize = function() {
            scope.$apply();
          };          

          // Watch for resize event
          scope.$watch(function() {
            return angular.element(window)[0].innerWidth;
          }, function() {
            scope.render();
          });   

          // *********    RENDER Function    ********
          // ========================================
          scope.render = function() {

            // setup variables
            var canvasWidth = d3.select(element[0]).node().offsetWidth;
            var canvasHeight = d3.select(element[0]).node().offsetHeight;


            var force = d3.layout.force()
                .charge(-20)
                .linkDistance(20)
                .size([canvasWidth, canvasHeight]);

            var graph = dataset;
              force
                  .nodes(graph.nodes)
                  .links(graph.links)
                  .start();

              var link = svg.selectAll(".link")
                  .data(graph.links)
                .enter().append("line")
                  .attr("class", "link")
                  .style("stroke-width", function(d) { return 1; });

              var node = svg.selectAll(".node")
                  .data(graph.nodes)
                .enter().append("circle")
                  .attr("class", "node")
                  .attr("r", function(d){ 
                    return d.type == "artist" ? 2+Math.sqrt(d.model.releases.length)*1 : 2;
                   })
                  .style("fill", function(d) { 
                    return d.type == "artist" ? "#fc0" : fillColor;
                    //return fillColor; 
                    //return color(d.group); 
                  })
                  .on("mouseover", function(d){
                    log( "OVER: ", d.id, d);
                  })
                  .call(force.drag);

              node.append("title")
                  .text(function(d) { return d.name; });

              force.on("tick", function() {
                link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
              });
            


          };
        });
      }};
  }]);