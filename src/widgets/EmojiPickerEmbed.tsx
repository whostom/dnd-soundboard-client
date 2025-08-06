import type { Picker } from "emoji-picker-element";
import type { EmojiClickEvent } from "emoji-picker-element/shared";
import { useEffect, useRef } from "react";

function EmojiPickerEmbed({ open }: { open: boolean }) {
  const emojiPickerRef = useRef<Picker | null>(null);

  const onEmojiClick = (event: EmojiClickEvent) => {
    console.log(event.detail);
  };

  useEffect(() => {
    import("emoji-picker-element");
  }, []);

  useEffect(() => {
    if (emojiPickerRef.current == null) return;

    emojiPickerRef.current.addEventListener("emoji-click", onEmojiClick);

    return () => {
      if (emojiPickerRef.current == null) return;

      emojiPickerRef.current.removeEventListener("emoji-click", onEmojiClick);
    };
  }, [emojiPickerRef]);
  return (
    <>{open ? <emoji-picker ref={emojiPickerRef}> </emoji-picker> : null}</>
  );
}

export default EmojiPickerEmbed;
