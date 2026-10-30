// Recursos del ambiente: manchas de taza sobre "la mesa" y bordes líquidos.
// (Los granos son 3D: ver BeanCanvas.)

// Degradado compartido de las manchas: se define una vez y cada mancha lo reutiliza
export function AmbientDefs() {
  return (
    <svg className="ambient-defs" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="stain-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0.62" stopColor="#9A6440" stopOpacity="0" />
          <stop offset="0.94" stopColor="#9A6440" stopOpacity="0.12" />
          <stop offset="1" stopColor="#9A6440" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// Generador pseudoaleatorio con semilla: cada mancha es irregular pero siempre igual
function seeded(seed) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Anillo irregular y cerrado (Catmull-Rom → Bézier)
function ringPath(seed, r, wobble, points = 16) {
  const rand = seeded(seed);
  const pts = Array.from({ length: points }, (_, i) => {
    const a = (i / points) * Math.PI * 2;
    const rr = r + (rand() - 0.5) * 2 * wobble;
    return [100 + Math.cos(a) * rr, 100 + Math.sin(a) * rr];
  });
  const p = (i) => pts[(i + points) % points];
  const f = (n) => n.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < points; i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d}Z`;
}

function Stain({ seed }) {
  return (
    <svg viewBox="0 0 200 200">
      <circle className="stain-fill" cx="100" cy="100" r="86" fill="url(#stain-fill)" />
      <path className="stain-ring" d={ringPath(seed, 80, 2.6)} pathLength="1" />
      <path className="stain-ring-2" d={ringPath(seed + 11, 73, 4.5)} pathLength="1" />
      <circle className="stain-drop" cx="178" cy="146" r="3.6" />
      <circle className="stain-drop" cx="188" cy="131" r="2" />
    </svg>
  );
}

// Manchas de taza; la capa sigue un poco al mouse (.decor-mouse, animada desde App)
export function Decor({ items }) {
  return (
    <div className="decor" aria-hidden="true">
      <div className="decor-layer" data-depth="1">
        <div className="decor-mouse" data-depth="1">
          {items.map((it, i) => (
            <div
              key={i}
              className={`decor-item decor-stain ${it.mobile ? '' : 'no-mobile'}`}
              style={{ left: `${it.x}%`, top: `${it.y}%`, width: it.s, height: it.s, marginLeft: -it.s / 2, marginTop: -it.s / 2 }}
            >
              <div className="decor-art" style={{ transform: `rotate(${it.r ?? 0}deg)` }}>
                <Stain seed={it.seed ?? 7} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function wavePath(phase, amp, base) {
  const W = 4320;
  const H = 48;
  let d = `M0 ${H}`;
  for (let x = 0; x <= W; x += 20) {
    const y = base + Math.sin((x / 360) * Math.PI * 2 + phase) * amp;
    d += `L${x} ${y.toFixed(1)}`;
  }
  return `${d}L${W} ${H}Z`;
}

const WAVE_BACK = wavePath(1.4, 7, 22);
const WAVE_FRONT = wavePath(0, 9, 28);

// Borde líquido de las secciones color latte ('inside-top' cuelga sobre una foto, en color papel)
export function Wave({ position = 'top' }) {
  return (
    <div className={`wave wave-${position}`} aria-hidden="true">
      <svg className="wave-back" viewBox="0 0 4320 48" preserveAspectRatio="none">
        <path d={WAVE_BACK} />
      </svg>
      <svg className="wave-front" viewBox="0 0 4320 48" preserveAspectRatio="none">
        <path d={WAVE_FRONT} />
      </svg>
    </div>
  );
}
