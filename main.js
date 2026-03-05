const hud = document.getElementById("hud");

function setHud(html) {
  hud.innerHTML = html;
}

setHud("Status: <b>JS loaded</b>. Loading Three.js…");

try {
  // Try CDN A first (jsDelivr tends to be reliable)
  const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");

  setHud("Status: <b>Three.js loaded</b>. Creating renderer…");

  // WebGL quick check
  const testCanvas = document.createElement("canvas");
  const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
  if (!gl) {
    setHud(`Status: <span class="err"><b>WebGL is disabled</b></span><br>
      Fix: Chrome Settings → System → Use hardware acceleration (ON), then relaunch Chrome.<br>
      Also check any corporate browser policy / extensions blocking WebGL.`);
    throw new Error("WebGL disabled");
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050816);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.5, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1.1);
  light.position.set(3, 6, 4);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  // Big obvious cube (if you see this, Three.js + WebGL are working)
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x112233 })
  );
  scene.add(cube);

  setHud("Status: <b>Rendering OK</b> ✅<br>If you see a spinning cube, your setup is correct. Next we add the full life-journey scene.");

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.012;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

} catch (e) {
  console.error(e);

  // Try CDN B fallback (unpkg)
  try {
    setHud("CDN A failed. Trying fallback CDN…");
    const THREE = await import("https://unpkg.com/three@0.160.0/build/three.module.js");
    setHud("Three.js loaded from fallback CDN ✅ Reload the page once.");
  } catch (e2) {
    console.error(e2);
    setHud(`Status: <span class="err"><b>Three.js failed to load</b></span><br>
      This is almost always a network/CDN block.<br>
      Check DevTools → Network tab and look for blocked requests to jsdelivr/unpkg.`);
  }
}
