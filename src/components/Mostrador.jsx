import { useEffect, useRef, useState } from 'react';
import { Code2, Coffee, ScanEye } from 'lucide-react';
import { LAYERS } from '../data';
import { DECOR } from '../decor';
import { Decor, Wave } from './Ambient';
import Lottie from './Lottie';
import SectionHead from './SectionHead';

export default function Mostrador({ count, isBrewing, onOrder }) {
  const [layer, setLayer] = useState(null);
  const active = LAYERS.find((l) => l.id === layer);
  const cup = useRef(null);

  // Cada pedido vuelve a llenar la taza
  useEffect(() => {
    if (isBrewing) cup.current?.goToAndPlay(0, true);
  }, [isBrewing]);

  return (
    <section id="mostrador" className="section alt">
      <Wave position="top" />
      <Decor items={DECOR.mostrador} />
      <div className="container">
        <SectionHead
          num="03"
          kicker="El mostrador"
          title={
            <>
              Tu primer <em>«Hola mundo»</em>.
            </>
          }
          lead="Una app mínima con sus tres capas. Elige una para verla con rayos X."
        />

        <div className="demo">
          <div className={`demo-stage ${layer ? `xray-${layer}` : ''}`} data-reveal>
            <span className="demo-badge">
              <ScanEye size={14} /> {active ? `Rayos X: ${active.tech}` : 'Vista normal'}
            </span>

            <div className="demo-card">
              <div className="demo-cup" aria-hidden="true">
                <Lottie
                  className="demo-cup-anim"
                  load={() => import('../assets/lottie/cup-fill.json')}
                  loop={false}
                  autoplay={false}
                  speed={2.2}
                  playerRef={cup}
                />
              </div>
              <h3 className="demo-h1" data-html="<h1>" data-css="font-serif text-3xl">
                ¡Hola mundo! Bienvenido a mi cafetería
              </h3>
              <p className="demo-p" data-html="<p>" data-css="text-stone-600">
                Cafés servidos hoy:{' '}
                <span className="demo-count" data-react="{cafes}" aria-live="polite">
                  {count}
                </span>
              </p>
              <button
                type="button"
                className="demo-btn"
                data-html="<button>"
                data-css="bg-amber-700 rounded-full"
                data-react="onClick"
                onClick={onOrder}
              >
                <Coffee size={18} /> Pedir un café
              </button>
            </div>
          </div>

          <div className="layers">
            {LAYERS.map((l) => (
              <button
                key={l.id}
                type="button"
                className="layer"
                aria-pressed={layer === l.id}
                style={{ '--tone': `var(--${l.id})`, '--tone-soft': `var(--${l.id}-soft)` }}
                onClick={() => setLayer(layer === l.id ? null : l.id)}
                data-reveal
              >
                <span className="layer-top">
                  <span className="layer-tech">{l.tech}</span>
                  <span className="layer-hint">{layer === l.id ? 'Quitar rayos X' : 'Ver con rayos X'}</span>
                </span>
                <span className="layer-cafe">{l.cafe}</span>
                <span className="layer-line">{l.line}</span>
                {layer === l.id && <code className="layer-code">{l.code}</code>}
              </button>
            ))}

            <p className="demo-note" data-reveal>
              <Code2 size={20} />
              <span>
                <strong>¿Por qué «React (JavaScript)»?</strong> JavaScript es el idioma del navegador. React es
                una forma ordenada de usarlo: piezas reutilizables y pantallas que se actualizan solas.
              </span>
            </p>
          </div>
        </div>
      </div>
      <Wave position="bottom" />
    </section>
  );
}
