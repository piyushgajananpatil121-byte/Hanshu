export function createSky() {
  const skyGroup = new THREE.Group();

  // Big sphere around scene
  const geo = new THREE.SphereGeometry(40, 64, 64);
  const mat = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.9
  });

  const sky = new THREE.Mesh(geo, mat);
  skyGroup.add(sky);

  // Gradient color animation state
  sky.material.color = new THREE.Color(0x05070f);
  skyGroup.userData.time = 0;

  return skyGroup;
}

export function updateSky(sky, delta, cameraParallax = 0) {
  if (!sky) return;

  sky.userData.time += delta * 0.02;

  // Subtle color drift (cloud illusion)
  const t = sky.userData.time;
  const r = 0.02 + Math.sin(t) * 0.01;
  const g = 0.04 + Math.sin(t + 2) * 0.01;
  const b = 0.08 + Math.sin(t + 4) * 0.02;

  sky.children[0].material.color.setRGB(r, g, b);

  // Move sky slightly opposite camera (parallax depth)
  sky.rotation.y += delta * 0.002;
  sky.rotation.x = cameraParallax * 0.02;
}
