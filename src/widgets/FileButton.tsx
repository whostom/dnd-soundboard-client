import { useRef } from "react";
import UploadFileIcon from "../svg/upload-file-icon";

function FileButton({
  onFileChoosen,
}: {
  onFileChoosen: (file: File) => void;
}) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <label htmlFor="sound-dialog-file-button" className="file-button">
        <UploadFileIcon />
        <span className="file-button-text">Kliknij, aby dodać dźwięk</span>
      </label>
      <input
        id="sound-dialog-file-button"
        className="file-button-input"
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
        accept="audio/mpeg,audio/wav"
        type="file"
      />
    </>
  );
}

export default FileButton;
