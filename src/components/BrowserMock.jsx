import { useEffect, useRef, useState } from 'react';
import { GitBranch, Lock } from 'lucide-react';

// La misma app vista en el navegador, armándose al ritmo de la cafetería.
export default function BrowserMock({ step, count, onOrder }) {
  const [hint, setHint] = useState(false);
  const hintTimer = useRef(null);
  const hasBarista = step >= 2;

  useEffect(() => () => clearTimeout(hintTimer.current), []);

  const handleClick = (e) => {
    if (hasBarista) {
      onOrder(e);
      return;
    }
    setHint(true);
    clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHint(false), 1800);
  };

  return (
    <div className={`bm ${step === 0 ? 'is-raw' : ''} ${step >= 5 ? 'is-online' : ''}`}>
      <div className="bm-bar">
        <span className="bm-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="bm-url">
          {step >= 5 ? (
            <>
              <Lock size={11} /> mi-cafeteria.vercel.app
            </>
          ) : (
            'localhost:5173'
          )}
        </span>
        {step >= 5 && <span className="bm-live">En línea</span>}
      </div>

      <div className="bm-page">
        <div className="bm-content" key={step === 0 ? 'raw' : 'styled'}>
          <h1>¡Hola mundo! Bienvenido a mi cafetería</h1>
          <p>
            Cafés servidos: <strong key={count}>{hasBarista ? count : 0}</strong>
          </p>
          <button type="button" onClick={handleClick}>
            Pedir un café
          </button>
        </div>

        {step >= 3 && (
          <div className="bm-chips">
            {step >= 3 && (
              <span className="bm-chip bm-saved">
                <Lock size={11} /> Guardado: sobrevive al F5
              </span>
            )}
            {step >= 4 && (
              <span className="bm-chip bm-commits">
                <GitBranch size={11} /> main · 3 versiones
              </span>
            )}
          </div>
        )}

        {hint && (
          <span className="bm-hint" role="status">
            Aún no hay barista: el botón no hace nada.
          </span>
        )}
      </div>
    </div>
  );
}
