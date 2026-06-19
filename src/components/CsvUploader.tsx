type Props = {
  onFileSelected: (
    file: File
  ) => void;
};

export default function CsvUploader({
  onFileSelected
}: Props) {
  return (
    <input
      type="file"
      accept=".csv"
      onChange={(e) => {
        const file =
          e.target.files?.[0];
          console.log("Archivo seleccionado", file);
        if (file) {
          onFileSelected(file);
        }
      }}
    />
  );
}