import { useImperativeHandle, useRef, useState } from 'react';
import { Code2, Coffee, Equal } from 'lucide-react';
import { gsap, useGSAP, PIN_QUERY, scrollToId, scrollToY } from '../gsap';
import { PIECES, ZONES } from '../data';
import AnalogyRow from './AnalogyRow';
import BrowserMock from './BrowserMock';
import CafeScene from './CafeScene';

const zoneLabel = (id) => ZONES.find((z) => z.id === id).label;
const toneVars = (color) => ({ '--tone': `var(--${color})`, '--tone-soft': `var(--${color}-soft)` });

function Head() {
  return (
    <div>
      <span className="kicker">
        <span className="kicker-num">02</span> Las 6 piezas
      </span>
      <h2 className="title">
        De terreno vacío a <em>local abierto</em>.
      </h2>
    </div>
  );
}

// Escritorio: la sección se fija y el scroll avanza pieza por pieza (cafetería = web).
// Móvil o movimiento reducido: las mismas analogías como tarjetas una debajo de otra.
export default function PiecesStory({ count, onOrder, apiRef }) {
  const root = useRef(null);
  const tlRef = useRef(null);
  const stepRef = useRef(0);
  const [step, setStep] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(PIN_QUERY, () => {
        const cafe = gsap.utils.toArray('.ps-cafe-item');
        const web = gsap.utils.toArray('.ps-web-item');
        const last = cafe.length - 1;

        gsap.set([...cafe.slice(1), ...web.slice(1)], { autoAlpha: 0, yPercent: 35 });

        const tl = gsap.timeline({
          defaults: { duration: 0.4, ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: '.ps-pin',
            start: 'top top',
            end: () => `+=${window.innerHeight * last * 0.85}`,
            pin: true,
            scrub: 0.5,
            snap: { snapTo: 'labels', inertia: false, duration: { min: 0.2, max: 0.6 }, delay: 0.08, ease: 'power1.inOut' },
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const i = Math.min(last, Math.round(self.progress * tl.duration()));
              if (i !== stepRef.current) {
                stepRef.current = i;
                setStep(i);
              }
            },
          },
        });

        // Cada paso dura 1 unidad: la pieza i queda completa justo en el label p{i}
        tl.addLabel('p0', 0);
        for (let i = 1; i <= last; i++) {
          const t = i - 1 + 0.2;
          tl.to(cafe[i - 1], { autoAlpha: 0, yPercent: -35 }, t)
            .to(web[i - 1], { autoAlpha: 0, yPercent: -35 }, t + 0.06)
            .to('.ps-eq', { rotate: 180 * i, duration: 0.6 }, t + 0.1)
            .to(cafe[i], { autoAlpha: 1, yPercent: 0 }, t + 0.36)
            .to(web[i], { autoAlpha: 1, yPercent: 0 }, t + 0.4)
            .addLabel(`p${i}`, i);
        }
        tl.to({}, { duration: 0.25 });

        tlRef.current = tl;
        return () => {
          tlRef.current = null;
        };
      });
    },
    { scope: root },
  );

  const goTo = (i) => {
    const st = tlRef.current?.scrollTrigger;
    if (st) scrollToY(st.labelToScroll(`p${i}`));
    else scrollToId(`pieza-${PIECES[i].id}`, 88);
  };

  useImperativeHandle(apiRef, () => ({ goTo }), []);

  return (
    <section id="piezas" ref={root} className="pieces">
      {/* Escritorio: historia fijada */}
      <div className="ps-pin">
        <div className="container ps-inner">
          <header className="ps-head">
            <Head />
            <div className="ps-ticks">
              {ZONES.map((zone) => (
                <div className="ps-zone" key={zone.id}>
                  <span className="ps-zone-label">{zone.label}</span>
                  <div className="ps-zone-ticks">
                    {PIECES.map((p, i) =>
                      p.zone === zone.id ? (
                        <button
                          key={p.id}
                          type="button"
                          className={`ps-tick ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`}
                          style={toneVars(p.color)}
                          onClick={() => goTo(i)}
                          aria-label={`Pieza ${p.num}: ${p.tech}`}
                          aria-current={i === step ? 'step' : undefined}
                        >
                          {p.num}
                        </button>
                      ) : null,
                    )}
                  </div>
                </div>
              ))}
            </div>
          </header>

          <div className="ps-stage">
            <div className="ps-half ps-cafe">
              <span className="ps-label">
                <Coffee size={14} /> En la cafetería
              </span>
              <div className="ps-texts">
                {PIECES.map((p) => (
                  <div key={p.id} className="ps-cafe-item">
                    <span className="ps-num">{p.num}</span>
                    <h3 className="ps-cafe-title">{p.cafe}</h3>
                    <p className="ps-line">{p.cafeLine}</p>
                  </div>
                ))}
              </div>
              <div className="ps-visual">
                <CafeScene step={step} />
              </div>
            </div>

            <div className="ps-half ps-web" style={toneVars(PIECES[step].color)}>
              <span className="ps-label">
                <Code2 size={14} /> En la web
              </span>
              <div className="ps-texts">
                {PIECES.map((p) => (
                  <div key={p.id} className="ps-web-item" style={toneVars(p.color)}>
                    <span className="ps-zone-chip">{zoneLabel(p.zone)}</span>
                    <h3 className="ps-tech">
                      {p.tech}
                      {p.techNote && <small>{p.techNote}</small>}
                    </h3>
                    <p className="ps-line">{p.webLine}</p>
                    <code className="ps-code">{p.code}</code>
                  </div>
                ))}
              </div>
              <div className="ps-visual">
                <BrowserMock step={step} count={count} onOrder={onOrder} />
              </div>
            </div>

            <div className="ps-eq" aria-hidden="true">
              <Equal size={22} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Móvil / movimiento reducido: tarjetas */}
      <div className="container ps-list">
        <header className="section-head">
          <Head />
          <p className="lead">Cada pieza de una web app tiene su gemela en la cafetería.</p>
        </header>
        {PIECES.map((p, i) => (
          <article key={p.id} id={`pieza-${p.id}`} className="ps-card">
            <div className="ps-card-head">
              <span className="ps-num">{p.num}</span>
              <span className="ps-zone-chip">{zoneLabel(p.zone)}</span>
            </div>
            <AnalogyRow
              icon={p.icon}
              tone={p.color}
              cafe={p.cafe}
              cafeLine={p.cafeLine}
              web={p.tech}
              webNote={p.techNote}
              webLine={p.webLine}
            >
              <code className="ps-code" style={toneVars(p.color)}>
                {p.code}
              </code>
            </AnalogyRow>
            <div className="ps-card-visuals" data-reveal>
              <CafeScene step={i} />
              <BrowserMock step={i} count={count} onOrder={onOrder} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
