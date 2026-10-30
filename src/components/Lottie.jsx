import { useEffect, useRef } from 'react';

// Animación Lottie cargada bajo demanda: el reproductor y el JSON llegan en archivos aparte.
// `load` devuelve el import dinámico del JSON; `playerRef` expone la animación para controlarla.
export default function Lottie({ load, className, loop = true, autoplay = true, speed = 1, playerRef }) {
  const box = useRef(null);

  useEffect(() => {
    let anim = null;
    let cancelled = false;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    Promise.all([import('lottie-web/build/player/lottie_light'), load()])
      .then(([{ default: lottie }, { default: animationData }]) => {
        if (cancelled || !box.current) return;
        anim = lottie.loadAnimation({
          container: box.current,
          renderer: 'svg',
          loop,
          autoplay: autoplay && !reduce,
          animationData,
          rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
        });
        anim.setSpeed(speed);
        if (playerRef) playerRef.current = anim;
      })
      .catch(() => {
        // Sin la animación la página sigue igual
      });

    return () => {
      cancelled = true;
      anim?.destroy();
      if (playerRef) playerRef.current = null;
    };
    // La animación se crea una sola vez al montar; las opciones no cambian después
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={box} className={className} aria-hidden="true" />;
}
