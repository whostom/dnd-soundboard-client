import type { MouseEventHandler, ReactNode } from "react";

function AudioControlButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button onClick={onClick} className="audio-control-button">
      {children}
    </button>
  );
}

export default AudioControlButton;
