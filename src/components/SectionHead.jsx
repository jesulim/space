export default function SectionHead({ num, kicker, title, lead }) {
  return (
    <header className="section-head" data-reveal>
      <span className="kicker">
        <span className="kicker-num">{num}</span> {kicker}
      </span>
      <h2 className="title">{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </header>
  );
}
