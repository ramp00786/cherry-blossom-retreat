/*
 * Hero scene — a Kerala backwater sunset with falling cherry-blossom petals.
 * Built with three.js. Exposes window.HeroScene so main.js can drive the
 * camera from GSAP ScrollTrigger.
 */
(function () {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas || !window.THREE) return;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const fogColor = new THREE.Color("#e9a19a");
  scene.fog = new THREE.Fog(fogColor, 30, 140);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);
  const camBase = new THREE.Vector3(0, 2.2, 10);
  camera.position.copy(camBase);
  const lookTarget = new THREE.Vector3(0, 2.4, -40);

  /* ---------------- Sky dome ---------------- */
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(200, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uTop: { value: new THREE.Color("#1d1638") },
        uMid: { value: new THREE.Color("#8e4a7a") },
        uLow: { value: new THREE.Color("#f2a38f") },
        uHorizon: { value: new THREE.Color("#ffd29a") },
        uTime: { value: 0 }
      },
      vertexShader: `
        varying vec3 vPos;
        void main() {
          vPos = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform vec3 uTop, uMid, uLow, uHorizon;
        uniform float uTime;
        varying vec3 vPos;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
        void main() {
          float h = vPos.y;
          vec3 col = mix(uHorizon, uLow, smoothstep(-0.02, 0.06, h));
          col = mix(col, uMid, smoothstep(0.06, 0.25, h));
          col = mix(col, uTop, smoothstep(0.25, 0.65, h));
          // sun glow toward -z
          float sun = max(dot(vPos, normalize(vec3(0.0, 0.03, -1.0))), 0.0);
          col += vec3(1.0, 0.75, 0.45) * pow(sun, 60.0) * 0.9;
          col += vec3(1.0, 0.55, 0.45) * pow(sun, 8.0) * 0.25;
          // faint stars high up
          vec2 st = floor(vPos.xz * 380.0);
          float star = step(0.9975, hash(st)) * smoothstep(0.3, 0.7, h);
          star *= 0.6 + 0.4 * sin(uTime * 2.0 + hash(st) * 40.0);
          col += star;
          if (h < 0.0) col = uHorizon * 0.8;
          gl_FragColor = vec4(col, 1.0);
        }`
    })
  );
  scene.add(sky);

  /* ---------------- Sun disc ---------------- */
  const sunTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, "rgba(255,246,220,1)");
    grd.addColorStop(0.22, "rgba(255,214,150,1)");
    grd.addColorStop(0.32, "rgba(255,170,120,.55)");
    grd.addColorStop(1, "rgba(255,140,120,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, fog: false, depthWrite: false, transparent: true }));
  sun.scale.set(42, 42, 1);
  sun.position.set(0, 5, -150);
  scene.add(sun);

  /* ---------------- Distant hills (layered silhouettes) ---------------- */
  function hillLayer(z, height, color, seed) {
    const shape = new THREE.Shape();
    const w = 360;
    shape.moveTo(-w / 2, -2);
    for (let i = 0; i <= 80; i++) {
      const x = -w / 2 + (i / 80) * w;
      const y = height * (0.55 + 0.45 * Math.sin(i * 0.37 + seed) * Math.sin(i * 0.11 + seed * 2.0)) + Math.sin(i * 1.7 + seed) * 0.35;
      shape.lineTo(x, Math.max(0.2, y));
    }
    shape.lineTo(w / 2, -2);
    const m = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ color, fog: true }));
    m.position.z = z;
    scene.add(m);
    return m;
  }
  hillLayer(-130, 9, "#b0607a", 1.3);
  hillLayer(-100, 6, "#7d3f62", 4.1);
  hillLayer(-75, 3.6, "#4a2a47", 7.7);

  /* ---------------- Palm trees ---------------- */
  const palmMat = new THREE.MeshBasicMaterial({ color: "#120d1c", side: THREE.DoubleSide, fog: true });
  function makeFrond(len) {
    const geo = new THREE.PlaneGeometry(len, 1, 24, 1);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) + len / 2; // 0..len
      const t = x / len;
      const width = Math.sin(Math.PI * Math.min(1, t * 1.15)) * 0.42 * (1 - t * 0.4);
      const yy = pos.getY(i) > 0 ? width : -width * 0.25;
      pos.setXYZ(i, x, yy - t * t * len * 0.55, 0);
    }
    geo.computeVertexNormals();
    return geo;
  }
  const frondGeos = [makeFrond(3.4), makeFrond(4.0), makeFrond(4.6)];
  const palms = [];
  function makePalm(x, z, h, lean, phase) {
    const group = new THREE.Group();
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      pts.push(new THREE.Vector3(Math.sin(t * 1.4) * lean, t * h, Math.sin(t * 2.0) * 0.3));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const trunk = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.13, 6, false), palmMat);
    group.add(trunk);
    const top = pts[pts.length - 1];
    const crown = new THREE.Group();
    crown.position.copy(top);
    const n = 11;
    for (let i = 0; i < n; i++) {
      const f = new THREE.Mesh(frondGeos[i % 3], palmMat);
      f.rotation.y = (i / n) * Math.PI * 2 + Math.random() * 0.3;
      f.rotation.z = 0.35 + Math.random() * 0.35;
      crown.add(f);
    }
    group.add(crown);
    group.position.set(x, 0, z);
    group.userData = { crown, phase };
    scene.add(group);
    palms.push(group);
  }
  makePalm(-9.5, -6, 9.5, 1.8, 0);
  makePalm(-12.5, -10, 11, 1.2, 1.3);
  makePalm(-6.5, -16, 8, 0.9, 2.1);
  makePalm(10.5, -8, 10, -1.9, 0.7);
  makePalm(14, -14, 12, -1.1, 2.6);
  makePalm(-22, -30, 9, 0.6, 1.9);
  makePalm(20, -28, 8.5, -0.7, 3.2);
  makePalm(-30, -45, 10, 0.4, 0.4);
  makePalm(33, -50, 9, -0.5, 1.1);

  /* ---------------- Chinese fishing net (Kollam / Kochi icon) ---------------- */
  (function fishingNet() {
    const g = new THREE.Group();
    const lineMat = new THREE.LineBasicMaterial({ color: "#120d1c", fog: true });
    const pts = [
      [0, 0, 0], [-6, 7, 0], [0, 0, 0], [6, 7, 0], [-6, 7, 0], [0, 9, 0], [6, 7, 0],
      [0, 0, 0], [0, 9, 0]
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(...p)));
    g.add(new THREE.Line(geo, lineMat));
    // hanging net
    const net = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      net.push(new THREE.Vector3(-6 + 12 * t, 7, 0), new THREE.Vector3(-3 + 6 * t, 3.5 - Math.sin(t * Math.PI) * 0.8, 0));
    }
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(net), lineMat));
    g.position.set(30, 0.3, -70);
    g.rotation.y = -0.4;
    scene.add(g);
  })();

  /* ---------------- Water ---------------- */
  const waterUniforms = {
    uTime: { value: 0 },
    uDeep: { value: new THREE.Color("#3b2340") },
    uSky: { value: new THREE.Color("#f0a08c") },
    uSun: { value: new THREE.Color("#ffe0a8") },
    fogColor: { value: fogColor },
    fogNear: { value: scene.fog.near },
    fogFar: { value: scene.fog.far }
  };
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 300, isMobile ? 120 : 220, isMobile ? 90 : 160),
    new THREE.ShaderMaterial({
      uniforms: waterUniforms,
      fog: true,
      vertexShader: `
        uniform float uTime;
        varying vec3 vWorld;
        varying float vWave;
        #include <fog_pars_vertex>
        void main() {
          vec3 p = position;
          float w = sin(p.x * 0.25 + uTime * 0.9) * 0.12
                  + sin(p.y * 0.35 + uTime * 1.2) * 0.10
                  + sin((p.x + p.y) * 0.6 + uTime * 1.7) * 0.05;
          p.z += w;
          vWave = w;
          vec4 world = modelMatrix * vec4(p, 1.0);
          vWorld = world.xyz;
          vec4 mvPosition = viewMatrix * world;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uDeep, uSky, uSun;
        varying vec3 vWorld;
        varying float vWave;
        #include <fog_pars_fragment>
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
        void main() {
          float dist = clamp(-vWorld.z / 140.0, 0.0, 1.0);
          vec3 col = mix(uDeep, uSky, smoothstep(0.0, 1.0, dist) * 0.85 + vWave * 0.6);
          // soft rippled sky reflection
          float ripple = sin(vWorld.x * 1.3 + sin(vWorld.z * 0.9 + uTime * 0.7) * 1.5) * sin(vWorld.z * 2.2 - uTime * 1.1);
          col += uSky * ripple * 0.05 * (1.0 - dist);
          // sun reflection streak with thin shimmering glints
          float streak = exp(-abs(vWorld.x) * (0.12 + (1.0 - dist) * 0.18));
          float g = sin(vWorld.x * 7.0 + sin(vWorld.z * 0.8 + uTime) * 3.0) * sin(vWorld.z * 3.2 + uTime * 1.6);
          float glint = smoothstep(0.75, 1.0, g);
          col += uSun * streak * (0.28 + glint * 0.9) * (0.35 + dist);
          // faint scattered sparkles across the lake
          col += uSun * smoothstep(0.93, 1.0, g) * 0.12 * (1.0 - streak);
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`
    })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.z = -100;
  scene.add(water);

  /* ---------------- Cherry blossom petals (instanced) ---------------- */
  const petalShape = new THREE.Shape();
  petalShape.moveTo(0, 0);
  petalShape.bezierCurveTo(0.22, 0.12, 0.26, 0.42, 0.1, 0.58);
  petalShape.lineTo(0, 0.5);
  petalShape.lineTo(-0.1, 0.58);
  petalShape.bezierCurveTo(-0.26, 0.42, -0.22, 0.12, 0, 0);
  const petalGeo = new THREE.ShapeGeometry(petalShape, 6);
  petalGeo.translate(0, -0.28, 0);
  // a little cup-shape so light catches it
  {
    const p = petalGeo.attributes.position;
    for (let i = 0; i < p.count; i++) p.setZ(i, p.getX(i) * p.getX(i) * 0.9);
    petalGeo.computeVertexNormals();
  }
  const COUNT = isMobile ? 260 : 600;
  const petalMat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 0.95, fog: true });
  const petals = new THREE.InstancedMesh(petalGeo, petalMat, COUNT);
  const palette = ["#ffd1dc", "#f9b4c6", "#f4a7b9", "#ffe4ec", "#ec8fab", "#fff0f4"].map(c => new THREE.Color(c));
  const pData = [];
  const dummy = new THREE.Object3D();
  const RANGE = { x: 26, yMin: -0.5, yMax: 14, zMin: -30, zMax: 8 };
  for (let i = 0; i < COUNT; i++) {
    pData.push({
      x: (Math.random() - 0.5) * RANGE.x * 2,
      y: Math.random() * RANGE.yMax,
      z: RANGE.zMin + Math.random() * (RANGE.zMax - RANGE.zMin),
      rx: Math.random() * Math.PI, ry: Math.random() * Math.PI, rz: Math.random() * Math.PI,
      vr: 0.4 + Math.random() * 1.2,
      fall: 0.35 + Math.random() * 0.55,
      sway: 0.4 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      s: 0.18 + Math.random() * 0.22
    });
    petals.setColorAt(i, palette[i % palette.length]);
  }
  petals.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(petals);

  /* ---------------- Fireflies / floating light ---------------- */
  const flyCount = isMobile ? 60 : 140;
  const flyGeo = new THREE.BufferGeometry();
  const flyPos = new Float32Array(flyCount * 3);
  const flySeed = new Float32Array(flyCount);
  for (let i = 0; i < flyCount; i++) {
    flyPos[i * 3] = (Math.random() - 0.5) * 50;
    flyPos[i * 3 + 1] = 0.5 + Math.random() * 6;
    flyPos[i * 3 + 2] = -40 + Math.random() * 44;
    flySeed[i] = Math.random() * 100;
  }
  flyGeo.setAttribute("position", new THREE.BufferAttribute(flyPos, 3));
  flyGeo.setAttribute("aSeed", new THREE.BufferAttribute(flySeed, 1));
  const flies = new THREE.Points(flyGeo, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPR: { value: renderer.getPixelRatio() } },
    vertexShader: `
      uniform float uTime, uPR;
      attribute float aSeed;
      varying float vA;
      void main() {
        vec3 p = position;
        p.x += sin(uTime * 0.3 + aSeed) * 1.2;
        p.y += sin(uTime * 0.5 + aSeed * 1.3) * 0.6;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (90.0 * uPR) / -mv.z;
        vA = 0.35 + 0.65 * abs(sin(uTime * 1.5 + aSeed));
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying float vA;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(1.0, 0.85, 0.6, a * vA * 0.9);
      }`
  }));
  scene.add(flies);

  /* ---------------- Interaction & loop ---------------- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", e => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  // values driven from GSAP (main.js)
  const state = { progress: 0, wind: 1, intro: 0 };

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 70 : 55;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 }).observe(canvas);

  const clock = new THREE.Clock();
  let elapsed = 0;
  function tick() {
    requestAnimationFrame(tick);
    if (!visible) { clock.getDelta(); return; }
    const dt = Math.min(clock.getDelta(), 0.05);
    elapsed += dt;

    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;

    // camera: intro dolly + scroll + mouse parallax
    const p = state.progress;
    camera.position.x = camBase.x + mouse.x * 1.2;
    camera.position.y = camBase.y + (1 - state.intro) * 3 - p * 1.6 - mouse.y * 0.5;
    camera.position.z = camBase.z + (1 - state.intro) * 8 - p * 9;
    lookTarget.y = 2.4 + p * 2.2;
    camera.lookAt(lookTarget);

    sky.material.uniforms.uTime.value = elapsed;
    waterUniforms.uTime.value = elapsed;
    flies.material.uniforms.uTime.value = elapsed;

    palms.forEach(pl => {
      const c = pl.userData.crown;
      c.rotation.z = Math.sin(elapsed * 0.8 + pl.userData.phase) * 0.05;
      c.rotation.x = Math.cos(elapsed * 0.6 + pl.userData.phase) * 0.04;
    });

    const wind = state.wind;
    for (let i = 0; i < COUNT; i++) {
      const d = pData[i];
      d.y -= d.fall * dt * (0.8 + wind * 0.4);
      d.x += (Math.sin(elapsed * d.sway + d.phase) * 0.6 + wind * 0.9) * dt;
      d.z += Math.cos(elapsed * 0.5 + d.phase) * 0.2 * dt;
      d.rx += d.vr * dt; d.ry += d.vr * 0.7 * dt; d.rz += d.vr * 0.4 * dt;
      if (d.y < RANGE.yMin) { d.y = RANGE.yMax; d.x = (Math.random() - 0.5) * RANGE.x * 2; }
      if (d.x > RANGE.x) d.x = -RANGE.x;
      dummy.position.set(d.x, d.y, d.z);
      dummy.rotation.set(d.rx, d.ry, d.rz);
      dummy.scale.setScalar(d.s);
      dummy.updateMatrix();
      petals.setMatrixAt(i, dummy.matrix);
    }
    petals.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);
  }
  tick();

  window.HeroScene = { state };
})();
