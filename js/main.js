'use strict';

// variables globales
var camera, scene, renderer, container, cube, controls, ambient, tooth, spotlLight, object, stats, datGUI, line, raycaster, guiControls, mesh;

// Carga de la página
window.onload = load_page;

function load_page(){
    // funcion de inicio
    init();
	animate();
}

// Init function
function init(){
	// Container
	container = document.createElement('div');
	container.className = "container_tooth";
	container.id = "container_tooth";
	document.body.appendChild(container);
	
	// Camera
	camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 2000);
	camera.position.set(40, 40, 40);
	
	// Scene
	scene = new THREE.Scene();
	
	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 1, 0 );
	// scene.add( light );
	
	// renderer
	renderer = new THREE.WebGLRenderer({ 
		antialias: true, 
		// alpha: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor( 0x000000 );
	renderer.domElement.id = "canvas_3d"; // agrego un id al canvas que renderiza el diente
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	container.appendChild(renderer.domElement);
	
	var grid = new THREE.GridHelper(50,5);
	var color = new THREE.Color("rgb(255,255,255");
	grid.setColors(color, 0xffffff);
	
	scene.add(grid);
	
	var map = THREE.ImageUtils.loadTexture( 'textures/test.jpg' );
	map.wrapS = map.wrapT = THREE.RepeatWrapping;
	map.anisotropy = 16;

	var material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide } );
	
	object = new THREE.Mesh( new THREE.SphereGeometry( 75, 20, 10 ), material );
	object.position.set( -100, 0, 200 );
	// scene.add( object );
	
	object = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100, 4, 4, 4 ), material );
	object.position.set( -200, 0, 0 );
	// scene.add( object );
	
	// plane for the ground
	var planeGeometry = new THREE.PlaneBufferGeometry(30, 30, 30);
	var planeMaterial = new THREE.MeshLambertMaterial( { color: 0xdddddd } );
	var plane = new THREE.Mesh( planeGeometry, planeMaterial );
	plane.rotation.x = -.5 * Math.PI;
	plane.receiveShadow = true;
// 	scene.add( plane );
	
	var axis = new THREE.AxisHelper(30);
  	scene.add(axis);

	
	scene.add( new THREE.AmbientLight( 0x443333 ) );
	
	var light = new THREE.DirectionalLight( 0xffddcc, 1 );
	light.position.set( 1, 0.75, 0.5 );
	scene.add( light );

	var light = new THREE.DirectionalLight( 0xccccff, 1 );
	light.position.set( -1, 0.75, -0.5 );
	scene.add( light );

	
// 	var light = new THREE.DirectionalLight( 0xffddcc, 1 );
// 	light.position.set( 1, 0.75, 0.5 );
// 	// scene.add( light );

// 	var light = new THREE.DirectionalLight( 0xccccff, 1 );
// 	light.position.set( -1, 0.75, -0.5 );
// 	// scene.add( light );

	var geometry = new THREE.Geometry();
	geometry.vertices.push( new THREE.Vector3(), new THREE.Vector3() );

	line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { linewidth: 4 } ) );
	scene.add( line );

	raycaster = new THREE.Raycaster();

	var mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
	mouseHelper.visible = false;
	scene.add( mouseHelper );
	
	var geometry = new THREE.BoxGeometry( 5, 5, 5 );
	var material = new THREE.MeshLambertMaterial( { color: 0xff3300 } );
	cube = new THREE.Mesh( geometry, material );
	cube.position.set(2.5, 2.5, 2.5);
	cube.castShadow = true;
	scene.add( cube );
	
	// Ambient light 
	ambient = new THREE.AmbientLight( 0xffffff );
	// scene.add(ambient);
	
	// Other light
	spotlLight = new THREE.SpotLight( 0xffffff );
	spotlLight.position.set(15, 30, 50);
	spotlLight.castShadow = true;
	spotlLight.shadowMapWidth = 1024;
	spotlLight.shadowMapHeight = 1024;
	spotlLight.shadowCameraNear = 500;
	spotlLight.shadowCameraFar = 4000;
	spotlLight.shadowCameraFov = 30;
	// scene.add(spotlLight);
	
	// Load object
	var loader = new THREE.JSONLoader();
	loader.load('tooth_molar.js',createScene);
	
	// var binLoader = new THREE.BinaryLoader();
//     		binLoader.load( "Model_bin.js", createScene );
	
	function createScene(object){
		
		var material = new THREE.MeshPhongMaterial( {
			specular: 0x111111,
			map: THREE.ImageUtils.loadTexture( 'textures/Map-COL.jpg' ),
			specularMap: THREE.ImageUtils.loadTexture( 'textures/Map-SPEC.jpg' ),
			normalMap: THREE.ImageUtils.loadTexture( 'textures/Infinite-Level_02_Tangent_SmoothUV.jpg' ),
			normalScale: new THREE.Vector2( 0.75, 0.75 ),
			shininess: 25
		} );
		
		mesh = new THREE.Mesh( object, material );
		scene.add( mesh );
		mesh.scale.set( 3, 3, 3 );
		
		tooth = mesh;
		// object.scale.set(3, 3, 3);
		// object.rotation.x = 0;
		// object.rotation.y = 0;
		mesh.translateY(10);
		mesh.receiveShadow = true;	
		// scene.add(object);
	}
	
	/* datGui controls object */
	guiControls = new function(){
		// gui position
		this.rotationX = 0.00;
		this.rotationY = 0.00;
		this.rotationZ = 0.01;
		
		// material
		this.color = 0x000000;
		this.form = 0;
		this.wireframe = true;
		// Mesh or line
		this.lineshape = true;
	}
	
	
	
	// dai gui settings
	datGUI = new dat.GUI();
	var rotFolder = datGUI.addFolder('Rotation Options');
	var shapeFolder = datGUI.addFolder('Form Options');
	var materialFolder = datGUI.addFolder('Material Options');
	
	materialFolder.open();
	
	rotFolder.add(guiControls, 'rotationX', 0.1);
	rotFolder.add(guiControls, 'rotationY', 0.1);
	rotFolder.add(guiControls, 'rotationZ', 0.1);
	
	materialFolder.addColor(guiControls, 'color').onChange(function(value){
		console.log(value);
		cube.material.color.setHex(value);
		cube.material.color.setHex(value);
	});
	
	materialFolder.add(guiControls, 'wireframe').name('Wireframe').onChange(function(value){
		if(value)
			cube.material.wireframe = true;
		else
			cube.material.wireframe = false;
	});
	
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.minDistance = 15;
	controls.maxDistance = 1000;
	controls.addEventListener('change', render);
	
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
	
	// Camera look at
	camera.lookAt( scene.position );
}

function animate(){
	requestAnimationFrame( animate );

	render();
	stats.update();
}

// funtion to render object
function render(){
				
				controls.update();
				
				object.rotation.x += 0.1;
				object.rotation.y += 0.1;
				
				// tooth.rotation.x += 0.1;
				// tooth.rotation.y += 0.1;
				
				renderer.render(scene, camera);
				
				
			}