import { useState } from "react";
import FileButton from "../widgets/FileButton";
import AudioShow from "../widgets/AudioShow";
import SoundIconPicker from "../widgets/SoundIconPicker";
import SoundNameInput from "../widgets/SoundNameInput";
import CategoryPicker from "../widgets/CategoryPicker";
import type { SoundCategory } from "../aliases/sound-category";

function SoundDialog({
  categories,
  onCloseDialog,
}: {
  categories: Array<SoundCategory> | undefined;
  onCloseDialog: () => void;
}) {
  // const
  const [file, setFile] = useState<File | null>(null);
  const [emoji, setEmoji] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<SoundCategory | null>(null);

  return (
    <>
      <div
        className="sound-dialog-background"
        onClick={() => {
          onCloseDialog();
        }}
      ></div>
      <div id="sound-dialog">
        <SoundIconPicker
          onEmojiChoosen={(emoji) => {
            setEmoji(emoji);
          }}
        />
        <SoundNameInput
          onNameChange={(name) => {
            setName(name);
          }}
        />
        <CategoryPicker categories={categories} />
        <FileButton
          onFileChoosen={(file) => {
            setFile(file);
          }}
        ></FileButton>
        {file == null ? null : <AudioShow audio={file} />}
      </div>
    </>
  );
}

export default SoundDialog;
