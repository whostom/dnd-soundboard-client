import { useRef } from "react";

function FileButton({
  onFileChoosen,
}: {
  onFileChoosen: (file: File) => void;
}) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <button></button>
      <input
        ref={inputFileRef}
        onChange={() => {
          if (
            inputFileRef.current != null &&
            inputFileRef.current.files != null
          ) {
            if (inputFileRef.current.files.length > 0) {
              onFileChoosen(inputFileRef.current.files[0]);
            }
          }
        }}
        accept="audio/mpeg,audio/ogg,audio/wav"
        type="file"
      />
    </>
  );
}

export default FileButton;
