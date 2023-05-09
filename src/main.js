import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import "./main.less";

var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light;
var crate, crateTexture, crateNormalMap, crateBumpMap;

var keyboard = {};
var player = {
  height: 1.0,
  speed: 0.2,
  turnSpeed: Math.PI * 0.02,
};
var useWireFrame = false;

var loadingScreen = {
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  ),
  box: new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshBasicMaterial({ color: 0x4444ff })
  ),
};
var loadingManager = null;
var RESOURCES_LOADED = false;

function init() {
  scene = new THREE.Scene();
  //  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, player.height, -5);
  camera.lookAt(0, player.height, 0);

  loadingScreen.box.position.set(0, 0, 5);
  loadingScreen.camera.lookAt(loadingScreen.box.position);
  loadingScreen.scene.add(loadingScreen.box);

  // Create a loading manager to set RESOURCES_LOADED when appropriate.
  // Pass loadingManager to all resource loaders.
  loadingManager = new THREE.LoadingManager();

  loadingManager.onProgress = function (item, loaded, total) {
    console.log(item, loaded, total);
  };

  loadingManager.onLoad = function () {
    console.log("loaded all resources");
    RESOURCES_LOADED = true;
  };

  mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshPhongMaterial({ color: 0xff4444, wireframe: useWireFrame })
  );
  mesh.position.y += 1;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  scene.add(mesh);

  meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 10, 10),
    new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: useWireFrame })
  );
  meshFloor.rotation.x -= Math.PI / 2;
  meshFloor.receiveShadow = true;
  scene.add(meshFloor);

  ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  light = new THREE.PointLight(0xffffff, 0.8, 18);
  light.position.set(-3, 6, -3);
  light.castShadow = true;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 25;
  scene.add(light);

  const textureLoader = new THREE.TextureLoader(loadingManager);
  crateTexture = textureLoader.load("/3crates/crate0/crate0_diffuse.png");
  crateBumpMap = textureLoader.load("/3crates/crate0/crate0_bump.png");
  crateNormalMap = textureLoader.load("/3crates/crate0/crate0_normal.png");

  crate = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshPhongMaterial({
      color: 0xffffff,
      map: crateTexture,
      bumpMap: crateBumpMap,
      normalMap: crateNormalMap,
    })
  );
  crate.position.set(2.5, 3 / 2, 2.5);
  crate.receiveShadow = true;
  crate.castShadow = true;
  scene.add(crate);

  const mtlLoader = new MTLLoader(loadingManager);
  mtlLoader.load("/models/Tent_Poles_01.mtl", function (materials) {
    materials.preload();
    const objLoader = new OBJLoader(loadingManager);
    objLoader.setMaterials(materials);
    objLoader.load("/models/Tent_Poles_01.obj", function (mesh) {
      mesh.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      mesh.position.set(-5, 0, 4);
      mesh.rotation.y = -Math.PI / 4;
      scene.add(mesh);
    });
  });

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  // renderer.setSize(window.innerWidth/2, window.innerHeight/2, false)
  // will render your app at half resolution
  document.body.appendChild(renderer.domElement);

  // const geometry = new THREE.BoxGeometry(1, 1, 1);
  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  // const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  // const points = [];
  // points.push(new THREE.Vector3(-10, 0, 0));
  // points.push(new THREE.Vector3(0, 20, 0));
  // points.push(new THREE.Vector3(10, 0, 0));

  // const geometry = new THREE.BufferGeometry().setFromPoints(points);
  // const cube = new THREE.Mesh(geometry, material);
  // const line = new THREE.Line(geometry, material);

  // scene.add(line);
  // scene.add(cube);

  // camera.position.z = 5;
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if (!RESOURCES_LOADED) {
    loadingScreen.box.position.x -= 0.05;
    if (loadingScreen.box.position.x < -10) loadingScreen.box.position.x = 10;
    loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);
    if (renderer) renderer.render(loadingScreen.scene, loadingScreen.camera);
    return;
  }
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  if (mesh) {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    if (keyboard[87]) {
      // w
      camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
      camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[83]) {
      // s
      camera.position.x += Math.sin(camera.rotation.y) * player.speed;
      camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[65]) {
      //  a
      camera.position.x +=
        Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
      camera.position.z +=
        -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
    }
    if (keyboard[68]) {
      //  d
      camera.position.x +=
        Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
      camera.position.z +=
        -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
    }
    if (keyboard[37]) {
      // left arrow
      camera.rotation.y -= player.turnSpeed;
    }
    if (keyboard[39]) {
      // right arrow
      camera.rotation.y += player.turnSpeed;
    }
  }
  if (crate) crate.rotation.y += 0.01;
  if (renderer) renderer.render(scene, camera);
}

function keyDown(event) {
  // Should do nothing if the default action has been cancelled
  if (event.defaultPrevented) return;
  console.table({
    "KeyboardEvent.key": event.key,
    "event.keyCode": event.keyCode,
  });
  keyboard[event.keyCode] = true;
}

function keyUp(event) {
  // Should do nothing if the default action has been cancelled
  if (event.defaultPrevented) return;
  keyboard[event.keyCode] = false;
}

if (WebGL.isWebGLAvailable()) {
  // Initiate function or other initializations here
  animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("container").appendChild(warning);
}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);
window.onload = init;
// window.onresize = init;
