(function () {
  // Set our main variables
  let scene,
    renderer,
    camera,
    model, // Our character
    KingAladin,
    Finoglio,
    Clorinda,
    Sofronia,
    Olindo,
    Soldier,
    Pawn,
    possibleAnims, // Animations found in our file
    mixer, // THREE.js animations mixer
    idle, // Idle, the default state our character returns to
    clock = new THREE.Clock(), // Used for anims, which run to a clock instead of frame rate 
    currentlyAnimating = false, // Used to check whether characters neck is being used in another anim
    raycaster = new THREE.Raycaster(), // Used to detect the click on our character
    loaderAnim = document.getElementById('js-loader');

  init();

  function init() {

    const MODEL_PATH = './assets/PyramidSetup.glb';
    const canvas = document.querySelector('#c');
    const backgroundColor = 0x000000;


    // Init the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    scene.fog = new THREE.Fog(backgroundColor, 500, 2000);

    // Init the renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Add a camera
    camera = new THREE.PerspectiveCamera(20,window.innerWidth / window.innerHeight, 1, 1000);

    const controls = new THREE.OrbitControls( camera, renderer.domElement );

    camera.position.z = 20;
    camera.position.x = 20;
    camera.position.y = 0;
    
/*     let IADtexture = new THREE.TextureLoader().load('./assets/texture/Caravaggio.jpg');
    IADtexture.flipY = false;

    const IADmtl = new THREE.MeshPhongMaterial({
      map: IADtexture,
      color: 0xffffff,
      skinning: true
    }); */

    controls.enablePan = false;
    controls.minDistance = 10;
    controls.maxDistance = 30;
    controls.minPolarAngle = .5;
    controls.maxPolarAngle = 1.5;
    controls.minAzimuthAngle = -1;
    controls.maxAzimuthAngle = 1;
    controls.update();

    var loader = new THREE.GLTFLoader();

    loader.load(
      MODEL_PATH,
      function (gltf) {
        model = gltf.scene;

        model.traverse(o => {

          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
/*             o.material = IADmtl; */
          }

          if (o.isMesh && o.name === 'Sofronia') {
            Sofronia = o;
          }
          if (o.isMesh && o.name === 'Olindo') {
            Olindo = o;
          }

        });

        model.scale.set(2, 2, 2);
        model.position.set(0, 0, -2.5);

        scene.add(model);

        loaderAnim.remove();
      },
      undefined, // We don't need this function
      function (error) {
        console.error(error);
      });


    // Add Ground
/*     const PlaneGeo = new THREE.PlaneGeometry( 20, 20, 8 );
    const Planematerial = new THREE.MeshBasicMaterial( {color: 0x0e0e0e, side: THREE.DoubleSide} );

    const plane = new THREE.Mesh( PlaneGeo, Planematerial );
    plane.rotation.x = 3.14/2; 
    scene.add( plane );  */

    // Add lights

     // Add hemisphere light to scene
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    hemiLight.position.set(0, 0, 0);
    scene.add( hemiLight );

    //Create a PointLight and turn on shadows for the light
    const pointlight = new THREE.PointLight( 0xffffff, 1, 100 );
    pointlight.position.set( 0, 2, 0 );
    pointlight.castShadow = true; // default false
    scene.add( pointlight );
    
    //Set up shadow properties for the light
    pointlight.shadow.mapSize.width = 512; // default
    pointlight.shadow.mapSize.height = 512; // default
    pointlight.shadow.camera.near = 0.5; // default
    pointlight.shadow.camera.far = 1500; // default
    
    //Add pointLightHelper
    /* const sphereSize = .1;
    const pointLightHelper = new THREE.PointLightHelper( pointlight, sphereSize );
    scene.add( pointLightHelper ); */

  }


  function update() {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    requestAnimationFrame(update);
    
    renderer.render(scene, camera);
  }

  update();

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvasPixelWidth = canvas.width / window.devicePixelRatio;
    let canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize =
      canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  window.addEventListener('click', e => raycast(e));
  window.addEventListener('touchend', e => raycast(e, true));

  function raycast(e, touch = false) {
    var mouse = {};
    if (touch) {
      mouse.x = 2 * (e.changedTouches[0].clientX / window.innerWidth) - 1;
      mouse.y = 1 - 2 * (e.changedTouches[0].clientY / window.innerHeight);
    } else {
      mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
      mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
    }
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects[0]) {
      var object = intersects[0].object;

      if (object.name) {

        console.log(object.name);

        if (true) {
          currentlyAnimating = true;
          console.log(object.name);
          //playOnClick();
        }
      }
    }
  }

  document.addEventListener('mousemove', function (e) {
    var mousecoords = getMousePos(e);
    if (true) {
      // TODO Move Light with mouse

    }
  });

  function getMousePos(e) {
    return { x: e.clientX, y: e.clientY };
  }

})();