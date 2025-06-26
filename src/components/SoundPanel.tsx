import { useEffect, useState } from "react";

function SoundPanel({ directoryName }: { directoryName: string | null }) {
  const [sounds, setSounds] = useState<
    | Array<{ sound_id: number; name: string; icon: string; category: string }>
    | undefined
  >(undefined);

  useEffect(() => {
    console.log("zmieniam directory");
  }, [directoryName]);
  return (
    <div id="sound-panel">
      {/* {directoryName == undefined ? <span>loading...</span> : directoryName.} */}
    </div>
  );
}

export default SoundPanel;
