import { useEffect, useState } from "react";
import fetchToServer from "../fetch-to-server";
import SoundButton from "../widgets/SoundButton";

function SoundPanel({ directoryId }: { directoryId: number | undefined }) {
  const [sounds, setSounds] = useState<
    | Array<{
        sound_id: number;
        name: string;
        icon: string;
        category_id: number;
      }>
    | undefined
  >(undefined);

  const [categories, setCategories] = useState<
    { category_id: number; name: string } | undefined
  >();

  useEffect(() => {
    console.log("zmieniam directory");
    fetchToServer<{
      success: boolean;
      result: Array<{
        sound_id: number;
        name: string;
        icon: string;
        category_id: number;
      }>;
    }>("get-sounds", JSON.stringify({ folderId: directoryId })).then(
      (response) => {
        console.log(response);
        setSounds(response.result);
      },
    );
  }, [directoryId]);
  return (
    <div id="sound-panel">
      {sounds == undefined ? (
        <span>loading...</span>
      ) : sounds.length == 0 ? (
        <span>Brak dźwięków do puszczania :(</span>
      ) : (
        sounds.map((sound, index) => <SoundButton sound={sound} key={index} />)
      )}
    </div>
  );
}

export default SoundPanel;
