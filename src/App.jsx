import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LOGO_URL = '/logo-cafeteria.svg';
const HERO_IMG_URL = '/hero-vibe-coding.jpg';
const ARCH_IMG_URL = '/architecture-cafeteria.jpg';

const INITIAL_TASKS = [
  { id: 't1', label: '1. Copiar y ajustar el Prompt Maestro 🧠' },
  { id: 't2', label: '2. Generar el prototipo en v0 o Bolt ⚡' },
  { id: 't3', label: '3. Inspeccionar botones con DevTools 🔍' },
  { id: 't4', label: '4. Conectar repositorio en GitHub 🐙' },
  { id: 't5', label: '5. Publicar en 1 clic en Vercel 🌐' },
  { id: 't6', label: '6. Abrir y testear desde el celular 📱' },
];

const ARCHITECTURE_PIECES = [
  {
    num: '01',
    emoji: '🧱',
    title: 'HTML',
    titleClass: 'text-text-primary',
    borderHover: 'hover:border-primary/50',
    desc: 'La obra bruta: muros, textos y botones del local.',
    snippet: '<h1>Cafetería Web Coder</h1>\n<button>☕ Pedir Café</button>',
    zone: 'Estructura Física (Piso Principal)',
  },
  {
    num: '02',
    emoji: '🎨',
    title: 'Tailwind',
    titleClass: 'text-amber-glow',
    borderHover: 'hover:border-amber-glow/50',
    desc: 'Diseño interior: colores, bordes y layout responsive.',
    snippet: 'className="bg-espresso-card border-amber-500/40 rounded-2xl p-6 shadow-xl"',
    zone: 'Iluminación Ámbar & Acabados',
  },
  {
    num: '03',
    emoji: '⚛️',
    title: 'React',
    titleClass: 'text-neon-cyan',
    borderHover: 'hover:border-neon-cyan/50',
    desc: 'El barista: lógica viva, componentes e interactividad.',
    snippet: 'const [cafes, setCafes] = useState(0);\nonClick={() => setCafes(c => c + 1)}',
    zone: 'Barra Interactiva del Barista IA',
  },
  {
    num: '04',
    emoji: '💾',
    title: 'Storage',
    titleClass: 'text-neon-emerald',
    borderHover: 'hover:border-neon-emerald/50',
    desc: 'Memoria persistente: no se borra al recargar la página.',
    snippet: 'localStorage.setItem("vibe_coffee_count", cafes);',
    zone: 'Bóveda Subterránea Esmeralda',
  },
  {
    num: '05',
    emoji: '🐙',
    title: 'GitHub',
    titleClass: 'text-neon-violet',
    borderHover: 'hover:border-neon-violet/50',
    desc: 'Bóveda de planos con historial y máquina del tiempo.',
    snippet: 'git commit -m "feat: mostrador interactivo"\ngit push origin main',
    zone: 'Archivo Violeta de Ramas y Versiones',
  },
  {
    num: '06',
    emoji: '🌐',
    title: 'Vercel',
    titleClass: 'text-primary',
    borderHover: 'hover:border-primary/50',
    desc: 'Local en la avenida: hosting global y link público 24/7.',
    snippet: 'https://cafeteria-web-coder.vercel.app — Online 24/7 ⚡',
    zone: 'Terraza Conectada a la Nube Global',
  },
];

const MASTER_PROMPT = `Actúa como diseñador UI/UX y desarrollador experto en React y Tailwind CSS. Crea una web app interactiva y minimalista llamada "Cafetería Web Coder".
Usa la metáfora de una cafetería para explicar:
- HTML como la estructura física del local 🧱
- Tailwind CSS como los acabados y diseño interior 🎨
- React como el barista y la memoria de pedidos en vivo ☕
- LocalStorage para que los cafés servidos persistan al recargar 💾
Incluye un mostrador interactivo para pedir café, un checklist de deploy en Vercel y estética dark moderna con acentos ámbar #F59E0B.`;

