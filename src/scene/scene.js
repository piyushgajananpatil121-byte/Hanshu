import { createArena } from "./arena.js";
import { createCreature } from "./creature.js";
import { playAttackVFX, updateParticles } from "./effects.js";

let scene, camera, renderer, clock;
let playerModel, enemyModel;

// ---- CAMERA STATE ----
let mouseX = 0, mouseY = 0;
let zoomOffset = 0;
let shakeStrength = 0;

const BASE_CAM = new THREE.Vector3(0, 3.2, 7);

export function initScene(canvas) {
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  // 🌌 Atmospheric background
  scene.background = new THREE.Color(0x05070f);
  scene.fog = new THREE.Fog(0x05070f, 6, 14);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.copy(BASE_CAM);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // 🌟 CINEMATIC LIGHTING
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
  keyLight.position.set(6, 10, 6);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x66ccff, 0.8);
  rimLight.position.set(-6, 5, -6);
  scene.add(rimLight);

  const magicLight = new THREE.PointLight(0x44aaff, 1.2, 12);
  magicLight.position.set(0, 3, 0);
  scene.add(magicLight);

  // Arena
  scene.add(createArena());

  // INPUT
  window.addEventListener("mousemove", onMouse);
  window.addEventListener("touchmove", onTouch, { passive: true });
  window.addEventListener("keydown", onKey);
  window.addEventListener("resize", onResize);

  animate();

  return { spawnPlayers, playAttackAnimation };
}

export function spawnPlayers() {
  playerModel = createCreature(true);
  enemyModel = createCreature(false);

  playerModel.position.set(-2, 0, 0);
  enemyModel.position.set(2, 0, 0);
  enemyModel.rotation.y = Math.PI;

  scene.add(playerModel, enemyModel);
}

export function playAttackAnimation(type = "tackle") {
  // Camera zoom punch
  zoomOffset = -0.8;
  shakeStrength = type === "flame" ? 0.18 : 0.1;

  playAttackVFX(scene, playerModel, enemyModel, camera, type);
}

function animate() {
  const t = clock.getElapsedTime();

  // 🧬 Creature idle animation
  if (playerModel) {
    playerModel.position.y = Math.sin(t * 2) * 0.2;
    playerModel.rotation.y += 0.004;
  }
  if (enemyModel) {
    enemyModel.position.y = Math.sin(t * 2 + 1) * 0.2;
    enemyModel.rotation.y -= 0.004;
  }

  // 🎥 CAMERA MOTION (cinematic)
  const targetX = mouseX * 1.6;
  const targetY = mouseY * 1.0;

  camera.position.x += (targetX - camera.position.x) * 0.06;
  camera.position.y += (BASE_CAM.y + targetY - camera.position.y) * 0.06;

  // Zoom damping
  zoomOffset *= 0.85;
  camera.position.z += ((BASE_CAM.z + zoomOffset) - camera.position.z) * 0.08;

  // Shake
  if (shakeStrength > 0.001) {
    camera.position.x += (Math.random() - 0.5) * shakeStrength;
    camera.position.y += (Math.random() - 0.5) * shakeStrength;
    shakeStrength *= 0.85;
  }

  camera.lookAt(0, 0.6, 0);

  updateParticles();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// ---------------- INPUT ----------------

function onMouse(e) {
  mouseX = (e.clientX / innerWidth - 0.5) * 2;
  mouseY = (e.clientY / innerHeight - 0.5) * -2;
}

function onTouch(e) {
  if (!e.touches[0]) return;
  mouseX = (e.touches[0].clientX / innerWidth
