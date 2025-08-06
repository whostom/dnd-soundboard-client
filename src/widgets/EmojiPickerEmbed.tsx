import type { Picker } from "emoji-picker-element";
import type { EmojiClickEvent, Emoji } from "emoji-picker-element/shared";
import { useCallback, useEffect, useRef } from "react";
import isCustomEmoji from "../is-custom-emoji";

function EmojiPickerEmbed({
  open,
  onEmojiChoosen,
}: {
  open: boolean;
  onEmojiChoosen: (emoji: string) => void;
}) {
  const emojiPickerRef = useRef<Picker | null>(null);

  const onEmojiClick = (event: EmojiClickEvent) => {
    const emoji: Emoji = event.detail.emoji;

    if (isCustomEmoji(emoji)) {
      onEmojiChoosen(emoji.name);
    } else {
      onEmojiChoosen(emoji.unicode);
    }
  };

  useEffect(() => {
    import("emoji-picker-element");
  }, []);

  const setEmojiPickerRef = useCallback((node: Picker | null) => {
    if (node) {
      node.addEventListener("emoji-click", onEmojiClick);

      const shadowDom = node.shadowRoot;
      if (shadowDom != null) {
        // Delete skintone button cause we don't use skin tone
        const skinButton = shadowDom.querySelector(".skintone-button-wrapper");
        skinButton?.remove();

        // Fix padding after deleting skintone button
        const searchRow = shadowDom.querySelector<HTMLElement>(".search-row");
        if (searchRow != null) {
          searchRow.style.paddingInlineEnd = "var(--emoji-padding)";
        }

        // Delete favorites panel
        const favorites = shadowDom.querySelector(".favorites");
        favorites?.remove();
      }
    } else if (emojiPickerRef.current) {
      emojiPickerRef.current.removeEventListener("emoji-click", onEmojiClick);
    }

    emojiPickerRef.current = node;
  }, []);

  return (
    <>{open ? <emoji-picker ref={setEmojiPickerRef}> </emoji-picker> : null}</>
  );
}

export default EmojiPickerEmbed;
