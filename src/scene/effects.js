let projectiles = [];

export function playAttackVFX(scene, attacker, target, camera, type) {
  const mouth = attacker.userData.mouth;

  const color =
    type === "lightning" ? 0x33ccff :
    type === "fire" ? 0xff5522 :
    0xffff88;

  const emissive =
    type === "lightning" ? 0x99ffff :
    0xffaa55;

  const bolt = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 20, 20),
    new THREE.MeshStandardMaterial({
      color,
      emissive,
      emissiveIntensity: 1,
      roughness: 0.2
    })
  );

  bolt.position.setFromMatrixPosition(mouth.matrixWorld);

  const targetPos = target.position.clone();
  targetPos.y += 1;

  const dir = targetPos.clone().sub(bolt.position).normalize();

  bolt.userData = {
    dir,
    speed: 0.25,
    life: 0,
    target
  };

  scene.add(bolt);
  projectiles.push(bolt);
}

export function updateParticles() {
  projectiles.forEach((p, i) => {
    p.position.addScaledVector(p.userData.dir, p.userData.speed);
    p.scale.multiplyScalar(0.98);
    p.rotation.x += 0.2;
    p.rotation.y += 0.3;

    p.userData.life++;

    if (p.userData.life > 40) {
      impact(p.parent, p.position, p.userData.target);
      p.parent.remove(p);
      projectiles.splice(i, 1);
    }
  });
}

function impact(scene, pos, target) {
  if (target) target.position.y += 0.3;

  for (let i = 0; i < 18; i++) {
    const spark = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x99ddff })
    );
    spark.position.copy(pos);
    spark.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.5,
      Math.random() * 0.4,
      (Math.random() - 0.5) * 0.5
    );
    spark.life = 20;
    scene.add(spark);

    sparks.push(spark);
  }
}

let sparks = [];
(function loop() {
  sparks.forEach((s, i) => {
    s.position.add(s.velocity);
    s.life--;
    if (s.life <= 0) {
      s.parent.remove(s);
      sparks.splice(i, 1);
    }
  });
  requestAnimationFrame(loop);
})();

