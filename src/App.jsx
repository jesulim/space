import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  CircleCheck,
  Coffee,
  Copy,
  ExternalLink,
  Eye,
  Send,
  Sparkles,
} from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, NAV_OFFSET, scrollToId } from './gsap';
import { CHECKLIST, CREDITS, LAB_STEPS, MASTER_PROMPT, NAV, PIECES, RECIPE, ROLES, TOOLS } from './data';
import { AmbientDefs, Decor, Wave } from './components/Ambient';
import AnalogyRow from './components/AnalogyRow';
import BeanCanvas from './components/BeanCanvas';
import CoffeeCursor from './components/CoffeeCursor';
import DevToolsDrawer from './components/DevToolsDrawer';
import Mostrador from './components/Mostrador';
import Nav from './components/Nav';
import PiecesStory from './components/PiecesStory';
import Lottie from './components/Lottie';
import SectionHead from './components/SectionHead';
import { DECOR } from './decor';
import latteCup from './assets/photos/latte-cup.webp';
import beansBand from './assets/photos/beans-band.webp';
import './App.css';

const CONFETTI_COLORS = ['#A8531B', '#E2C29E', '#F4B860', '#2B8A3E', '#FFFFFF'];

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sin almacenamiento disponible (modo privado): la app sigue funcionando
  }
}

