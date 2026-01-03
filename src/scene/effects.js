let particles=[];

export function playAttackVFX(scene, attacker, target, camera, type="tackle") {
  if(!attacker||!target) return;

  let color = type==="flame"?0xff4400: type==="heal"?0x44ff44:0xffff44;

  for(let i=0;i<25;i++){
    const p = new THREE.Mesh(
      new THREE.SphereGeometry(0.05,6,6),
      new THREE.MeshBasicMaterial({color})
    );
    p.position.copy(attacker.position);
    p.velocity = new THREE.Vector3((Math.random()-0.5)*0.25, Math.random()*0.25, (Math.random()-0.5)*0.25);
    scene.add(p); particles.push(p);
  }

  if(camera){
    const orig=camera.position.clone(); let duration=20;
    function shake(){ if(duration<=0){camera.position.copy(orig);return;}
      camera.position.x+= (Math.random()-0.5)*0.1;
      camera.position.y+= (Math.random()-0.5)*0.1;
      duration--; requestAnimationFrame(shake);
    } shake();
  }
}

export function updateParticles(){
  particles.forEach((p,i)=>{
    p.position.add(p.velocity);
    p.material.opacity -=0.025;
    if(p.material.opacity<=0){ if(p.parent)p.parent.remove(p); particles.splice(i,1);}
  });
}
