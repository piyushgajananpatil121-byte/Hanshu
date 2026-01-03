export function createCreature(isPlayer = true) {
  const group = new THREE.Group();

  const bodyColor = isPlayer ? 0x1a1a1a : 0x2a0000;
  const glowColor = isPlayer ? 0x33ccff : 0xff5522;

  const bodyMat = new THREE.MeshStandardMaterial({
    color: bodyColor,
    roughness: 0.4,
    metalness: 0.2,
    emissive: glowColor,
    emissiveIntensity: 0.15
  });

  // ===== BODY =====
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 32, 32),
    bodyMat
  );
  body.scale.set(1, 1.4, 1);
  group.add(body);

  // ===== HEAD =====
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 32, 32),
    bodyMat
  );
  head.position.set(0, 1.4, 0.4);
  group.add(head);

  // ===== JAW =====
  const jaw = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.2, 0.6),
    bodyMat
  );
  jaw.position.set(0, 1.2, 0.7);
  group.add(jaw);

  // ===== HORNS =====
  const hornGeo = new THREE.ConeGeometry(0.12, 0.5, 12);
  const hornMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });

  const hornL = new THREE.Mesh(hornGeo, hornMat);
  hornL.position.set(-0.35, 1.9, 0.3);
  hornL.rotation.x = -0.4;

  const hornR = hornL.clone();
  hornR.position.x = 0.35;

  group.add(hornL, hornR);

  // ===== WINGS =====
  const wingGeo = new THREE.BoxGeometry(1.6, 0.08, 1.2);
  const wingMat = new THREE.MeshStandardMaterial({
    color: bodyColor,
    emissive: glowColor,
    emissiveIntensity: 0.2
  });

  const wingL = new THREE.Mesh(wingGeo, wingMat);
  wingL.position.set(-1.2, 1.1, -0.2);
  wingL.rotation.z = 0.6;

  const wingR = wingL.clone();
  wingR.position.x = 1.2;
  wingR.rotation.z = -0.6;

  group.add(wingL, wingR);

  // ===== TAIL =====
  const tailGeo = new THREE.CylinderGeometry(0.15, 0.25, 2.4, 16);
  const tail = new THREE.Mesh(tailGeo, bodyMat);
  tail.position.set(0, 0.2, -1.6);
  tail.rotation.x = Math.PI / 2;
  group.add(tail);

  // ===== MOUTH SOCKET (IMPORTANT FOR ATTACKS) =====
  const mouth = new THREE.Object3D();
  mouth.position.set(0, 1.3, 1.1);
  group.add(mouth);

  // ===== IDLE ANIMATION =====
  group.userData.update = (t) => {
    wingL.rotation.y = Math.sin(t * 2) * 0.2;
    wingR.rotation.y = -Math.sin(t * 2) * 0.2;
    tail.rotation.z = Math.sin(t * 3) * 0.3;
    jaw.rotation.x = Math.sin(t * 2) * 0.1;
  };

  group.userData.mouth = mouth;

  return group;
}

