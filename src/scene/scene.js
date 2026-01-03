import { createArena } from "./arena.js";
import { createCreature } from "./creature.js";
import { playAttackVFX, updateParticles } from "./effects.js";

let scene, camera, renderer, clock;
let playerModel, enemyModel;
let ambientLight, dirLight;

export function initScene(canvas) {
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0,3,6);
  camera.lookAt(0,0,0);

  renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));

  // Lighting
  ambientLight = new THREE.AmbientLight(0xffffff,0.6);
  dirLight = new THREE.DirectionalLight(0xffffff,1.0);
  dirLight.position.set(5,10,5);
  scene.add(ambientLight, dirLight);

  scene.add(createArena());

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
  return { spawnPlayers, update: updateScene, playAttackAnimation };
}

export function spawnPlayers() {
  playerModel = createCreature(true);
  enemyModel = createCreature(false);

  playerModel.position.x = -1.8; enemyModel.position.x = 1.8;
  enemyModel.rotation.y = Math.PI;

  scene.add(playerModel, enemyModel);
}

export function playAttackAnimation(type="tackle") {
  playAttackVFX(scene, playerModel, enemyModel, camera, type);
}

function updateScene() {
  const t = clock.getElapsedTime();
  if(playerModel) playerModel.position.y = Math.sin(t*2)*0.18;
  if(enemyModel) enemyModel.position.y = Math.sin(t*2+1)*0.18;
  updateParticles();
  renderer.render(scene,camera);
}

function animate(){ updateScene(); requestAnimationFrame(animate);}
