import { useState } from "react";
import FileButton from "../widgets/FileButton";
import AudioShow from "../widgets/AudioShow";

function SoundDialog({ onCloseDialog }: { onCloseDialog: () => void }) {
  const [file, setFile] = useState<Blob | null>(null);
  return (
    <>
      <div
        className="sound-dialog-background"
        onClick={() => {
          onCloseDialog();
        }}
      ></div>
      <div id="sound-dialog">
        <FileButton
          onFileChoosen={(file) => {
            setFile(file);
          }}
        ></FileButton>
        {file == null ? <></> : <AudioShow audio={file} />}
      </div>
    </>
  );
}

export default SoundDialog;
