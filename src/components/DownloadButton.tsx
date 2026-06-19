type Props = {
  onClick: () => void;
};

export default function DownloadButton({
  onClick
}: Props) {
  return (
    <button onClick={onClick}>
      Descargar CSV
    </button>
  );
}