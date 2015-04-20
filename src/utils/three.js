
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