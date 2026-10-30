import { useEffect, useRef } from 'react';

// Lienzo WebGL con los granos en 3D. three.js se carga aparte, después de la entrada
// de la portada y cuando el navegador está libre, para no retrasar nada.
export default function BeanCanvas() {
  const canvas = useRef(null);

  useEffect(() => {
    let field = null;
    let cancelled = false;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const start = () =>
      import('../three/beanField.js')
        .then(({ createBeanField }) => {
          if (cancelled || !canvas.current) return;
          field = createBeanField(canvas.current, { reduceMotion });
          canvas.current.classList.add('is-ready');
        })
        .catch(() => {
          // Sin WebGL: la página sigue igual, solo sin granos 3D
        });

    // Se arma cuando termina la entrada de la portada, para no competir con ella
    let idleHandle = 0;
    const delay = setTimeout(() => {
      if (window.requestIdleCallback) idleHandle = window.requestIdleCallback(start, { timeout: 1500 });
      else start();
    }, 2200);

    return () => {
      cancelled = true;
      clearTimeout(delay);
      if (idleHandle) window.cancelIdleCallback(idleHandle);
      field?.destroy();
    };
  }, []);

  return <canvas ref={canvas} className="bean-canvas" aria-hidden="true" />;
}
