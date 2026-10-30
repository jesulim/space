import { Coffee, Equal } from 'lucide-react';

// Una analogía partida en dos: la cafetería a la izquierda, la web a la derecha.
// data-split-row activa la animación de entrada (cada mitad llega desde su lado).
export default function AnalogyRow({ icon: Icon, cafe, cafeLine, web, webNote, webLine, tone = 'accent', photo, children }) {
  return (
    <div
      className="arow"
      data-split-row
      style={{ '--tone': `var(--${tone})`, '--tone-soft': `var(--${tone}-soft)` }}
    >
      <div className={`arow-side arow-cafe split-l ${photo ? 'has-photo' : ''}`}>
        {photo && (
          <figure className="arow-photo">
            <img src={photo.src} alt={photo.alt} width="720" height="540" loading="lazy" decoding="async" />
          </figure>
        )}
        <div className="arow-copy">
          <span className="arow-kicker">
            <Coffee size={13} /> En la cafetería
          </span>
          <h3 className="arow-title serif">{cafe}</h3>
          <p className="arow-line">{cafeLine}</p>
        </div>
      </div>

      <div className="arow-eq split-eq" aria-hidden="true">
        <Equal size={18} strokeWidth={2.5} />
      </div>
      <span className="sr-only">equivale a</span>

      <div className="arow-side arow-web split-r">
        <span className="arow-kicker arow-kicker-web">
          {Icon && <Icon size={13} />} En la web
        </span>
        <h3 className="arow-title">
          {web}
          {webNote && <small>{webNote}</small>}
        </h3>
        <p className="arow-line">{webLine}</p>
        {children}
      </div>
    </div>
  );
}
