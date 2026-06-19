type Props = {
  value: number;
};

export default function ProgressBar({
  value
}: Props) {
  return (
    <div>
      <progress
        value={value}
        max={100}
      />

      <span>
        {value}%
      </span>
    </div>
  );
}