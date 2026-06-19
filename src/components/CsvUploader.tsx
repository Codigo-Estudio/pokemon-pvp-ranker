import { useRef, useState } from "react";
import Icon from "./Icon";

type Props = {
  onFileSelected: (
    file: File
  ) => void;
};

export default function CsvUploader({
  onFileSelected
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  function selectFile(file: File) {
    setFileName(file.name);
    onFileSelected(file);
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0];

    if (selectedFile) {
      selectFile(selectedFile);
    }

    event.target.value = "";
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) selectFile(file);
  }

  return (
    <div
      className={`drop-zone${isDragging ? " drop-zone--active" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => event.key === "Enter" && inputRef.current?.click()}
    >
      <input ref={inputRef} className="visually-hidden" type="file" accept=".csv,text/csv" onChange={handleFileChange} />
      <span className="drop-zone__icon"><Icon name="upload" size={40} /></span>
      <span className="drop-zone__title">{fileName || "Arrastra tu archivo CSV aquí"}</span>
      <span className="drop-zone__subtitle">o haz clic para seleccionar</span>
      <span className="button button--primary"><Icon name="file" /> Seleccionar archivo</span>
    </div>
  );
}
