import { useEffect, useRef, useState } from "react";
import FileButton from "../widgets/FileButton";
import AudioShow from "../widgets/AudioShow";
import SoundIconPicker from "../widgets/SoundIconPicker";
import SoundNameInput from "../widgets/SoundNameInput";
import CategoryPicker from "../widgets/CategoryPicker";
import type { SoundCategory } from "../aliases/sound-category";
import UploadButton from "../widgets/UploadButton";
import sendFileToServer from "../send-file-to-server";

function SoundDialog({
  categories,
  onCloseDialog,
}: {
  categories: Array<SoundCategory> | undefined;
  onCloseDialog: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const emoji = useRef<string>("");
  const name = useRef<string>("");
  const category = useRef<SoundCategory | null>(null);
  const start = useRef<number>(0);
  const end = useRef<number>(-1);

  useEffect(() => {
    start.current = 0;
    end.current = -1;
  }, [file]);

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
          onEmojiChoosen={(emojiAttr) => {
            emoji.current = emojiAttr;
          }}
        />
        <SoundNameInput
          onNameChange={(nameAttr) => {
            name.current = nameAttr;
          }}
        />
        <CategoryPicker
          onCategoryChoosen={(categoryAttr) => {
            category.current = categoryAttr;
          }}
          categories={categories}
        />
        <FileButton
          onFileChoosen={(fileAttr) => {
            setFile(fileAttr);
          }}
        ></FileButton>
        {file == null ? null : (
          <AudioShow
            onRegionChanged={(startAttr, endAttr) => {
              start.current = startAttr;
              end.current = endAttr;
            }}
            audio={file}
          />
        )}
        <UploadButton
          disabled={
            name.current == "" || category.current == null || file == null
          }
          onClick={() => {
            if (file == null) return;
            if (category.current == null) return;
            if (name.current == "") return;

            sendFileToServer("upload-sound", file, {
              name: name.current,
              icon: emoji.current,
              category: category.current.category_id,
              start: start.current,
              end: end.current,
            }).then(() => {
              console.log("dodalem pliczek essa");
            });
          }}
        />
      </div>
    </>
  );
}

export default SoundDialog;
