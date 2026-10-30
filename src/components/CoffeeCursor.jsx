import { useRef } from 'react';
import { gsap, useGSAP } from '../gsap';

// Solo con mouse y si el usuario no pidió movimiento reducido
const CURSOR_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const INTERACTIVE = 'a, button, [role="button"], [role="tab"], summary, label';
const TEXT_FIELD = 'input, textarea, select, [contenteditable="true"]';
const CUP_OFFSET = { x: 24, y: 26 };
const DROPS = 7;
const DRIPS = 10;

// El puntero es un grano de café (preciso) y una tacita lo acompaña:
// el café se mueve dentro de la taza y, si vas rápido, se derrama.
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
        const coffee = el.querySelector('.cc-coffee');
        const crema = el.querySelector('.cc-crema');
        const ripple = el.querySelector('.cc-ripple');
        const drops = gsap.utils.toArray('.cc-drop', el);
        const drips = gsap.utils.toArray('.cc-drip', el);
        const { random, clamp } = gsap.utils;

        html.classList.add('coffee-cursor');
        gsap.set(el, { autoAlpha: 0 });

        const beanX = gsap.quickSetter(beanPos, 'x', 'px');
        const beanY = gsap.quickSetter(beanPos, 'y', 'px');
        const cupX = gsap.quickTo(cupPos, 'x', { duration: 0.45, ease: 'power3.out' });
        const cupY = gsap.quickTo(cupPos, 'y', { duration: 0.45, ease: 'power3.out' });
        const tilt = gsap.quickSetter(cupPos, 'rotation', 'deg');
        // El líquido se queda atrás al moverse y rebota al frenar
        const slosh = { ease: 'elastic.out(1, 0.32)', duration: 1.1 };
        const coffeeX = gsap.quickTo(coffee, 'x', slosh);
        const coffeeY = gsap.quickTo(coffee, 'y', slosh);
        const cremaX = gsap.quickTo(crema, 'x', slosh);
        const cremaY = gsap.quickTo(crema, 'y', slosh);

        const pointer = { x: 0, y: 0 };
        let moved = false;
        let visible = false;
        let hovering = false;
        let overField = false;
        let prev = { x: 0, y: 0 };
        let lastDrip = 0;
        let dripIndex = 0;

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

        // Una gotita sale por el borde opuesto al movimiento y cae
        const drip = (x, y, dx, dy) => {
          const d = drips[dripIndex++ % drips.length];
          const sx = x + dx * 13;
          const sy = y + dy * 13;
          gsap.fromTo(
            d,
            { x: sx, y: sy, scale: random(0.7, 1.1), autoAlpha: 0.95 },
            {
              x: sx + dx * random(6, 16),
              y: sy + random(34, 60),
              scale: 0.35,
              autoAlpha: 0,
              duration: random(0.55, 0.8),
              ease: 'power2.in',
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

        // La taza se inclina según cuánto se queda atrás; el café se mueve adentro
        const tick = () => {
          if (!visible) return;
          const cx = gsap.getProperty(cupPos, 'x');
          const cy = gsap.getProperty(cupPos, 'y');
          const vx = cx - prev.x;
          const vy = cy - prev.y;
          prev = { x: cx, y: cy };
          tilt(clamp(-24, 24, (pointer.x + CUP_OFFSET.x - cx) * 0.45));

          const ox = clamp(-3.2, 3.2, -vx * 0.45);
          const oy = clamp(-3.2, 3.2, -vy * 0.45);
          coffeeX(ox);
          coffeeY(oy);
          cremaX(ox * 1.7);
          cremaY(oy * 1.7);

          const speed = Math.hypot(vx, vy);
          const now = performance.now();
          if (speed > 14 && now - lastDrip > 110) {
            lastDrip = now;
            drip(cx, cy, -vx / speed, -vy / speed);
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
      {Array.from({ length: DRIPS }, (_, i) => (
        <span key={`g${i}`} className="cc-drip" />
      ))}

      <div className="cc-cup-pos">
        <div className="cc-cup">
          <span className="cc-handle" />
          <span className="cc-rim">
            <span className="cc-coffee">
              <span className="cc-crema" />
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
