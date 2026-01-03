import { createArena } from "./arena.js";
import { createCreature } from "./creature.js";
import { playAttackVFX, updateParticles } from "./effects.js";

let scene, camera, renderer, clock;
let playerModel, enemyModel;

// Camera motion state
let mouseX = 0;
let mouseY = 0;
let targetCamX = 0;
let targetCamY = 0;

const BASE_CAM_POS = new THREE.Vector3(0, 3, 6);

export function initScene(canvas) {
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.copy(BASE_CAM_POS);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  // Lighting (cinematic)
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(5, 10, 5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x88ccff, 0.6);
  rimLight.position.set(-5, 6, -5);
  scene.add(rimLight);

  // Arena
  scene.add(createArena());

  // Input listeners
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("resize", onResize);

  animate();

  return {
    spawnPlayers,
    playAttackAnimation
  };
}

export function spawnPlayers() {
  playerModel = createCreature(true);
  enemyModel = createCreature(false);

  playerModel.position.set(-1.8, 0, 0);
  enemyModel.position.set(1.8, 0, 0);
  enemyModel.rotation.y = Math.PI;

  scene.add(playerModel, enemyModel);
}

export function playAttackAnimation(type = "tackle") {
  playAttackVFX(scene, playerModel, enemyModel, camera, type);
}

function animate() {
  const t = clock.getElapsedTime();

  // Idle creature motion
  if (playerModel) {
    playerModel.position.y = Math.sin(t * 2) * 0.18;
    playerModel.rotation.y += 0.003;
  }

  if (enemyModel) {
    enemyModel.position.y = Math.sin(t * 2 + 1) * 0.18;
    enemyModel.rotation.y -= 0.003;
  }

  // 🎥 CAMERA PARALLAX / ORBIT
  targetCamX = mouseX * 1.2;
  targetCamY = mouseY * 0.8;

  camera.position.x += (targetCamX - camera.position.x) * 0.05;
  camera.position.y += (BASE_CAM_POS.y + targetCamY - camera.position.y) * 0.05;
  camera.position.z += (BASE_CAM_POS.z - camera.position.z) * 0.05;

  camera.lookAt(0, 0.5, 0);

  updateParticles();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// ---------------- INPUT ----------------

function onMouseMove(e) {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * -2;
}

function onTouchMove(e) {
  if (!e.touches[0]) return;
  mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * -2;
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
