// import EmojiPicker, { Categories, EmojiStyle, Theme } from "emoji-picker-react";
import { useState } from "react";
import ChooseEmojiIcon from "../svg/choose-emoji-icon";
import EmojiPickerEmbed from "./EmojiPickerEmbed";

function SoundIconPicker({
  onEmojiChoosen,
}: {
  onEmojiChoosen: (emoji: string) => void;
}) {
  const [emoji, setEmoji] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  return (
    <>
      <button
        onClick={() => {
          setPickerOpen(true);
        }}
        className="sound-icon-button"
      >
        {emoji == null ? (
          <ChooseEmojiIcon />
        ) : (
          <div className="sound-icon-button-emoji emoji">{emoji}</div>
        )}
        <div className="sound-icon-button-text">
          Kliknij tutaj aby dodać ikonę dźwięku
        </div>
      </button>
      {pickerOpen ? (
        <div
          className="emoji-picker-background"
          onClick={() => {
            setPickerOpen(false);
          }}
        ></div>
      ) : null}
      <EmojiPickerEmbed
        onEmojiChoosen={(emoji) => {
          if (emoji == "block") {
            onEmojiChoosen("");
            setEmoji(null);
            setPickerOpen(false);
          } else {
            onEmojiChoosen(emoji);
            setEmoji(emoji);
            setPickerOpen(false);
          }
        }}
        open={pickerOpen}
      />
      {/* <EmojiPicker
        onEmojiClick={(emojiData) => {
          if (emojiData.emoji == "block") {
            onEmojiChoosen("");
            setEmoji(null);
          } else {
            onEmojiChoosen(emojiData.emoji);
            setEmoji(emojiData.emoji);
          }
          setPickerOpen(false);
        }}
        open={pickerOpen}
        className="emoji-picker"
        emojiStyle={EmojiStyle.GOOGLE}
        theme={Theme.DARK}
        lazyLoadEmojis={true}
        skinTonesDisabled={true}
        searchPlaceHolder="Szukaj"
        customEmojis={[
          {
            names: ["Usuń wybór emoji"],
            imgUrl: "https://cdn-icons-png.flaticon.com/512/3114/3114801.png",
            id: "block",
          },
        ]}
        categories={[
          {
            category: Categories.CUSTOM,
            name: "Usuń emoji",
          },
          {
            category: Categories.SMILEYS_PEOPLE,
            name: "Ludzie",
          },
          {
            category: Categories.ANIMALS_NATURE,
            name: "Natura",
          },
          {
            category: Categories.FOOD_DRINK,
            name: "Jedzenie",
          },
          {
            category: Categories.TRAVEL_PLACES,
            name: "Miejsca",
          },
          {
            category: Categories.ACTIVITIES,
            name: "Aktywności",
          },
          {
            category: Categories.OBJECTS,
            name: "Przedmioty",
          },
          {
            category: Categories.SYMBOLS,
            name: "Symbole",
          },
          {
            category: Categories.FLAGS,
            name: "Flagi",
          },
        ]}
      /> */}
    </>
  );
}

export default SoundIconPicker;
