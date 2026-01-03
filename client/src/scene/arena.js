// client/src/scene/arena.js
export function createArena() {
  const arenaGroup = new THREE.Group();

  // Main circular platform
  const geometry = new THREE.CircleGeometry(4, 64);
  const material = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.8,
    metalness: 0.1
  });
  const platform = new THREE.Mesh(geometry, material);
  platform.rotation.x = -Math.PI / 2;
  platform.position.y = -1;
  arenaGroup.add(platform);

  // Optional: glowing rim
  const ringGeometry = new THREE.TorusGeometry(4, 0.05, 16, 100);
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0x44aaff,
    emissive: 0x44aaff,
    emissiveIntensity: 0.5
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -0.98;
  arenaGroup.add(ring);

  return arenaGroup;
}
