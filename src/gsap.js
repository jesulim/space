import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

// Animaciones solo si el usuario no pidió movimiento reducido
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

// La historia de las 6 piezas se fija (pin) solo en pantallas amplias.
// Debe coincidir con la media query de .ps-pin / .ps-list en App.css
export const PIN_QUERY =
  '(min-width: 960px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)';

// Alto que ocupa la barra flotante (debe coincidir con --nav-h en index.css)
export const NAV_OFFSET = 76;

export function scrollToId(id, offset = NAV_OFFSET) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.to(window, {
    scrollTo: { y: `#${id}`, offsetY: offset, autoKill: true },
    duration: reduce ? 0 : 1.1,
    ease: 'power3.inOut',
  });
}

export function scrollToY(y) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.to(window, { scrollTo: { y, autoKill: true }, duration: reduce ? 0 : 1, ease: 'power2.inOut' });
}

export { gsap, ScrollTrigger, useGSAP };
