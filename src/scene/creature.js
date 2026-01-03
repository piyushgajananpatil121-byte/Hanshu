export function createCreature(isPlayer) {
  const group = new THREE.Group();

  // Sphere base
  const geo = new THREE.SphereGeometry(0.85, 48, 48);
  const mat = new THREE.MeshStandardMaterial({
    color: isPlayer?0xff4444:0x44aaff,
    roughness:0.4, metalness:0.3, flatShading:false
  });
  const mesh = new THREE.Mesh(geo, mat);
  group.add(mesh);

  // Magical aura
  const outline = new THREE.Mesh(geo.clone(),
    new THREE.MeshBasicMaterial({
      color:isPlayer?0xff88aa:0x88ccff,
      wireframe:true, transparent:true, opacity:0.25
    })
  );
  outline.scale.multiplyScalar(1.15);
  group.add(outline);

  return group;
}
