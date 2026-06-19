type Props = {
  onFileSelected: (
    file: File
  ) => void;
};

export default function CsvUploader({
  onFileSelected
}: Props) {
  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0];

    if (selectedFile) {
      onFileSelected(selectedFile);
    }
  }

  return (
    <input
      type="file"
      accept=".csv"
      onChange={handleFileChange}
    />
  );
}