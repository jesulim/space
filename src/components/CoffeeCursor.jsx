import { useRef } from 'react';
import { gsap, useGSAP } from '../gsap';

// Solo con mouse y si el usuario no pidió movimiento reducido
const CURSOR_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const INTERACTIVE = 'a, button, [role="button"], [role="tab"], summary, label';
const TEXT_FIELD = 'input, textarea, select, [contenteditable="true"]';
const CUP_OFFSET = { x: 24, y: 26 };
const PUFFS = 14;
const DROPS = 7;

// El puntero es un grano de café (preciso) y una tacita lo acompaña soltando vapor.
export default function CoffeeCursor() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(CURSOR_QUERY, () => {
        const html = document.documentElement;
        const el = root.current;
        const beanPos = el.querySelector('.cc-bean-pos');
        const bean = el.querySelector('.cc-bean');
        const cupPos = el.querySelector('.cc-cup-pos');
        const cup = el.querySelector('.cc-cup');
        const ripple = el.querySelector('.cc-ripple');
        const puffs = gsap.utils.toArray('.cc-puff', el);
        const drops = gsap.utils.toArray('.cc-drop', el);
        const { random, clamp } = gsap.utils;

        html.classList.add('coffee-cursor');
        gsap.set(el, { autoAlpha: 0 });

        const beanX = gsap.quickSetter(beanPos, 'x', 'px');
        const beanY = gsap.quickSetter(beanPos, 'y', 'px');
        const cupX = gsap.quickTo(cupPos, 'x', { duration: 0.45, ease: 'power3.out' });
        const cupY = gsap.quickTo(cupPos, 'y', { duration: 0.45, ease: 'power3.out' });
        const tilt = gsap.quickSetter(cupPos, 'rotation', 'deg');

        const pointer = { x: 0, y: 0 };
        let moved = false;
        let visible = false;
        let hovering = false;
        let overField = false;
        let lastPuff = { x: 0, y: 0, t: 0 };
        let puffIndex = 0;

        const show = (on) => {
          if (on === visible) return;
          visible = on;
          gsap.to(el, { autoAlpha: on ? 1 : 0, duration: 0.25 });
        };

        const setHover = (on) => {
          if (on === hovering) return;
          hovering = on;
          el.classList.toggle('is-hover', on);
          gsap.to(cup, { scale: on ? 1.25 : 1, duration: 0.45, ease: on ? 'back.out(2.5)' : 'power3.out' });
          gsap.to(bean, { scale: on ? 1.3 : 1, duration: 0.3, ease: 'power2.out' });
        };

        const puff = (x, y) => {
          const p = puffs[puffIndex++ % puffs.length];
          const sx = x + random(-5, 5);
          gsap.fromTo(
            p,
            { x: sx, y, scale: 0.5, autoAlpha: 0.65 },
            {
              x: sx + random(-12, 12),
              y: y - random(28, 46),
              scale: random(1.4, 2.1),
              autoAlpha: 0,
              duration: random(0.9, 1.4),
              ease: 'power1.out',
              overwrite: true,
            },
          );
        };

        // Una gota que cae en el café: onda + salpicadura
        const splash = (x, y) => {
          gsap.fromTo(
            ripple,
            { x, y, scale: 0.2, autoAlpha: 0.75 },
            { scale: 2.6, autoAlpha: 0, duration: 0.65, ease: 'power2.out', overwrite: true },
          );
          drops.forEach((d, i) => {
            const angle = (i / drops.length) * Math.PI * 2 + random(-0.35, 0.35);
            const dist = random(16, 34);
            gsap.fromTo(
              d,
              { x, y, scale: random(0.8, 1.2), autoAlpha: 0.95 },
              {
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist + 8,
                scale: 0.2,
                autoAlpha: 0,
                duration: random(0.45, 0.7),
                ease: 'power2.out',
                overwrite: true,
              },
            );
          });
        };

        const onMove = (e) => {
          pointer.x = e.clientX;
          pointer.y = e.clientY;
          beanX(pointer.x);
          beanY(pointer.y);
          if (!moved) {
            moved = true;
            gsap.set(cupPos, { x: pointer.x + CUP_OFFSET.x, y: pointer.y + CUP_OFFSET.y });
          }
          cupX(pointer.x + CUP_OFFSET.x);
          cupY(pointer.y + CUP_OFFSET.y);
          if (!overField) show(true);
        };

        const onOver = (e) => {
          const t = e.target;
          if (!(t instanceof Element)) return;
          overField = !!t.closest(TEXT_FIELD);
          show(!overField && moved);
          setHover(!overField && !!t.closest(INTERACTIVE));
        };

        const onOut = (e) => {
          if (!e.relatedTarget) show(false);
        };

        const onDown = (e) => {
          if (overField) return;
          splash(e.clientX, e.clientY);
          const s = hovering ? 1.25 : 1;
          gsap.fromTo(cup, { scale: s * 0.75 }, { scale: s, duration: 0.55, ease: 'back.out(3)', overwrite: true });
          gsap.fromTo(bean, { scale: 0.7 }, { scale: hovering ? 1.3 : 1, duration: 0.4, ease: 'back.out(3)', overwrite: true });
        };

        // La taza se inclina según cuánto se queda atrás y suelta vapor al moverse
        const tick = () => {
          if (!visible) return;
          const cx = gsap.getProperty(cupPos, 'x');
          const cy = gsap.getProperty(cupPos, 'y');
          tilt(clamp(-24, 24, (pointer.x + CUP_OFFSET.x - cx) * 0.45));

          const now = performance.now();
          const travelled = Math.hypot(cx - lastPuff.x, cy - lastPuff.y);
          if ((travelled > 22 && now - lastPuff.t > 45) || (hovering && now - lastPuff.t > 170)) {
            lastPuff = { x: cx, y: cy, t: now };
            puff(cx, cy - 12);
          }
        };

        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerdown', onDown, { passive: true });
        document.addEventListener('pointerover', onOver);
        document.addEventListener('pointerout', onOut);
        gsap.ticker.add(tick);

        return () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerdown', onDown);
          document.removeEventListener('pointerover', onOver);
          document.removeEventListener('pointerout', onOut);
          gsap.ticker.remove(tick);
          html.classList.remove('coffee-cursor');
          el.classList.remove('is-hover');
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="cc" aria-hidden="true">
      {Array.from({ length: PUFFS }, (_, i) => (
        <span key={`p${i}`} className="cc-puff" />
      ))}

      <div className="cc-cup-pos">
        <div className="cc-cup">
          <span className="cc-handle" />
          <span className="cc-rim">
            <span className="cc-coffee">
              <span className="cc-art">♥</span>
            </span>
          </span>
        </div>
      </div>

      <span className="cc-ripple" />
      {Array.from({ length: DROPS }, (_, i) => (
        <span key={`d${i}`} className="cc-drop" />
      ))}

      <div className="cc-bean-pos">
        <svg className="cc-bean" viewBox="0 0 16 20">
          <g transform="rotate(-28 8 10)">
            <ellipse cx="8" cy="10" rx="5.4" ry="7.6" />
            <path d="M8 3.2c-2.2 3.2 2.2 7 0 13.6" />
          </g>
        </svg>
      </div>
    </div>
  );
}