export default function App() {
  const appRef = useRef(null);
  const piecesApi = useRef(null);

  const [theme, setTheme] = useState(() => load('vibe_theme', 'dark'));
  const [cafesServidos, setCafesServidos] = useState(() => Number(load('vibe_cafes_count', 0)) || 0);
  const [isBrewing, setIsBrewing] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [devtoolsOpen, setDevtoolsOpen] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [checklist, setChecklist] = useState(() => {
    const saved = load('vibe_checklist', []);
    return CHECKLIST.map((item) => ({
      ...item,
      checked: saved.find?.((s) => s.id === item.id)?.checked ?? item.checked,
    }));
  });
  const [challengeUrl, setChallengeUrl] = useState('');
  const [challengeOption, setChallengeOption] = useState('A');
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);

  useEffect(() => {
    save('vibe_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#120c08' : '#fbf7f1');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => save('vibe_cafes_count', cafesServidos), [cafesServidos]);
  useEffect(() => save('vibe_checklist', checklist), [checklist]);

  const burst = (e, options = {}) => {
    const origin = e?.clientX
      ? { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
      : { y: 0.7 };
    confetti({ particleCount: 40, spread: 60, origin, colors: CONFETTI_COLORS, ...options });
  };

  const handlePedirCafe = (e) => {
    setCafesServidos((n) => n + 1);
    setIsBrewing(true);
    setTimeout(() => setIsBrewing(false), 900);
    burst(e);
  };

  const toggleChecklistItem = (id) => {
    const updated = checklist.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item));
    setChecklist(updated);
    if (updated.every((i) => i.checked)) burst(null, { particleCount: 120, spread: 90 });
  };

  const checklistProgress = Math.round((checklist.filter((i) => i.checked).length / checklist.length) * 100);

  const copyPrompt = async (e) => {
    try {
      await navigator.clipboard.writeText(MASTER_PROMPT);
      setCopiedPrompt(true);
      burst(e, { particleCount: 30 });
      setTimeout(() => setCopiedPrompt(false), 2500);
    } catch {
      // Sin acceso al portapapeles: mostramos el texto para copiarlo a mano
      setPromptOpen(true);
    }
  };

  const handleChallengeSubmit = (e) => {
    e.preventDefault();
    if (!challengeUrl) return;
    setChallengeSubmitted(true);
    burst(null, { particleCount: 80, spread: 80 });
  };

  // La historia de las piezas ya deja espacio para la barra: se llega a su borde exacto
  const navigate = (id) => scrollToId(id, id === 'piezas' ? 0 : NAV_OFFSET);

  const goTo = (e, id) => {
    e.preventDefault();
    navigate(id);
  };

  useGSAP(
    () => {
      // La taza de la marca se llena con el progreso de lectura (siempre activo)
      gsap.set('.brand-liquid', { transformOrigin: '50% 100%' });
      gsap.fromTo(
        '.brand-liquid',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } },
      );
      ScrollTrigger.create({ start: 8, end: 'max', toggleClass: { targets: '.nav', className: 'is-scrolled' } });
      NAV.forEach(({ id }) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => {
            if (self.isActive) setActiveSection(id);
          },
        });
      });
      ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        end: 'bottom 45%',
        onEnterBack: () => setActiveSection(null),
      });

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        document.documentElement.classList.add('motion-ok');

        // Portada: entrada al cargar
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro
          .from('.hero-eyebrow', { y: 16, autoAlpha: 0, duration: 0.6 })
          .from('.hero-line > span', { yPercent: 110, duration: 1, stagger: 0.12 }, '-=0.3')
          .from('.hero-sub, .hero-ctas', { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.1 }, '-=0.55')
          .from('.menu-card', { y: 70, rotate: 7, autoAlpha: 0, duration: 1.1 }, 0.25)
          .from('.menu-row', { x: -14, autoAlpha: 0, duration: 0.5, stagger: 0.07 }, 0.75)
          .from('.menu-leader', { scaleX: 0, duration: 0.6, stagger: 0.07 }, 0.85)
          .from('.hero-cup', { y: 40, scale: 0.7, rotate: -30, autoAlpha: 0, duration: 1.2, ease: 'back.out(1.6)' }, 0.9);
        gsap.to('.hero-cup-img', { rotation: 360, duration: 140, ease: 'none', repeat: -1 });

        // Portada: parallax al salir
        const heroScroll = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('.hero-copy', { yPercent: -16, autoAlpha: 0.25, ease: 'none', scrollTrigger: heroScroll });
        gsap.to('.hero-menu-wrap', { y: -110, rotate: 4, ease: 'none', scrollTrigger: heroScroll });

        // Ambiente: las manchas se mueven un poco con el scroll y se dibujan al aparecer
        gsap.utils.toArray('.decor-layer').forEach((layer) => {
          const shift = [0, 30, 70, 130][Number(layer.dataset.depth)];
          gsap.fromTo(
            layer,
            { y: shift },
            {
              y: -shift,
              ease: 'none',
              scrollTrigger: { trigger: layer.closest('section, footer'), start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });
        gsap.utils.toArray('.decor-stain').forEach((stain) => {
          gsap
            .timeline({ scrollTrigger: { trigger: stain, start: 'top 90%', once: true } })
            .from(stain.querySelector('.stain-fill'), { autoAlpha: 0, duration: 1.4 })
            .fromTo(
              stain.querySelector('.stain-ring'),
              { strokeDashoffset: 1 },
              { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' },
              0,
            )
            .from(stain.querySelectorAll('.stain-ring-2, .stain-drop'), { autoAlpha: 0, duration: 0.8, stagger: 0.15 }, 1);
        });

        // Bloques que aparecen al entrar en pantalla
        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: 36,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });

        // El subrayado de las palabras clave se dibuja al llegar al título
        gsap.utils.toArray('.title em').forEach((em) => {
          gsap.from(em, {
            backgroundSize: '0% 0.22em',
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: { trigger: em, start: 'top 85%', once: true },
          });
        });

        // Analogías partidas: cada mitad entra desde su lado y el "=" las une
        gsap.utils.toArray('[data-split-row]').forEach((row) => {
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: 'top 82%', toggleActions: 'play none none reverse' } })
            .from(row.querySelector('.split-l'), { x: -70, autoAlpha: 0, duration: 0.8, ease: 'power3.out' })
            .from(row.querySelector('.split-r'), { x: 70, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, '<0.08')
            .from(
              row.querySelector('.split-eq'),
              { scale: 0, rotate: -180, autoAlpha: 0, duration: 0.6, ease: 'back.out(2.2)' },
              '<0.3',
            );
        });
        gsap.utils.toArray('.arow-photo').forEach((photo) => {
          gsap
            .timeline({ scrollTrigger: { trigger: photo, start: 'top 85%', once: true } })
            .from(photo, { clipPath: 'inset(0% 0% 100% 0% round 16px)', duration: 1, ease: 'power3.inOut' })
            .from(photo.querySelector('img'), { scale: 1.3, duration: 1.6, ease: 'power2.out' }, 0);
        });

        // Banda de cierre: la foto se desplaza más lento que la página y el texto sube
        gsap.fromTo(
          '.band-media',
          { yPercent: -12 },
          { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.band', start: 'top bottom', end: 'bottom top', scrub: true } },
        );
        gsap.from('.band-line', {
          yPercent: 110,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.band', start: 'top 70%', once: true },
        });

        // Antes / ahora: se tacha el albañil mientras haces scroll
        gsap
          .timeline({ scrollTrigger: { trigger: '.shift', start: 'top 78%', end: 'top 28%', scrub: 0.6 } })
          .from('.shift-strike', { scaleX: 0, ease: 'none' })
          .to('.shift-before', { autoAlpha: 0.55, scale: 0.97, ease: 'none' }, 0)
          .from('.shift-after', { y: 40, ease: 'none' }, 0)
          .from('.shift-arrow', { x: -24, rotate: -90, autoAlpha: 0, ease: 'none' }, 0.2);

        // Paso a paso del deploy: la línea se llena con el scroll
        gsap.fromTo(
          '.lab-steps',
          { '--p': 0 },
          {
            '--p': 1,
            ease: 'none',
            scrollTrigger: { trigger: '.lab-steps', start: 'top 75%', end: 'bottom 55%', scrub: 0.5 },
          },
        );
        gsap.from('.lab-step', {
          y: 30,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.lab-steps', start: 'top 80%', once: true },
        });

        return () => document.documentElement.classList.remove('motion-ok');
      });

      // La receta: cada capa del latte se sirve al pasar por su paso
      mm.add(`${MOTION_OK} and (min-width: 900px)`, () => {
        gsap.utils.toArray('.recipe-step').forEach((step, i) => {
          gsap.fromTo(
            `.cup-layer[data-layer="${i}"]`,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              ease: 'none',
              scrollTrigger: { trigger: step, start: 'top 78%', end: 'top 45%', scrub: 0.5 },
            },
          );
          ScrollTrigger.create({ trigger: step, start: 'top 62%', end: 'bottom 38%', toggleClass: 'is-active' });
        });
      });
      mm.add(`${MOTION_OK} and (max-width: 899px)`, () => {
        gsap.fromTo(
          '.cup-layer',
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.6,
            stagger: 0.35,
            ease: 'power2.out',
            scrollTrigger: { trigger: '.cup', start: 'top 75%', once: true },
          },
        );
        document.querySelectorAll('.recipe-step').forEach((s) => s.classList.add('is-active'));
      });

      // Con mouse, las manchas siguen un poco al puntero
      mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
        const movers = gsap.utils.toArray('.decor-mouse').map((el) => ({
          k: Number(el.dataset.depth) * 9,
          x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3.out' }),
        }));
        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(-nx * m.k * 2);
            m.y(-ny * m.k * 2);
          });
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
      });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: appRef },
  );

  return (
    <div className="app" ref={appRef}>
      <AmbientDefs />
      <BeanCanvas />
      <div className="grain" aria-hidden="true" />
      <Nav
        activeSection={activeSection}
        count={cafesServidos}
        devtoolsOpen={devtoolsOpen}
        onToggleDevtools={() => setDevtoolsOpen((o) => !o)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigate={navigate}
      />

      <main>
        {/* 00 · PORTADA */}
        <section className="hero" id="inicio">
          <span className="hero-glow hero-glow-1" aria-hidden="true" />
          <span className="hero-glow hero-glow-2" aria-hidden="true" />
          <Decor items={DECOR.hero} />

          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="hero-eyebrow">
                <Sparkles size={14} /> Vibe Coding · American Space · Sesión 1
              </span>
              <h1 className="hero-title">
                <span className="hero-line">
                  <span>Una web app</span>
                </span>
                <span className="hero-line">
                  <span>
                    es una <em>cafetería</em>.
                  </span>
                </span>
              </h1>
              <p className="hero-sub">
                Si sabes cómo funciona una cafetería, ya sabes cómo funciona una app. Seis piezas, una analogía y tu
                primer deploy, hoy.
              </p>
              <div className="hero-ctas">
                <a href="#piezas" className="btn btn-primary" onClick={(e) => goTo(e, 'piezas')}>
                  Recorrer las 6 piezas <ArrowDown size={17} />
                </a>
                <a href="#mostrador" className="btn btn-secondary" onClick={(e) => goTo(e, 'mostrador')}>
                  Probar el mostrador
                </a>
              </div>
            </div>

            <div className="hero-menu-wrap">
              <div className="menu-card">
                <div className="menu-head">
                  <span className="menu-kicker">El menú de hoy</span>
                  <span className="menu-title">Cafetería = Web app</span>
                </div>
                <ul className="menu-list">
                  {PIECES.map((p, i) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        className="menu-row"
                        style={{ '--tone': `var(--${p.color})` }}
                        onClick={() => piecesApi.current?.goTo(i)}
                      >
                        <span className="menu-cafe">{p.short}</span>
                        <span className="menu-leader" aria-hidden="true" />
                        <span className="menu-tech">{p.tech}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="menu-foot">Tú diriges. La IA construye.</p>
              </div>
              <div className="hero-cup" aria-hidden="true">
                <Lottie className="hero-steam" load={() => import('./assets/lottie/steam.json')} speed={0.7} />
                <img className="hero-cup-img" src={latteCup} alt="" width="520" height="520" decoding="async" />
              </div>
            </div>
          </div>

          <span className="hero-scroll" aria-hidden="true">
            Desliza <ArrowDown size={16} />
          </span>
        </section>

        {/* 01 · LA IDEA */}
        <section className="section" id="idea">
          <Decor items={DECOR.idea} />
          <div className="container">
            <SectionHead
              num="01"
              kicker="La idea"
              title={
                <>
                  Ya no pones los ladrillos. <em>Diriges la obra.</em>
                </>
              }
            />

            <div className="shift">
              <div className="shift-card shift-before">
                <span className="shift-tag">Antes</span>
                <span className="shift-role">
                  Albañil de código
                  <span className="shift-strike" aria-hidden="true" />
                </span>
                <p className="shift-line">Meses de sintaxis, cazando el punto y coma, y el deploy al final… si llegaba.</p>
              </div>
              <span className="shift-arrow" aria-hidden="true">
                <ArrowRight size={20} />
              </span>
              <div className="shift-card shift-after">
                <span className="shift-tag">Ahora</span>
                <span className="shift-role">Director del local</span>
                <p className="shift-line">Entiendes las piezas, das instrucciones claras y publicas desde el día uno.</p>
              </div>
            </div>

            <h3 className="subhead" data-reveal>
              Quién hace qué
            </h3>
            <div className="rows">
              {ROLES.map((r) => (
                <AnalogyRow key={r.id} {...r}>
                  {r.id === 'devtools' && (
                    <button type="button" className="btn btn-secondary btn-sm row-action" onClick={() => setDevtoolsOpen(true)}>
                      <Eye size={14} /> Abrir las cámaras
                    </button>
                  )}
                </AnalogyRow>
              ))}
            </div>
          </div>
        </section>

        {/* 02 · LAS 6 PIEZAS */}
        <PiecesStory count={cafesServidos} onOrder={handlePedirCafe} apiRef={piecesApi} />

        {/* 03 · EL MOSTRADOR */}
        <Mostrador count={cafesServidos} isBrewing={isBrewing} onOrder={handlePedirCafe} />

        {/* 04 · EL EQUIPO */}
        <section className="section" id="equipo">
          <Decor items={DECOR.equipo} />
          <div className="container">
            <SectionHead
              num="04"
              kicker="Tu equipo"
              title={
                <>
                  Cada herramienta, <em>un oficio</em>.
                </>
              }
              lead="No hay una herramienta mágica: hay tres tipos de ayuda, cada una para un momento distinto."
            />
            <div className="rows">
              {TOOLS.map((t) => (
                <AnalogyRow
                  key={t.id}
                  icon={t.icon}
                  cafe={t.cafe}
                  cafeLine={t.cafeLine}
                  web={t.web}
                  webLine={t.webLine}
                >
                  <div className="chips">
                    {t.items.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </div>
                  <span className="phase">{t.phase}</span>
                </AnalogyRow>
              ))}
            </div>
          </div>
        </section>

        {/* 05 · LA RECETA */}
        <section className="section alt" id="receta">
          <Wave position="top" />
          <Decor items={DECOR.receta} />
          <div className="container">
            <SectionHead
              num="05"
              kicker="La receta"
              title={
                <>
                  Pide tu app como un latte: <em>capa por capa</em>.
                </>
              }
              lead="Un pedido vago da una app vaga. Estas cuatro capas le dicen a la IA exactamente qué servir."
            />

            <div className="recipe">
              <ol className="recipe-steps">
                {RECIPE.map((r, i) => (
                  <li key={r.title} className="recipe-step" style={{ '--layer': r.color, '--layer-ink': r.ink }}>
                    <span className="recipe-num">{i + 1}</span>
                    <div>
                      <span className="recipe-layer">{r.layer}</span>
                      <h3 className="recipe-title">{r.title}</h3>
                      <p className="recipe-line">{r.line}</p>
                      <p className="recipe-example">{r.example}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="cup-wrap" aria-hidden="true">
                <div className="cup">
                  <div className="cup-glass">
                    {RECIPE.map((r, i) => (
                      <div
                        key={r.title}
                        className="cup-layer"
                        data-layer={i}
                        style={{ '--layer': r.color, '--layer-ink': r.ink }}
                      >
                        {i === RECIPE.length - 1 && <span className="cup-art">♥</span>}
                        <span className="cup-label">
                          {i + 1} · {r.title}
                        </span>
                      </div>
                    ))}
                  </div>
                  <span className="cup-handle" />
                </div>
                <span className="cup-saucer" />
                <span className="cup-caption">Tu pedido, capa por capa</span>
              </div>
            </div>

            <div className="master" data-reveal>
              <div className="master-top">
                <div>
                  <span className="kicker">Listo para copiar</span>
                  <h3 className="master-title">El prompt maestro de la sesión</h3>
                </div>
                <div className="master-actions">
                  <button type="button" className="btn btn-primary" onClick={copyPrompt}>
                    {copiedPrompt ? <Check size={17} /> : <Copy size={17} />}
                    {copiedPrompt ? '¡Copiado!' : 'Copiar prompt'}
                  </button>
                  <a href="https://v0.dev" target="_blank" rel="noreferrer" className="btn btn-secondary">
                    v0 <ExternalLink size={14} />
                  </a>
                  <a href="https://bolt.new" target="_blank" rel="noreferrer" className="btn btn-secondary">
                    Bolt <ExternalLink size={14} />
                  </a>
                </div>
              </div>
              <button
                type="button"
                className="master-toggle"
                aria-expanded={promptOpen}
                onClick={() => setPromptOpen((o) => !o)}
              >
                {promptOpen ? 'Ocultar el prompt' : 'Ver el prompt completo'} <ChevronDown size={16} />
              </button>
              {promptOpen && <pre className="master-pre">{MASTER_PROMPT}</pre>}
            </div>
          </div>
          <Wave position="bottom" />
        </section>

        {/* 06 · EL DEPLOY */}
        <section className="section" id="deploy">
          <Decor items={DECOR.deploy} />
          <div className="container">
            <SectionHead
              num="06"
              kicker="El deploy"
              title={
                <>
                  Abre las puertas: <em>tu primer deploy</em>.
                </>
              }
              lead="Sesenta minutos, cuatro pasos. La primera web que publicas es esta misma clase."
            />

            <ol className="lab-steps">
              {LAB_STEPS.map((s, i) => (
                <li key={s.title} className="lab-step">
                  <span className="lab-dot">{i + 1}</span>
                  <div className="lab-body">
                    <span className="lab-time">{s.time}</span>
                    <h3 className="lab-title">{s.title}</h3>
                    <span className="lab-cafe">{s.cafe}</span>
                    <p className="lab-text">{s.line}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="check-card" data-reveal>
              <div className="check-top">
                <div>
                  <h3 className="check-title">Mi primer deploy</h3>
                  <p className="check-sub">Tu avance queda en el almacén del navegador: recarga y sigue ahí.</p>
                </div>
                <span className={`check-pct ${checklistProgress === 100 ? 'is-done' : ''}`}>{checklistProgress}%</span>
              </div>
              <div
                className="progress"
                role="progressbar"
                aria-valuenow={checklistProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span className="progress-fill" style={{ width: `${checklistProgress}%` }} />
              </div>
              <ul className="check-list">
                {checklist.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`check-item ${item.checked ? 'is-checked' : ''}`}
                      aria-pressed={item.checked}
                      onClick={() => toggleChecklistItem(item.id)}
                    >
                      <span className="check-box">{item.checked && <Check size={15} strokeWidth={3} />}</span>
                      <span>
                        <span className="check-item-title">{item.title}</span>
                        <span className="check-item-desc">{item.desc}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {checklistProgress === 100 && (
                <p className="check-done">
                  <CircleCheck size={22} /> ¡Local abierto! Completaste todos los pasos de la Sesión 1.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 07 · EL RETO */}
        <section className="section" id="reto">
          <Decor items={DECOR.reto} />
          <div className="container">
            <div className="reto-card" data-reveal>
              <span className="kicker">
                <span className="kicker-num">07</span> El reto
              </span>
              <h2 className="title">
                Tu tarea para la <em>Sesión 2</em>.
              </h2>
              <p className="lead">
                Publica tu propio local y comparte tu link <code>.vercel.app</code> con el grupo.
              </p>

              <div className="reto-options">
                <button
                  type="button"
                  className="reto-option"
                  aria-pressed={challengeOption === 'A'}
                  onClick={() => setChallengeOption('A')}
                >
                  <span className="reto-tag">Opción A · Para equipos</span>
                  <span className="reto-title">La landing de tu proyecto</span>
                  <span className="reto-text">Tu equipo, el problema que resuelven y un botón de «Quiero ser voluntario».</span>
                </button>
                <button
                  type="button"
                  className="reto-option"
                  aria-pressed={challengeOption === 'B'}
                  onClick={() => setChallengeOption('B')}
                >
                  <span className="reto-tag">Opción B · Individual</span>
                  <span className="reto-title">Tu propia analogía</span>
                  <span className="reto-text">Cambia la cafetería por una pizzería, un taller o una nave espacial.</span>
                </button>
              </div>

              <form onSubmit={handleChallengeSubmit} className="reto-form">
                <label htmlFor="reto-url" className="sr-only">
                  Link de tu proyecto en Vercel
                </label>
                <input
                  id="reto-url"
                  type="url"
                  required
                  placeholder="https://mi-proyecto.vercel.app"
                  value={challengeUrl}
                  onChange={(e) => {
                    setChallengeUrl(e.target.value);
                    setChallengeSubmitted(false);
                  }}
                  className="reto-input"
                />
                <button type="submit" className="btn btn-primary">
                  <Send size={16} /> Validar entrega
                </button>
              </form>
              {challengeSubmitted && (
                <p className="reto-ok" role="status">
                  <CircleCheck size={18} /> ¡Listo! <strong>{challengeUrl}</strong> cumple para la Sesión 2 (opción{' '}
                  {challengeOption}).
                </p>
              )}
            </div>
          </div>
        </section>

        {/* CIERRE: foto real de granos con parallax */}
        <section className="band" aria-label="Cierre">
          <div className="band-media">
            <img src={beansBand} alt="Granos de café tostado" width="2000" height="958" loading="lazy" decoding="async" />
          </div>
          <div className="band-shade" />
          <Wave position="inside-top" />
          <div className="container band-inner">
            <p className="band-quote">
              <span className="band-line">Tú diriges.</span>
              <span className="band-line">
                <em>La IA construye.</em>
              </span>
            </p>
            <p className="band-sub">Nos vemos en la Sesión 2.</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <Wave position="top" />
        <div className="container footer-inner">
          <span className="brand">
            <span className="brand-cup">
              <Coffee size={20} />
            </span>
            <span className="brand-word">
              La Cafetería del <em>Vibe Coder</em>
            </span>
          </span>
          <p className="footer-text">
            Curso <strong>AI Web &amp; App Development · Vibe Coding</strong> · American Space · Sesión 1 de 4
          </p>
          <p className="footer-credits">
            Fotos en{' '}
            <a href="https://unsplash.com" target="_blank" rel="noreferrer">
              Unsplash
            </a>
            :{' '}
            {CREDITS.photos.map((c, i) => (
              <span key={c.name}>
                {i > 0 && ', '}
                <a href={c.url} target="_blank" rel="noreferrer">
                  {c.name}
                </a>
              </span>
            ))}
            . Animaciones en{' '}
            <a href="https://lottiefiles.com" target="_blank" rel="noreferrer">
              LottieFiles
            </a>
            :{' '}
            {CREDITS.animations.map((c, i) => (
              <span key={c.name}>
                {i > 0 && ' y '}
                <a href={c.url} target="_blank" rel="noreferrer">
                  {c.name}
                </a>
              </span>
            ))}
            .
          </p>
        </div>
      </footer>

      {devtoolsOpen && <DevToolsDrawer count={cafesServidos} onClose={() => setDevtoolsOpen(false)} />}
      <CoffeeCursor />
    </div>
  );
}
