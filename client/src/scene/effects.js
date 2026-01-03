// client/src/scene/effects.js

// Particle storage
let particles = [];

/**
 * Creates a simple attack effect between two creatures
 * @param {THREE.Scene} scene 
 * @param {THREE.Group} attacker 
 * @param {THREE.Group} target 
 * @param {THREE.Camera} camera 
 */
export function playAttackVFX(scene, attacker, target, camera) {
  if (!attacker || !target) return;

  // Spawn particles at attacker
  for (let i = 0; i < 20; i++) {
    const pGeom = new THREE.SphereGeometry(0.05);
    const pMat = new THREE.MeshBasicMaterial({ color: 0xffff44 });
    const p = new THREE.Mesh(pGeom, pMat);
    
    p.position.copy(attacker.position);
    p.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.2,
      Math.random() * 0.2,
      (Math.random() - 0.5) * 0.2
    );

    scene.add(p);
    particles.push(p);
  }

  // Optional: camera shake effect
  if (camera) {
    const originalPos = camera.position.clone();
    let duration = 15;
    function shake() {
      if (duration <= 0) {
        camera.position.copy(originalPos);
        return;
      }
      camera.position.x += (Math.random() - 0.5) * 0.1;
      camera.position.y += (Math.random() - 0.5) * 0.1;
      duration--;
      requestAnimationFrame(shake);
    }
    shake();
  }
}

/**
 * Updates particles each frame
 */
export function updateParticles() {
  particles.forEach((p, i) => {
    p.position.add(p.velocity);
    p.material.opacity -= 0.02;
    if (p.material.opacity <= 0) {
      if (p.parent) p.parent.remove(p);
      particles.splice(i, 1);
    }
  });
}
