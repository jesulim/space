import { useState } from 'react';
import { Cctv, X } from 'lucide-react';

const TABS = [
  { id: 'elements', label: 'Elements', note: 'los muros' },
  { id: 'styles', label: 'Styles', note: 'la pintura' },
  { id: 'console', label: 'Console', note: 'las alarmas' },
];

export default function DevToolsDrawer({ count, onClose }) {
  const [tab, setTab] = useState('elements');

  return (
    <aside className="devtools" aria-label="Simulador de Chrome DevTools">
      <div className="devtools-bar">
        <span className="devtools-title">
          <Cctv size={15} /> DevTools <span>· las cámaras del local</span>
        </span>
        <div className="devtools-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`devtools-tab ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label} <small>{t.note}</small>
            </button>
          ))}
        </div>
        <button type="button" className="devtools-close" onClick={onClose} aria-label="Cerrar DevTools">
          <X size={16} />
        </button>
      </div>

      <div className="devtools-body">
        {tab === 'elements' && (
          <pre>
            <span className="dt-comment">{'<!-- Muros y muebles de la cafetería -->'}</span>
            {'\n'}
            <span className="dt-tag">{'<div '}</span>
            <span className="dt-attr">class</span>=<span className="dt-val">"mostrador"</span>
            <span className="dt-tag">{'>'}</span>
            {'\n  '}
            <span className="dt-tag">{'<h1>'}</span>¡Hola mundo! Bienvenido a mi cafetería
            <span className="dt-tag">{'</h1>'}</span>
            {'\n  '}
            <span className="dt-tag">{'<p>'}</span>Cafés servidos hoy: <span className="dt-val">{count}</span>
            <span className="dt-tag">{'</p>'}</span>
            {'\n  '}
            <span className="dt-tag">{'<button>'}</span>Pedir un café<span className="dt-tag">{'</button>'}</span>
            {'\n'}
            <span className="dt-tag">{'</div>'}</span>
          </pre>
        )}

        {tab === 'styles' && (
          <pre>
            <span className="dt-comment">{'/* La pintura y las luces del mostrador */'}</span>
            {'\n'}
            <span className="dt-sel">.mostrador</span>
            {' {\n  '}
            <span className="dt-prop">background</span>: <span className="dt-val">#FFF8F0</span>;{'\n  '}
            <span className="dt-prop">border-radius</span>: <span className="dt-val">20px</span>;{'\n  '}
            <span className="dt-prop">box-shadow</span>: <span className="dt-val">0 18px 40px rgba(168, 83, 27, .2)</span>;
            {'\n}'}
          </pre>
        )}

        {tab === 'console' && (
          <pre>
            <span className="dt-info">[info]</span> Barista listo en su estación de React.{'\n'}
            <span className="dt-info">[estado]</span> cafesServidos = <span className="dt-val">{count}</span>
            {'\n'}
            <span className="dt-info">[vercel]</span> Local abierto 24/7 con HTTPS.{'\n'}
            <span className="dt-ok">✓ 0 errores. Todo el local opera con normalidad.</span>
          </pre>
        )}
      </div>
    </aside>
  );
}
