export function createArena() {
  const group = new THREE.Group();

  const geo = new THREE.CircleGeometry(4,64);
  const mat = new THREE.MeshStandardMaterial({color:0x111111, roughness:0.7});
  const floor = new THREE.Mesh(geo, mat);
  floor.rotation.x=-Math.PI/2; floor.position.y=-1;
  group.add(floor);

  // Magical glowing ring
  const ringGeo = new THREE.TorusGeometry(4,0.07,16,100);
  const ringMat = new THREE.MeshStandardMaterial({color:0x00ffff, emissive:0x00ffff, emissiveIntensity:0.5});
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x=-Math.PI/2; ring.position.y=-0.98;
  group.add(ring);

  return group;
}
