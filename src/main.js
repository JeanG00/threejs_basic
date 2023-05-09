import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import "./main.less";

var scene, camera, renderer, mesh;
var meshFloor;

var keyboard = {};
var player = {
  height: 1.0,
  speed: 0.2,
  turnSpeed: Math.PI * 0.01
};

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
  mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff9999, wireframe: true })
  );
  mesh.position.y += 1;
  scene.add(mesh);
  meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
  );
  meshFloor.rotation.x -= Math.PI / 2;
  scene.add(meshFloor);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
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
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  if (mesh) {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    if (keyboard[87]) {
      // w
      camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
      camera.position.z -= Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[83]) {
      // s
      camera.position.x += Math.sin(camera.rotation.y) * player.speed;
      camera.position.z += Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[65]) {
      //  a
      camera.position.x +=
        Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
      camera.position.z +=
        Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
    }
    if (keyboard[68]) {
      //  d
      camera.position.x +=
        Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
      camera.position.z +=
        Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
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
