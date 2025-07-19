import { useState } from "react";
import FileButton from "../widgets/FileButton";
import AudioShow from "../widgets/AudioShow";
import SoundIconPicker from "../widgets/SoundIconPicker";
import SoundNameInput from "../widgets/SoundNameInput";

function SoundDialog({ onCloseDialog }: { onCloseDialog: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  return (
    <>
      <div
        className="sound-dialog-background"
        onClick={() => {
          onCloseDialog();
        }}
      ></div>
      <div id="sound-dialog">
        <SoundIconPicker />
        <SoundNameInput />
        <FileButton
          onFileChoosen={(file) => {
            setFile(file);
          }}
        ></FileButton>
        {/* {file == null ? null : <AudioShow audio={file} />} */}
      </div>
    </>
  );
}

export default SoundDialog;
