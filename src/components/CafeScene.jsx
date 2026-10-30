import { useId } from 'react';
import { PIECES } from '../data';

const AWNING = Array.from({ length: 9 }, (_, i) => 70 + i * 20);

// El local se arma por etapas, en paralelo a la app:
// 0 muros (HTML) · 1 pintura (CSS) · 2 barista (React) · 3 almacén · 4 planos (GitHub) · 5 abierto (Vercel)
export default function CafeScene({ step }) {
  const glowId = useId();
  const cls = [
    'scene',
    step >= 1 && 'is-painted',
    step >= 2 && 'has-barista',
    step >= 3 && 'has-storage',
    step >= 4 && 'has-vault',
    step >= 5 && 'is-open',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <svg className={cls} viewBox="0 0 320 220" role="img" aria-label={`La cafetería: ${PIECES[step].cafe.toLowerCase()}`}>
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="#FFD58A" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFD58A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* La avenida (Vercel) */}
      <g className="sc-street">
        <rect x="0" y="198" width="320" height="20" rx="4" className="sc-road" />
        <line x1="108" y1="208" x2="316" y2="208" className="sc-road-dash" />
        <text x="10" y="211" className="sc-road-label">Av. Principal</text>
      </g>
      <line x1="6" y1="196" x2="314" y2="196" className="sc-ground" />

      {/* La bóveda de planos (GitHub) */}
      <g className="sc-vault">
        <line x1="16" y1="120" x2="48" y2="120" className="sc-commit-line" />
        <circle cx="16" cy="120" r="4" className="sc-commit" />
        <circle cx="32" cy="120" r="4" className="sc-commit" />
        <circle cx="48" cy="120" r="4.5" className="sc-commit sc-commit-head" />
        <rect x="10" y="132" width="44" height="54" rx="3" className="sc-blueprint" />
        <path d="M24 132 V186 M38 132 V186 M10 150 H54 M10 168 H54" className="sc-blueprint-grid" />
      </g>

      {/* El almacén con llave (LocalStorage) */}
      <g className="sc-storage">
        <path d="M262 148 L286 130 L310 148 Z" className="sc-shed-roof" />
        <rect x="266" y="146" width="40" height="50" className="sc-shed" />
        <path d="M282 170 v-4 a4 4 0 0 1 8 0 v4" className="sc-lock-arc" />
        <rect x="279" y="170" width="14" height="11" rx="2" className="sc-lock" />
      </g>

      {/* Los muros (HTML) */}
      <rect x="62" y="62" width="196" height="134" className="sc-wall" />
      <rect x="54" y="54" width="212" height="12" rx="2" className="sc-cornice" />
      <rect x="112" y="72" width="96" height="22" rx="3" className="sc-sign" />
      <text x="160" y="87.5" textAnchor="middle" className="sc-sign-text">CAFÉ</text>

      {/* La pintura y las luces (CSS) */}
      <g className="sc-lamps">
        <circle cx="90" cy="83" r="16" fill={`url(#${glowId})`} />
        <circle cx="230" cy="83" r="16" fill={`url(#${glowId})`} />
        <circle cx="90" cy="83" r="4" className="sc-bulb" />
        <circle cx="230" cy="83" r="4" className="sc-bulb" />
      </g>
      <g className="sc-awning">
        {AWNING.map((x, i) => (
          <g key={x} className={i % 2 ? 'sc-stripe-b' : 'sc-stripe-a'}>
            <rect x={x} y="100" width="20" height="14" />
            <path d={`M${x} 114 a10 10 0 0 0 20 0 z`} />
          </g>
        ))}
      </g>

      <rect x="80" y="128" width="92" height="52" rx="2" className="sc-window" />
      <rect x="190" y="128" width="48" height="68" rx="2" className="sc-door" />
      <circle cx="230" cy="164" r="2.5" className="sc-knob" />

      {/* El barista (React) */}
      <g className="sc-barista">
        <circle cx="110" cy="148" r="7" className="sc-head" />
        <path d="M98 172 v-10 a12 12 0 0 1 24 0 v10 z" className="sc-apron" />
        <rect x="80" y="168" width="92" height="12" className="sc-counter" />
        <rect x="140" y="159" width="10" height="9" rx="2" className="sc-cup" />
        <path d="M143 155 q-3 -4 0 -8" className="sc-steam" />
        <path d="M148 155 q3 -4 0 -8" className="sc-steam sc-steam-2" />
      </g>

      {/* Abierto al público (Vercel) */}
      <g className="sc-open">
        <rect x="195" y="136" width="38" height="14" rx="3" className="sc-open-sign" />
        <text x="214" y="146" textAnchor="middle" className="sc-open-text">ABIERTO</text>
      </g>
    </svg>
  );
}
