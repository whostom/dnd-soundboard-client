import { useEffect } from "react";

function SoundPanel({ directoryName }: { directoryName: string | null }) {
  useEffect(() => {
    console.log("zmieniam directory");
  }, [directoryName]);
  return <div id="sound-panel"></div>;
}

export default SoundPanel;
