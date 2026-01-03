// client/src/scene/scene.js
import { createArena } from "./arena.js";
import { createCreature } from "./creature.js";
import { playAttackVFX } from "./effects.js";

let scene, camera, renderer, clock;
let playerModel, enemyModel;

export function initScene(canvas) {
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  // Camera
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 2, 6);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const sun = new THREE.DirectionalLight(0xffffff, 1);
  sun.position.set(5, 10, 5);
  scene.add(sun);

  // Arena
  scene.add(createArena());

  window.addEventListener("resize", onResize);

  return {
    spawnPlayers,
    update,
    playAttackAnimation
  };
}

function spawnPlayers() {
  playerModel = createCreature({ isPlayer: true });
  enemyModel = createCreature({ isPlayer: false });

  playerModel.position.x = -1.8;
  enemyModel.position.x = 1.8;
  enemyModel.rotation.y = Math.PI;

  scene.add(playerModel);
  scene.add(enemyModel);
}

function update() {
  const t = clock.getElapsedTime();

  if (playerModel) {
    playerModel.position.y = Math.sin(t * 2) * 0.15;
    playerModel.rotation.y += 0.005;
  }

  if (enemyModel) {
    enemyModel.position.y = Math.sin(t * 2 + 1) * 0.15;
    enemyModel.rotation.y -= 0.005;
  }

  renderer.render(scene, camera);
}

function playAttackAnimation() {
  if (!playerModel || !enemyModel) return;
  playAttackVFX(scene, playerModel, enemyModel, camera);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

export function updateScene(serverState) {
  // Future: sync animations / fainting / status effects
}
