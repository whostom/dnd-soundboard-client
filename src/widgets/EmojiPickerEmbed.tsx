import type { Picker } from "emoji-picker-element";
import type { EmojiClickEvent, Emoji } from "emoji-picker-element/shared";
import { useCallback, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import isCustomEmoji from "../is-custom-emoji";
import pl from "emoji-picker-element/i18n/pl";
import RemoveEmojiButton from "./removeEmojiButton";

function EmojiPickerEmbed({
  open,
  onEmojiChoosen,
  onDeletingButtonClick,
}: {
  open: boolean;
  onEmojiChoosen: (emoji: string) => void;
  onDeletingButtonClick: () => void;
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

      node.i18n = pl;
      node.locale = "pl";

      const shadowDom = node.shadowRoot;
      if (shadowDom != null) {
        // Delete skintone support cause we don't use skin tone
        const skintoneList = shadowDom.querySelector("#skintone-list");
        skintoneList?.remove();
        const skintoneDescription = shadowDom.querySelector(
          "#skintone-description",
        );
        skintoneDescription?.remove();

        // Replace skintone button with my own delete emoji button
        const skinButtonWrapper = shadowDom.querySelector(
          ".skintone-button-wrapper",
        );
        if (skinButtonWrapper != null) {
          createRoot(skinButtonWrapper).render(
            <RemoveEmojiButton onClick={onDeletingButtonClick} />,
          );
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
