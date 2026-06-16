function InfoCard({ title, value, detail, active, tone = 'neutral' }) {
  return (
    <div className={`info-card ${active ? 'active' : ''} ${tone}`}>
      <span>{title}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

export default InfoCard;
