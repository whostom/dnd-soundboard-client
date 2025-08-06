import type { CustomEmoji, Emoji } from "emoji-picker-element/shared";

export default function (emoji: Emoji): emoji is CustomEmoji {
  return "url" in emoji;
}
