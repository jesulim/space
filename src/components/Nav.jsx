import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Cctv } from 'lucide-react';
import { gsap, useGSAP } from '../gsap';
import { NAV } from '../data';

const DESKTOP = '(min-width: 1180px)';
const num = (i) => String(i + 1).padStart(2, '0');

// La taza de la marca se llena con el progreso de lectura (.brand-liquid, animada desde App)
function CupMark() {
  const clip = useId();
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <clipPath id={clip}>
          <path d="M4 9h12v5.5A5.5 5.5 0 0 1 10.5 20h-1A5.5 5.5 0 0 1 4 14.5V9z" />
        </clipPath>
      </defs>
      <rect className="brand-liquid" x="4" y="9" width="12" height="11" clipPath={`url(#${clip})`} stroke="none" />
      <path d="M4 9h12v5.5A5.5 5.5 0 0 1 10.5 20h-1A5.5 5.5 0 0 1 4 14.5V9z" />
      <path d="M16 11h1.25a2.75 2.75 0 0 1 0 5.5H16" />
      <path className="brand-steam" d="M8.5 3.5v2.5M11.5 3.5v2.5" />
    </svg>
  );
}

function Ticket({ count }) {
  return (
    <span className="nav-ticket" title="Cafés servidos en esta cafetería web">
      Cafés
      <span className="nav-ticket-num" key={count}>
        {count}
      </span>
    </span>
  );
}

export default function Nav({ activeSection, count, devtoolsOpen, onToggleDevtools, onNavigate }) {
  const root = useRef(null);
  const indicator = useRef(null);
  const menuBtn = useRef(null);
  const menuTl = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Indicador que se desliza bajo el capítulo activo
  useLayoutEffect(() => {
    const el = indicator.current;
    const place = (animate) => {
      const link = root.current?.querySelector(`.nav-link[data-id="${activeSection}"]`);
      if (!link || !link.offsetWidth) {
        gsap.to(el, { autoAlpha: 0, duration: 0.2 });
        return;
      }
      const box = el.parentElement.getBoundingClientRect();
      const r = link.getBoundingClientRect();
      const target = { x: r.left - box.left, width: r.width };
      if (!animate || gsap.getProperty(el, 'autoAlpha') === 0) {
        gsap.set(el, target);
        gsap.to(el, { autoAlpha: 1, duration: 0.25 });
      } else {
        gsap.to(el, { ...target, duration: 0.55, ease: 'power3.out' });
      }
    };
    place(true);
    const onResize = () => place(false);
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeSection]);

  // Hoja del menú (móvil y tablet)
  useGSAP(
    () => {
      menuTl.current = gsap
        .timeline({ paused: true })
        .to('.menu-sheet', { autoAlpha: 1, duration: 0.3, ease: 'power2.out' })
        .from('.sheet-row', { y: 26, autoAlpha: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' }, 0.08)
        .from('.sheet-leader', { scaleX: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, 0.2)
        .from('.sheet-foot', { y: 16, autoAlpha: 0, duration: 0.4, ease: 'power3.out' }, '-=0.35');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) menuTl.current.timeScale(20);
    },
    { scope: root },
  );

  useEffect(() => {
    if (menuOpen) menuTl.current?.play();
    else menuTl.current?.reverse();
    document.documentElement.classList.toggle('menu-open', menuOpen);
    if (!menuOpen) return;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuBtn.current?.focus();
      }
    };
    const desktop = window.matchMedia(DESKTOP);
    const onDesktop = () => desktop.matches && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onDesktop);
    return () => {
      window.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [menuOpen]);

  const go = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    document.documentElement.classList.remove('menu-open');
    onNavigate(id);
  };

  return (
    <div ref={root}>
      <header className="nav">
        <div className="nav-shell">
          <a href="#inicio" className="brand" onClick={(e) => go(e, 'inicio')}>
            <span className="brand-cup" aria-hidden="true">
              <CupMark />
            </span>
            <span className="brand-word">
              Cafetería <em>Vibe Coder</em>
            </span>
          </a>

          <nav className="nav-links-wrap" aria-label="Capítulos">
            <span className="nav-indicator" ref={indicator} aria-hidden="true" />
            <ul className="nav-links">
              {NAV.map((n, i) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    data-id={n.id}
                    className={`nav-link ${activeSection === n.id ? 'is-active' : ''}`}
                    aria-current={activeSection === n.id ? 'location' : undefined}
                    onClick={(e) => go(e, n.id)}
                  >
                    <span className="nav-num">{num(i)}</span>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-actions">
            <Ticket count={count} />
            <button
              type="button"
              className={`nav-icon ${devtoolsOpen ? 'is-on' : ''}`}
              onClick={onToggleDevtools}
              aria-pressed={devtoolsOpen}
              aria-label="DevTools: las cámaras del local"
              title="DevTools · las cámaras del local"
            >
              <Cctv size={17} />
            </button>
            <button
              ref={menuBtn}
              type="button"
              className="nav-menu-btn"
              aria-expanded={menuOpen}
              aria-controls="menu-sheet"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="nav-menu-text">{menuOpen ? 'Cerrar' : 'Menú'}</span>
              <span className={`burger ${menuOpen ? 'is-open' : ''}`} aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="menu-sheet" id="menu-sheet" inert={!menuOpen}>
        <div className="sheet-inner">
          <span className="sheet-kicker">El menú de hoy</span>
          <ul className="sheet-list">
            {NAV.map((n, i) => (
              <li key={n.id} className="sheet-row">
                <a
                  href={`#${n.id}`}
                  className={`sheet-link ${activeSection === n.id ? 'is-active' : ''}`}
                  onClick={(e) => go(e, n.id)}
                >
                  <span className="sheet-num">{num(i)}</span>
                  <span className="sheet-label">{n.label}</span>
                  <span className="sheet-leader" aria-hidden="true" />
                  <span className="sheet-hint">{n.hint}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="sheet-foot">
            <Ticket count={count} />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setMenuOpen(false);
                onToggleDevtools();
              }}
            >
              <Cctv size={15} /> {devtoolsOpen ? 'Cerrar DevTools' : 'Abrir DevTools'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
