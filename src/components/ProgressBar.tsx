type Props = {
  value: number;
  processed: number;
  total: number;
  elapsedSeconds: number;
};

export default function ProgressBar({
  value,
  processed,
  total,
  elapsedSeconds
}: Props) {
  const elapsed = new Date(elapsedSeconds * 1000).toISOString().slice(11, 19);
  return (
    <div className="progress-status">
      <div className="progress-status__row">
        <progress value={value} max={100} />
        <strong>{value}%</strong>
      </div>
      <div className="progress-status__meta">
        <span>{processed.toLocaleString()} / {total.toLocaleString()} registros procesados</span>
        <span>Tiempo total: {elapsed}</span>
      </div>
    </div>
  );
}
