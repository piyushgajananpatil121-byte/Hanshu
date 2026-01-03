// client/src/scene/creature.js
export function createCreature({ isPlayer }) {
  const group = new THREE.Group();

  // Placeholder model — replace with GLTF for real creatures
  const geometry = new THREE.SphereGeometry(0.8, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: isPlayer ? 0xff4444 : 0x44aaff,
    roughness: 0.4,
    metalness: 0.2
  });
  const mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);

  // Optional glow outline
  const outlineMaterial = new THREE.MeshBasicMaterial({
    color: isPlayer ? 0xff8888 : 0x88ccff,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  });
  const outline = new THREE.Mesh(geometry.clone(), outlineMaterial);
  outline.scale.multiplyScalar(1.1);
  group.add(outline);

  // Initial idle rotation
  group.rotation.y = isPlayer ? 0 : Math.PI;

  return group;
}
