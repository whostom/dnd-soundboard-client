import { useEffect, useState } from "react";
import fetchToServer from "../fetch-to-server";
import SoundButton from "../widgets/SoundButton";
import type { Sound } from "../aliases/sound";
// import type { SoundCategory } from "../aliases/sound-category";
import type { ServerResponse } from "../aliases/server-response";
import CategoryNav from "../widgets/CategoryNav";
import type { SoundCategory } from "../aliases/sound-category";

function SoundPanel({
  categories,
  directoryId,
}: {
  categories: Array<SoundCategory> | undefined;
  directoryId: number | undefined;
}) {
  const [sounds, setSounds] = useState<Array<Sound> | undefined>(undefined);

  useEffect(() => {
    console.log("zmieniam directory");
    fetchToServer<ServerResponse<Array<Sound>>>(
      "get-sounds",
      JSON.stringify({ folderId: directoryId }),
    ).then((response) => {
      console.log(response);
      setSounds(response.result);
    });
  }, [directoryId]);

  return (
    <div id="sound-panel">
      {sounds == undefined || categories == undefined ? (
        <span>loading...</span>
      ) : sounds.length == 0 ? (
        <span>Brak dźwięków do puszczania :(</span>
      ) : (
        categories?.map((category) =>
          sounds.filter((sound) => sound.category_id == category.category_id)
            .length == 0 ? null : (
            <CategoryNav key={category.category_id} name={category.name}>
              {sounds.map((sound, index) => (
                sound.category_id == category.category_id ? <SoundButton sound={sound} key={index}></SoundButton> : null
              ))}
            </CategoryNav>
          ),
        )
        // sounds.map((sound, index) => <SoundButton sound={sound} key={index} />)
      )}
    </div>
  );
}

export default SoundPanel;