export default function App() {
  const appRef = useRef(null);
  const heroCardRef = useRef(null);
  const heroImgRef = useRef(null);
  const cupRef = useRef(null);
  const counterBadgeRef = useRef(null);
  const navCounterRef = useRef(null);
  const feedbackRef = useRef(null);
  const inspectorRef = useRef(null);
  const progressBarRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  const [count, setCount] = useState(() => {
    try {
      const stored = localStorage.getItem('vibe_coffee_count');
      return stored !== null ? parseInt(stored, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [selectedPiece, setSelectedPiece] = useState(null);

  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vibe_tasks') || '{}');
    } catch {
      return {};
    }
  });

  const [copied, setCopied] = useState(false);

  const completedTasks = INITIAL_TASKS.filter((t) => tasks[t.id]).length;
  const progressPct = Math.round((completedTasks / INITIAL_TASKS.length) * 100);

  useEffect(() => {
    try {
      localStorage.setItem('vibe_coffee_count', String(count));
    } catch {}
  }, [count]);

  useEffect(() => {
    try {
      localStorage.setItem('vibe_tasks', JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  // Core GSAP Setup: Entrances, ScrollTriggers & Accessibility (gsap.matchMedia)
  useGSAP(
    () => {
      gsap.defaults({ ease: 'power2.out', duration: 0.65 });

      const mm = gsap.matchMedia();

      mm.add(
        {
          isMotionAllowed: '(prefers-reduced-motion: no-preference)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { reduceMotion } = context.conditions;

          if (reduceMotion) {
            gsap.set(
              [
                '.gsap-hero-badge',
                '.gsap-hero-word',
                '.gsap-hero-highlight',
                '.gsap-hero-rocket',
                '.gsap-hero-sub',
                '.gsap-hero-ctas',
                '.gsap-hero-visual',
                '.gsap-paradigm-card',
                '.gsap-trio-card',
                '.gsap-arch-visual',
                '.gsap-piece-card',
                '.gsap-mostrador-panel',
                '.gsap-checklist-box',
              ],
              { autoAlpha: 1, y: 0, yPercent: 0, scale: 1, rotationX: 0 }
            );
            gsap.set('.gsap-hero-underline', { scaleX: 1, autoAlpha: 1 });
            return;
          }

          // 1. Hero Text & Visual Entrance Sequence
          const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
          heroTl
            .from('.gsap-hero-badge', {
              y: -14,
              scale: 0.94,
              autoAlpha: 0,
              duration: 0.5,
              ease: 'back.out(1.7)',
            })
            .from(
              '.gsap-hero-word',
              {
                yPercent: 115,
                rotationX: -35,
                autoAlpha: 0,
                duration: 0.65,
                stagger: 0.07,
                transformOrigin: '50% 100%',
              },
              '-=0.25'
            )
            .from(
              '.gsap-hero-highlight',
              {
                yPercent: 110,
                scale: 0.92,
                autoAlpha: 0,
                duration: 0.7,
                ease: 'back.out(1.6)',
              },
              '-=0.28'
            )
            .fromTo(
              '.gsap-hero-underline',
              { scaleX: 0, autoAlpha: 0 },
              {
                scaleX: 1,
                autoAlpha: 1,
                duration: 0.6,
                ease: 'expo.out',
                transformOrigin: 'left center',
              },
              '-=0.4'
            )
            .from(
              '.gsap-hero-rocket',
              {
                x: -14,
                y: 16,
                scale: 0.4,
                rotation: -25,
                autoAlpha: 0,
                duration: 0.65,
                ease: 'elastic.out(1, 0.5)',
              },
              '-=0.45'
            )
            .from(
              ['.gsap-hero-sub', '.gsap-hero-ctas'],
              {
                y: 18,
                autoAlpha: 0,
                duration: 0.6,
                stagger: 0.12,
              },
              '-=0.35'
            )
            .from(
              '.gsap-hero-visual',
              {
                y: 32,
                scale: 0.97,
                autoAlpha: 0,
                duration: 0.85,
              },
              '-=0.4'
            );

          // Subtle ambient float on the Hero rocket icon
          gsap.to('.gsap-hero-rocket', {
            y: -5,
            rotation: '6_short',
            duration: 1.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1.2,
          });

          // 2. Section 1: El Paradigma
          gsap.from('.gsap-paradigm-card', {
            scrollTrigger: {
              trigger: '#paradigma',
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
            y: 28,
            autoAlpha: 0,
            duration: 0.65,
            stagger: 0.14,
          });

          // 3. Section 2: El Trío Dinámico
          gsap.from('.gsap-trio-card', {
            scrollTrigger: {
              trigger: '#trio',
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
            y: 26,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.12,
          });

          // 4. Section 3: Arquitectura Visual & 6 Piezas
          gsap.from('.gsap-arch-visual', {
            scrollTrigger: {
              trigger: '#arquitectura',
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            y: 28,
            scale: 0.98,
            autoAlpha: 0,
            duration: 0.75,
          });

          gsap.from('.gsap-piece-card', {
            scrollTrigger: {
              trigger: '.gsap-pieces-grid',
              start: 'top 86%',
              toggleActions: 'play none none none',
            },
            y: 20,
            autoAlpha: 0,
            duration: 0.5,
            stagger: 0.07,
          });

          // 5. Section 4: Mostrador Interactivo
          gsap.from('.gsap-mostrador-panel', {
            scrollTrigger: {
              trigger: '#mostrador',
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
            y: 28,
            autoAlpha: 0,
            duration: 0.65,
            stagger: 0.15,
          });

          // 6. Section 5: Checklist
          gsap.from('.gsap-checklist-box', {
            scrollTrigger: {
              trigger: '#checklist',
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            y: 24,
            autoAlpha: 0,
            duration: 0.65,
          });
        }
      );

      return () => mm.revert();
    },
    { scope: appRef }
  );

  // Animate progress bar smoothly with GSAP scaleX (transform alias instead of layout width)
  useGSAP(
    () => {
      if (!progressBarRef.current) return;
      gsap.to(progressBarRef.current, {
        scaleX: progressPct / 100,
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    },
    { dependencies: [progressPct], scope: appRef }
  );

  // Animate Architecture Inspector panel when a piece is selected
  useGSAP(
    () => {
      if (!selectedPiece || !inspectorRef.current) return;
      gsap.fromTo(
        inspectorRef.current,
        { y: -10, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out', overwrite: 'auto' }
      );
    },
    { dependencies: [selectedPiece], scope: appRef }
  );

  // Subtle Hero parallax on mouse move (desktop only, transform aliases x/y)
  const handleHeroMouseMove = (e) => {
    if (!heroCardRef.current || !heroImgRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = heroCardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(heroImgRef.current, {
      x: relX * -14,
      y: relY * -10,
      scale: 1.03,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleHeroMouseLeave = () => {
    if (!heroImgRef.current) return;
    gsap.to(heroImgRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  // Interactive Coffee Order with GSAP elastic/back micro-interactions
  const orderCoffee = () => {
    setCount((prev) => prev + 1);

    if (cupRef.current) {
      gsap.fromTo(
        cupRef.current,
        { scale: 0.85, rotation: -12 },
        {
          scale: 1,
          rotation: '0_short',
          duration: 0.55,
          ease: 'back.out(2.2)',
          overwrite: true,
        }
      );
    }

    if (counterBadgeRef.current) {
      gsap.fromTo(
        counterBadgeRef.current,
        { scale: 1.2 },
        { scale: 1, duration: 0.4, ease: 'back.out(2)', overwrite: true }
      );
    }

    if (navCounterRef.current) {
      gsap.fromTo(
        navCounterRef.current,
        { scale: 1.08 },
        { scale: 1, duration: 0.35, ease: 'power2.out', overwrite: true }
      );
    }

    if (feedbackRef.current) {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      gsap.killTweensOf(feedbackRef.current);
      gsap.fromTo(
        feedbackRef.current,
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.28, ease: 'power2.out' }
      );
      feedbackTimeoutRef.current = setTimeout(() => {
        if (feedbackRef.current) {
          gsap.to(feedbackRef.current, {
            autoAlpha: 0,
            y: -4,
            duration: 0.35,
            ease: 'power2.in',
          });
        }
      }, 1500);
    }

    confetti({
      particleCount: 28,
      spread: 55,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#fbbf24', '#ffc174', '#10B981'],
    });
  };

  const resetCoffee = () => {
    setCount(0);
    try {
      localStorage.removeItem('vibe_coffee_count');
    } catch {}
    if (cupRef.current) {
      gsap.fromTo(
        cupRef.current,
        { rotation: 15, scale: 0.9 },
        { rotation: '0_short', scale: 1, duration: 0.4, ease: 'power2.out', overwrite: true }
      );
    }
  };

  const toggleTask = (id, e) => {
    const labelEl = e?.currentTarget?.closest('label');
    if (labelEl) {
      gsap.fromTo(
        labelEl,
        { scale: 0.98 },
        { scale: 1, duration: 0.3, ease: 'back.out(2)', overwrite: 'auto' }
      );
    }

    setTasks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      const doneCount = INITIAL_TASKS.filter((t) => next[t.id]).length;
      if (doneCount === INITIAL_TASKS.length) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      return next;
    });
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(MASTER_PROMPT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      ref={appRef}
      className="bg-background text-on-surface font-sans antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen"
    >
      {/* ==========================================
             HEADER MINIMALISTA
        =========================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-xl border-b border-surface-container-high/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a className="flex items-center gap-3 group" href="#">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-espresso-card border border-primary-container/30 shadow-md shadow-primary-container/10 group-hover:scale-105 group-hover:border-primary-container/60 transition-all">
              <img
                src={LOGO_URL}
                alt="Cafetería Web Coder Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-text-primary tracking-tight group-hover:text-primary transition-colors">
                Cafetería Web Coder
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-container-high text-primary-container border border-primary-container/20">
                v2.4
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm text-text-muted font-medium">
            <a className="hover:text-text-primary transition-colors" href="#paradigma">
              Paradigma
            </a>
            <a className="hover:text-text-primary transition-colors" href="#trio">
              El Trío
            </a>
            <a className="hover:text-text-primary transition-colors" href="#arquitectura">
              Arquitectura
            </a>
            <a className="hover:text-text-primary transition-colors" href="#mostrador">
              Mostrador
            </a>
            <a className="hover:text-text-primary transition-colors" href="#checklist">
              Deploy 🚀
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              ref={navCounterRef}
              href="#mostrador"
              title="Ir al Mostrador Interactivo"
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest border border-surface-container-high/60 hover:border-primary-container/40 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-neon-emerald animate-pulse"></span>
              <span className="font-mono text-xs text-primary" id="nav-coffee-counter">
                ☕ {count} {count === 1 ? 'café' : 'cafés'}
              </span>
            </a>
            <a
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-semibold text-xs hover:brightness-110 active:scale-95 transition-all shadow-sm shadow-primary-container/20"
              href="#checklist"
            >
              <span>Prompt Maestro</span>
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
            </a>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 max-w-6xl mx-auto px-6 space-y-28">
        {/* ==========================================
               HERO MINIMALISTA & VISUAL
          =========================================== */}
        <section className="pt-6 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="gsap-hero-badge inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-espresso-card border border-primary-container/20 text-xs font-mono text-primary">
              <span>⚡ Hackathon Ready</span>
              <span className="text-surface-container-highest">•</span>
              <span>Aprende creando sin memorizar código</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-text-primary tracking-tight leading-tight flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
              {['De', '"Hola', 'Mundo"', 'a', 'tu'].map((word, idx) => (
                <span key={idx} className="inline-block overflow-hidden py-1">
                  <span className="gsap-hero-word inline-block will-change-transform">
                    {word}
                  </span>
                </span>
              ))}
              <span className="relative inline-block py-1">
                <span className="overflow-hidden inline-block align-bottom">
                  <span className="gsap-hero-highlight inline-block bg-gradient-to-r from-primary via-amber-glow to-primary-container bg-clip-text text-transparent will-change-transform">
                    Deploy con IA
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="gsap-hero-underline absolute left-0 right-0 bottom-0.5 h-[3px] rounded-full bg-gradient-to-r from-primary-container via-amber-glow to-neon-emerald origin-left"
                />
              </span>
              <span className="gsap-hero-rocket inline-block select-none will-change-transform">
                🚀
              </span>
            </h1>

            <p className="gsap-hero-sub text-base sm:text-lg text-text-muted leading-relaxed max-w-2xl mx-auto">
              Tú eres el <strong className="text-text-primary font-semibold">Director y Arquitecto</strong> ☕. La Inteligencia Artificial es tu constructora veloz.
            </p>

            <div className="gsap-hero-ctas flex items-center justify-center gap-3 pt-2">
              <a
                className="px-5 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-semibold text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary-container/10"
                href="#mostrador"
              >
                <span>Probar Mostrador</span>
                <span>☕</span>
              </a>
              <a
                className="px-5 py-2.5 rounded-lg bg-espresso-card hover:bg-surface-container-high border border-surface-container-high text-on-surface font-semibold text-sm transition-all flex items-center gap-2"
                href="#arquitectura"
              >
                <span>Ver Arquitectura</span>
                <span>🧱</span>
              </a>
            </div>
          </div>

          {/* Imagen Conceptual Destacada con Parallax Suave GSAP */}
          <div
            ref={heroCardRef}
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={handleHeroMouseLeave}
            className="gsap-hero-visual relative rounded-2xl overflow-hidden border border-surface-container-high/60 bg-espresso-card shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10 pointer-events-none"></div>
            <img
              ref={heroImgRef}
              alt="AI Copilot & Web Architecture Environment"
              className="w-full aspect-[16/9] object-cover will-change-transform"
              src={HERO_IMG_URL}
            />
            <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-background/85 backdrop-blur-md border border-surface-container-high/60 text-xs font-mono">
              <div className="flex items-center gap-2 text-text-primary">
                <span className="w-2 h-2 rounded-full bg-neon-emerald animate-pulse"></span>
                <span>Entorno Vibe Coding Activo: Terminal + Agente IA + Servidor</span>
              </div>
              <span className="text-primary">Latencia: 12ms • Modelo: Optimizado</span>
            </div>
          </div>
        </section>

        {/* ==========================================
               SECCIÓN 1: EL PARADIGMA
          =========================================== */}
        <section className="space-y-6 scroll-mt-24" id="paradigma">
          <div className="space-y-1">
            <span className="text-xs font-mono text-primary uppercase tracking-wider font-semibold">
              El Cambio de Mentalidad
            </span>
            <h2 className="text-2xl font-bold text-text-primary">
              El Paradigma: Tradicional vs Vibe Coding ⚡
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tarjeta Tradicional */}
            <div className="gsap-paradigm-card p-6 rounded-xl bg-espresso-card/60 border border-surface-container-high/40 space-y-3 hover:border-surface-container-highest transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🧱</span>
                <span className="text-xs font-mono text-text-muted px-2 py-0.5 rounded bg-surface-container-lowest">
                  Ayer
                </span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">El Albañil de Código</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Meses memorizando sintaxis estricta y buscando puntos y coma faltantes. El deploy se postergaba al final con alto riesgo de fallo.
              </p>
              <div className="text-xs font-mono text-text-muted pt-2 border-t border-surface-container-high/30 flex items-center gap-1.5">
                <span className="text-amber-glow">⚠️</span> Fricción manual y frustración en consola.
              </div>
            </div>

            {/* Tarjeta Vibe Coding */}
            <div className="gsap-paradigm-card p-6 rounded-xl bg-espresso-card border border-primary-container/40 space-y-3 relative overflow-hidden shadow-lg shadow-primary-container/5">
              <div className="absolute -right-12 -top-12 w-28 h-28 bg-primary-container/10 rounded-full blur-2xl"></div>
              <div className="flex items-center justify-between">
                <span className="text-2xl">⚡</span>
                <span className="text-xs font-mono text-primary font-bold px-2 py-0.5 rounded bg-primary-container/20 border border-primary-container/30">
                  Hoy
                </span>
              </div>
              <h3 className="text-lg font-bold text-text-primary">El Arquitecto y Director</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Diseñas el concepto, orientas al agente con prompts estructurados y publicas prototipos funcionales desde la primera hora.
              </p>
              <div className="text-xs font-mono text-neon-emerald pt-2 border-t border-surface-container-high/30 flex items-center gap-1.5">
                <span>✨</span> 10x velocidad creativa y foco en el producto real.
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
               SECCIÓN 2: EL TRÍO DINÁMICO
          =========================================== */}
        <section className="space-y-6 scroll-mt-24" id="trio">
          <div className="space-y-1">
            <span className="text-xs font-mono text-primary uppercase tracking-wider font-semibold">
              Roles Claros
            </span>
            <h2 className="text-2xl font-bold text-text-primary">El Trío Dinámico de Trabajo</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tú */}
            <div className="gsap-trio-card p-5 rounded-xl bg-espresso-card border border-surface-container-high/50 hover:border-primary/40 transition-colors space-y-3">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-lg">
                👤
              </div>
              <h3 className="text-base font-bold text-text-primary">Tú (Director del Producto)</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Define el qué, el para quién y la experiencia del usuario. Tú tomas las decisiones y validas el resultado.
              </p>
            </div>

            {/* Agente IA */}
            <div className="gsap-trio-card p-5 rounded-xl bg-espresso-card border border-surface-container-high/50 hover:border-neon-cyan/40 transition-colors space-y-3">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-lg">
                🤖
              </div>
              <h3 className="text-base font-bold text-text-primary">Agente IA (Constructor Veloz)</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Herramientas como v0, Bolt o Claude que transforman tus especificaciones en código React y Tailwind al instante.
              </p>
            </div>

            {/* DevTools */}
            <div className="gsap-trio-card p-5 rounded-xl bg-espresso-card border border-surface-container-high/50 hover:border-neon-emerald/40 transition-colors space-y-3">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-lg">
                🔍
              </div>
              <h3 className="text-base font-bold text-text-primary">Chrome DevTools (Auditoría)</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Tu panel de inspección en vivo (F12) para validar el DOM, depurar estilos y ver los errores reales en pantalla.
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================
               SECCIÓN 3: ARQUITECTURA VISUAL & 6 PIEZAS
          =========================================== */}
        <section className="space-y-6 scroll-mt-24" id="arquitectura">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div className="space-y-1">
              <span className="text-xs font-mono text-primary uppercase tracking-wider font-semibold">
                Anatomía Integral
              </span>
              <h2 className="text-2xl font-bold text-text-primary">
                Arquitectura Visual de la Cafetería ☕
              </h2>
            </div>
            <span className="text-xs font-mono text-text-muted">
              💡 Haz clic en cualquier pieza para inspeccionar su código
            </span>
          </div>

          {/* Diagrama Isométrico de la Cafetería */}
          <div className="gsap-arch-visual relative rounded-2xl overflow-hidden border border-surface-container-high/60 bg-espresso-card shadow-xl group">
            <img
              alt="AI Web Architecture and Vibe Coding Metaphor"
              className="w-full aspect-[16/9] object-cover group-hover:scale-[1.01] transition-transform duration-700"
              src={ARCH_IMG_URL}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent p-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-text-primary flex items-center gap-2">
                <span className="text-primary">⚡ Corte Isométrico:</span>
                Planta Principal (Frontend UI) + Subsuelo (Storage & Git) + Terraza Cloud (Vercel)
              </span>
              <span className="text-text-muted">6 capas sincronizadas</span>
            </div>
          </div>

          {/* Las 6 Piezas en Micro-Tarjetas Interactivas */}
          <div className="gsap-pieces-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {ARCHITECTURE_PIECES.map((piece) => {
              const isSelected = selectedPiece?.num === piece.num;
              return (
                <button
                  key={piece.num}
                  type="button"
                  onClick={() => setSelectedPiece(isSelected ? null : piece)}
                  className={`gsap-piece-card p-3.5 rounded-xl bg-espresso-card border text-left transition-colors cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'border-primary-container ring-1 ring-primary-container/50'
                      : `border-surface-container-high/50 ${piece.borderHover}`
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                    <span>{piece.num}</span>
                    <span>{piece.emoji}</span>
                  </div>
                  <h4 className={`font-bold text-sm ${piece.titleClass}`}>{piece.title}</h4>
                  <p className="text-xs text-text-muted leading-snug">{piece.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Inspector de Pieza Seleccionada animado con GSAP */}
          {selectedPiece && (
            <div
              ref={inspectorRef}
              className="p-4 rounded-xl bg-surface-container-lowest border border-primary-container/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span>{selectedPiece.emoji}</span>
                  <span className={`font-bold ${selectedPiece.titleClass}`}>
                    {selectedPiece.num}. {selectedPiece.title}
                  </span>
                  <span className="text-text-muted">• {selectedPiece.zone}</span>
                </div>
                <pre className="text-on-surface-variant overflow-x-auto pt-1">
                  {selectedPiece.snippet}
                </pre>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPiece(null)}
                className="self-end sm:self-center px-2.5 py-1 rounded bg-surface-container-high text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>
          )}
        </section>

        {/* ==========================================
               SECCIÓN 4: MOSTRADOR INTERACTIVO
          =========================================== */}
        <section className="space-y-6 scroll-mt-24" id="mostrador">
          <div className="space-y-1">
            <span className="text-xs font-mono text-primary uppercase tracking-wider font-semibold">
              Laboratorio Práctico
            </span>
            <h2 className="text-2xl font-bold text-text-primary">El Mostrador Interactivo</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Sandbox Interactivo (Col 5) */}
            <div className="gsap-mostrador-panel lg:col-span-5 p-6 rounded-2xl bg-espresso-card border border-surface-container-high/60 flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                <span>PREVIEW // Local 01</span>
                <span className="text-neon-emerald flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-neon-emerald animate-pulse"></span>
                  En Vivo
                </span>
              </div>

              <div className="py-8 px-6 rounded-xl bg-surface-container-lowest border border-surface-container-high/40 text-center space-y-4">
                <div
                  ref={cupRef}
                  className="text-5xl select-none inline-block will-change-transform"
                  id="cup-icon"
                >
                  ☕
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-text-primary">
                    ¡Bienvenido al Mostrador!
                  </h3>
                  <p className="text-xs text-text-muted">Cada clic actualiza el estado reactivo.</p>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high font-mono text-xs">
                  <span className="text-text-muted">Cafés servidos:</span>
                  <span
                    ref={counterBadgeRef}
                    className="text-primary font-bold text-sm inline-block"
                    id="coffee-count-display"
                  >
                    {count}
                  </span>
                </div>

                <button
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-container to-amber-deep text-on-primary-container font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 cursor-pointer"
                  onClick={orderCoffee}
                  type="button"
                >
                  <span>☕ Pedir Café</span>
                </button>

                <p
                  ref={feedbackRef}
                  className="text-xs font-mono text-neon-emerald invisible"
                  id="order-feedback"
                >
                  ✨ ¡Café servido! Estado persistido en LocalStorage.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-text-muted pt-2 border-t border-surface-container-high/30">
                <span>
                  📦 useState: <span className="text-primary font-bold" id="state-val">{count}</span>
                </span>
                <button
                  className="hover:text-amber-glow transition-colors cursor-pointer"
                  onClick={resetCoffee}
                  type="button"
                >
                  Resetear
                </button>
              </div>
            </div>

            {/* Bloque de Código Esencial (Col 7) */}
            <div className="gsap-mostrador-panel lg:col-span-7 p-6 rounded-2xl bg-espresso-card border border-surface-container-high/60 flex flex-col justify-between space-y-4 font-mono">
              <div className="flex items-center justify-between text-xs text-text-muted pb-2 border-b border-surface-container-high/40">
                <span className="text-primary font-semibold">Anatomía del Componente</span>
                <span>App.jsx</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-high/40 text-xs leading-relaxed overflow-x-auto space-y-2 text-on-surface-variant">
                <div className="text-text-muted">// ⚛️ React: El Barista recuerda la cuenta (valor actual: {count})</div>
                <div className="text-neon-cyan">const [cafes, setCafes] = useState({count});</div>
                <div className="text-text-muted pt-2">
                  // 🧱 HTML + 🎨 Tailwind: El Mueble y los Estilos
                </div>
                <div className="text-on-surface">
                  &lt;<span className="text-primary font-bold">button</span>{' '}
                  <span className="text-amber-glow">onClick</span>=&#123;() =&gt; setCafes(cafes + 1)&#125;
                  <br />
                  &nbsp;&nbsp;<span className="text-amber-glow">className</span>="
                  <span className="text-amber-deep">bg-amber-500 rounded-xl px-4 py-2 font-bold</span>"&gt;
                  <br />
                  &nbsp;&nbsp;☕ Pedir Café ({count})
                  <br />
                  &lt;/<span className="text-primary font-bold">button</span>&gt;
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-high/40 text-xs text-text-muted leading-relaxed flex items-start gap-2.5">
                <span className="text-base">💡</span>
                <span>
                  <strong className="text-text-primary">Conexión clave:</strong> HTML define el botón, Tailwind define su aspecto ámbar y React actualiza la cifra en tiempo real sin recargar la web.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
               SECCIÓN 5: CHECKLIST & PROMPT MAESTRO
          =========================================== */}
        <section className="space-y-6 scroll-mt-24" id="checklist">
          <div className="space-y-1">
            <span className="text-xs font-mono text-primary uppercase tracking-wider font-semibold">
              Ruta a Producción
            </span>
            <h2 className="text-2xl font-bold text-text-primary">Checklist de Deploy 🚀</h2>
          </div>

          <div className="gsap-checklist-box p-6 rounded-2xl bg-espresso-card border border-surface-container-high/60 space-y-6">
            {/* Progress Bar (animada con transform scaleX de GSAP) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-text-muted">Progreso hacia tu URL .vercel.app</span>
                <span className="text-primary font-bold text-sm" id="progress-text">
                  {progressPct}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-lowest overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="h-full w-full bg-gradient-to-r from-primary to-neon-emerald origin-left"
                  id="progress-bar"
                  style={{ transform: 'scaleX(0)' }}
                ></div>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="task-list">
              {INITIAL_TASKS.map((task) => {
                const isChecked = Boolean(tasks[task.id]);
                return (
                  <label
                    key={task.id}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-primary-container/10 border-primary-container/40 text-text-primary'
                        : 'bg-surface-container-lowest border-surface-container-high/40 hover:border-primary-container/40 text-on-surface'
                    }`}
                  >
                    <input
                      checked={isChecked}
                      className="w-4 h-4 rounded bg-espresso-card accent-primary cursor-pointer"
                      data-task={task.id}
                      onChange={(e) => toggleTask(task.id, e)}
                      type="checkbox"
                    />
                    <span className={`text-xs ${isChecked ? 'line-through text-text-muted' : ''}`}>
                      {task.label}
                    </span>
                  </label>
                );
              })}
            </div>

            {progressPct === 100 && (
              <div className="p-3.5 rounded-xl bg-neon-emerald/10 border border-neon-emerald/40 text-xs font-mono text-neon-emerald flex items-center gap-2">
                <span>🎉</span>
                <span>¡Checklist completado! Tu Cafetería Web está lista para producción en Vercel.</span>
              </div>
            )}

            {/* Prompt Maestro Container */}
            <div className="pt-4 border-t border-surface-container-high/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-text-primary">
                    Prompt Maestro de la Sesión
                  </h3>
                  <p className="text-xs text-text-muted">
                    Listo para pegar en v0.dev, Bolt.new o Claude.
                  </p>
                </div>

                <button
                  className="px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-semibold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  id="copy-btn"
                  onClick={copyPrompt}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]" id="copy-icon">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span id="copy-label">{copied ? '¡Copiado! ✨' : 'Copiar Prompt'}</span>
                </button>
              </div>

              <div
                className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-high/40 font-mono text-xs text-text-muted leading-relaxed max-h-36 overflow-y-auto whitespace-pre-line"
                id="prompt-box"
              >
                {MASTER_PROMPT}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==========================================
             FOOTER MINIMALISTA
        =========================================== */}
      <footer className="border-t border-surface-container-high/40 bg-espresso-surface/50 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted font-mono">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md overflow-hidden border border-primary-container/30">
              <img
                src={LOGO_URL}
                alt="Cafetería Web Coder Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span>Cafetería Web Coder • Hackathon Session 1</span>
          </div>
          <div>Desarrollado con mentalidad Vibe Coding ⚡</div>
        </div>
      </footer>
    </div>
  );
}
