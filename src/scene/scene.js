import { createArena } from "./arena.js";
import { createCreature } from "./creature.js";
import { playAttackVFX, updateParticles } from "./effects.js";
import { createSky, updateSky } from "./sky.js";

let scene, camera, renderer, clock;
let playerModel, enemyModel, sky;

// ===== CAMERA STATE =====
let mouseX = 0, mouseY = 0;
let zoom = 0;
let shake = 0;
let attackBias = 0;

const BASE_CAM = new THREE.Vector3(0, 3.5, 8);

export function initScene(canvas) {
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  // 🌌 BACKGROUND + FOG (DEPTH)
  scene.background = new THREE.Color(0x04060f);
  scene.fog = new THREE.Fog(0x04060f, 6, 18);

  // 🎥 CAMERA
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.copy(BASE_CAM);

  // 🖥️ RENDERER
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // 💡 CINEMATIC LIGHTING
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
  keyLight.position.set(6, 10, 6);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x66ccff, 0.9);
  rimLight.position.set(-6, 6, -6);
  scene.add(rimLight);

  const magicLight = new THREE.PointLight(0x44aaff, 1.5, 14);
  magicLight.position.set(0, 3, 0);
  scene.add(magicLight);

  // 🌌 SKY (MOVING BACKGROUND)
  sky = createSky();
  scene.add(sky);

  // 🏟️ ARENA
  scene.add(createArena());

  // INPUT
  window.addEventListener("mousemove", onMouse);
  window.addEventListener("touchmove", onTouch, { passive: true });
  window.addEventListener("resize", onResize);

  animate();
  return { spawnPlayers, playAttackAnimation };
}

// ================= PLAYERS =================

export function spawnPlayers() {
  playerModel = createCreature(true);
  enemyModel = createCreature(false);

  playerModel.position.set(-2, 0, 0);
  enemyModel.position.set(2, 0, 0);
  enemyModel.rotation.y = Math.PI;

  scene.add(playerModel, enemyModel);
}

// ================= ATTACK CAMERA LOGIC =================

export function playAttackAnimation(type = "tackle") {
  if (type === "flame") {
    zoom = -1.2;
    shake = 0.25;
    attackBias = 0.4;
  } else if (type === "heal") {
    zoom = 0.6;
    shake = 0.05;
    attackBias = -0.2;
  } else {
    zoom = -0.7;
    shake = 0.15;
    attackBias = 0.25;
  }

  playAttackVFX(scene, playerModel, enemyModel, camera, type);
}

// ================= MAIN LOOP =================

function animate() {
  const delta = clock.getDelta();
  const t = clock.elapsedTime;

  // 🧬 CREATURE LIFE
  if (playerModel) {
    playerModel.position.y = Math.sin(t * 2) * 0.25;
    playerModel.rotation.y += 0.004;
  }
  if (enemyModel) {
    enemyModel.position.y = Math.sin(t * 2 + 1) * 0.25;
    enemyModel.rotation.y -= 0.004;
  }

  // 🌌 SKY MOTION (DEPTH PARALLAX)
  updateSky(sky, delta, mouseX);

  // 🎥 TRUE SCREEN-SPACE 3D CAMERA
  const parallaxX = mouseX * 2.2;
  const parallaxY = mouseY * 1.4;

  camera.position.x += (parallaxX + attackBias - camera.position.x) * 0.06;
  camera.position.y +=
    (BASE_CAM.y + parallaxY - camera.position.y) * 0.06;

  zoom *= 0.85;
  attackBias *= 0.85;
  camera.position.z +=
    ((BASE_CAM.z + zoom) - camera.position.z) * 0.08;

  // 💥 SHAKE
  if (shake > 0.001) {
    camera.position.x += (Math.random() - 0.5) * shake;
    camera.position.y += (Math.random() - 0.5) * shake;
    shake *= 0.82;
  }

  camera.lookAt(0, 0.8, 0);

  updateParticles();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// ================= INPUT =================

function onMouse(e) {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * -2;
}

function onTouch(e) {
  if (!e.touches[0]) return;
  mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * -2;
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
