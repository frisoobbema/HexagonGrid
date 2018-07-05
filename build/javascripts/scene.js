var scene, camera, renderer, loadingManager, textureLoader, canvasWidth, canvasHeight;
var controls;
var main;

// Mouse vars
var raycaster = new THREE.Raycaster(); // create once
var mouse = new THREE.Vector2(); // create once

// Check if the browser supports webgl. If not alert the user.
if ( Detector.webgl ) {
	setupScene();
	animate();
} else {
	var warning = Detector.getWebGLErrorMessage();
	document.getElementById('container').appendChild(warning);
}

// Creates the ThreeJS scene.
function setupScene() {

	window.addEventListener( 'resize', onWindowResize, false );

	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;

	// Create HTML container for the different (renderer, fpsCounter) elements
	container = document.getElementById( 'canvas-wrapper' );

	loadingManager = new THREE.LoadingManager(loadingManager);
	textureLoader = new THREE.TextureLoader(loadingManager);

	// Setup the scene setting.
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );

	// Create the fist light and place in the scene.
	var light = new THREE.PointLight( 0xffffff, .5 );
	light.position.set( -100, 100, -100 );
	scene.add( light );

	// Create the second light and place in the scene.
	var light = new THREE.PointLight( 0xffffff, .5 );
	light.position.set( 100, 100, 100 );
	scene.add( light );

	// Create the scene camera
	camera = new THREE.PerspectiveCamera( 40, canvasWidth/canvasHeight, 1, 1000 );
	camera.updateProjectionMatrix();

	// Setup the ThreeJS render element.
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.localClippingEnabled = true;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setPixelRatio(window.devicePixelRatio * 1);
	renderer.setSize( canvasWidth, canvasHeight );

	// Add webGL renderer to the HTML page.
	container.appendChild( renderer.domElement );

	// Setup camera controls and settings.
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.maxPolarAngle = Math.PI * 0.5;

	// Set the camera init position.
	camera.position.x = -63;
	camera.position.y = 72;
	camera.position.z = 27;
	camera.updateProjectionMatrix();

	// Disable camara limits when debug is true;
	// controls.enablePan = false;
	// controls.minDistance = 50;
	// controls.maxDistance = 100;

	// Start main program
	main = new Main();

	// when the mouse moves, call the given function
 	document.addEventListener('mousemove', onMouseMove, false);

 	var el = document.getElementById('menu');

	el.onclick = function() {
		main.buttonClick()
	};
	
}

function onWindowResize ( ) {

	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;

	camera.aspect = canvasWidth / canvasHeight;
	camera.updateProjectionMatrix();

	animating = false;
	animationTimer = 0;

	renderer.setSize( canvasWidth, canvasHeight );
}

function onMouseMove ( event ) {
	mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
    main.mouseHexIntersection(raycaster);
}

function animate ( time ) {

	renderer.render( scene, camera );

	
	controls.update();

	requestAnimationFrame( animate );
}
