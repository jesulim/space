import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const CAMERA_Z = 16;
const FOV = 32;
const { lerp, clamp } = THREE.MathUtils;

// Un grano tostado: óvalo con lomo curvo, cara plana y el surco en forma de S
function beanGeometry() {
  let g = new THREE.SphereGeometry(1, 112, 84);
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  g = mergeVertices(g);

  const pos = g.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const roast = new THREE.Color('#4f2915');
  const edge = new THREE.Color('#70401f');
  const crease = new THREE.Color('#120803');
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) * 0.72;
    const y = pos.getY(i);
    let z = pos.getZ(i) * 0.5;
    let groove = 0;
    if (z > 0) {
      z *= 0.62;
      const center = 0.11 * Math.sin(y * Math.PI * 0.9);
      const d = x - center;
      const along = Math.max(0, 1 - Math.pow(Math.abs(y) / 0.9, 6));
      groove = Math.exp(-(d * d) / (2 * 0.065 * 0.065)) * along;
      z -= groove * 0.26;
    }
    pos.setXYZ(i, x, y, z);

    const rim = Math.min(1, Math.abs(x) / 0.72);
    c.copy(roast).lerp(edge, rim * 0.5).lerp(crease, Math.min(1, groove * 1.15));
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

function makeBean(i, total, small) {
  // 0 = lejos (pequeño, con niebla) · 1 = cerca (grande, nítido)
  const depth = Math.random();
  // Alternan izquierda/derecha y se reparten a lo alto para no amontonarse
  const side = i % 2 ? 1 : -1;
  const perSide = Math.ceil(total / 2);
  // La mayoría flota en los márgenes; solo algunos lejanos cruzan por detrás del contenido
  const inCenter = !small && depth < 0.3 && Math.random() < 0.35;
  const xn = inCenter ? lerp(-0.55, 0.55, Math.random()) : side * lerp(small ? 0.92 : 0.84, small ? 1.1 : 1.04, Math.random());
  return {
    xn,
    z: lerp(-9, 5, depth),
    yn: (Math.floor(i / 2) + Math.random() * 0.7) / perSide,
    speed: lerp(0.18, 0.6, depth),
    scale: lerp(0.26, 0.36, depth) * (small ? 0.8 : 1),
    // Casi todos muestran la cara del surco; unos pocos el lomo
    tiltX: lerp(-0.45, 0.45, Math.random()),
    tiltY: (Math.random() < 0.25 ? Math.PI : 0) + lerp(-0.5, 0.5, Math.random()),
    rotZ: Math.random() * Math.PI * 2,
    flip: 0,
    spinZ: lerp(-0.3, 0.3, Math.random()),
    wobble: lerp(0.4, 0.8, Math.random()),
    bob: Math.random() * Math.PI * 2,
  };
}

// Campo de granos en 3D fijo detrás del contenido. Devuelve { destroy }.
export function createBeanField(canvas, { reduceMotion = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf3ebe0, 20, 42);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envMap;

  const key = new THREE.DirectionalLight(0xffe2c4, 1.8);
  key.position.set(-5, 7, 9);
  const fill = new THREE.DirectionalLight(0xffffff, 0.45);
  fill.position.set(6, -2, 4);
  scene.add(key, fill, new THREE.AmbientLight(0xffeedd, 0.3));

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.z = CAMERA_Z;

  const small = window.innerWidth < 760;
  const total = small ? 8 : 20;
  const beans = Array.from({ length: total }, (_, i) => makeBean(i, total, small));

  const geometry = beanGeometry();
  const material = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.45,
    clearcoat: 0.55,
    clearcoatRoughness: 0.3,
    sheen: 0.12,
    sheenColor: new THREE.Color('#c8956a'),
    sheenRoughness: 0.6,
    envMapIntensity: 0.35,
  });
  const mesh = new THREE.InstancedMesh(geometry, material, beans.length);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(mesh);

  const dummy = new THREE.Object3D();
  const halfTan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  const pointer = { x: 0, y: 0 };
  let lastScroll = window.scrollY;
  let boost = 0;
  let time = 0;

  const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };

  const update = (dt) => {
    time += dt;
    const scroll = window.scrollY;
    // Al hacer scroll rápido los granos giran más
    boost = lerp(boost, Math.min(6, Math.abs(scroll - lastScroll) / 6), 0.08);
    lastScroll = scroll;

    camera.position.x = lerp(camera.position.x, pointer.x * 0.8, 0.04);
    camera.position.y = lerp(camera.position.y, -pointer.y * 0.5, 0.04);
    camera.lookAt(0, 0, 0);

    beans.forEach((b, i) => {
      const hh = halfTan * (CAMERA_Z - b.z);
      const hw = hh * camera.aspect;
      const cycle = hh * 2 * 1.35;
      const worldPerPx = (hh * 2) / window.innerHeight;
      const raw = b.yn * cycle + scroll * b.speed * worldPerPx;
      const y = (((raw % cycle) + cycle) % cycle) - cycle / 2;

      // Se balancean suavemente; al hacer scroll rápido se voltean
      b.rotZ += b.spinZ * dt * (1 + boost * 0.5);
      b.flip += dt * boost * 0.9;

      dummy.position.set(b.xn * hw, y + Math.sin(time * 0.6 + b.bob) * 0.12, b.z);
      dummy.rotation.set(
        b.tiltX + Math.sin(time * b.wobble + b.bob) * 0.35,
        b.tiltY + b.flip + Math.sin(time * b.wobble * 0.8 + b.bob * 2) * 0.45,
        b.rotZ,
      );
      dummy.scale.setScalar(b.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  const render = () => renderer.render(scene, camera);

  let raf = 0;
  let last = performance.now();
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const dt = clamp((now - last) / 1000, 0, 0.05);
    last = now;
    update(dt);
    render();
  };

  const onPointer = (e) => {
    pointer.x = e.clientX / window.innerWidth - 0.5;
    pointer.y = e.clientY / window.innerHeight - 0.5;
  };
  const onResize = () => {
    resize();
    if (reduceMotion) {
      update(0);
      render();
    }
  };

  resize();
  update(0);
  render();
  window.addEventListener('resize', onResize);
  if (!reduceMotion) {
    window.addEventListener('pointermove', onPointer, { passive: true });
    raf = requestAnimationFrame(frame);
  }

  return {
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      geometry.dispose();
      material.dispose();
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
