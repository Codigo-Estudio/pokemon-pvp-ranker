type Props = {
  onClick: () => void;
};

export default function DownloadButton({
  onClick
}: Props) {
  return (
    <button className="button button--outline" onClick={onClick}>
      <Icon name="download" /> Exportar CSV
    </button>
  );
}
import Icon from "./Icon";
