import { useEffect, useRef, useState } from "react";
import type { SoundCategory } from "../aliases/sound-category";
import ArrowDownIcon from "../svg/arrow-down-icon";

function CategoryPicker({
  onCategoryChoosen,
  categories,
}: {
  onCategoryChoosen: (category: SoundCategory) => void;
  categories: Array<SoundCategory> | undefined;
}) {
  const [choosenCategory, setChoosenCategory] = useState<SoundCategory | null>(
    null,
  );
  const [selectOpen, setSelectOpen] = useState<boolean>(false);

  const categoryPickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const detectClickingOutside = (event: Event) => {
      console.log("siema");
      console.log(categoryPickerRef.current);
      if (categoryPickerRef.current == null) return;
      console.log(event.composedPath().includes(categoryPickerRef.current));
      const withinBoundaries = event
        .composedPath()
        .includes(categoryPickerRef.current);

      if (!withinBoundaries) {
        if (selectOpen) {
          setSelectOpen(false);
        }
      }
    };

    document.addEventListener("click", detectClickingOutside);

    return () => {
      document.removeEventListener("click", detectClickingOutside);
    };
  }, []);

  return (
    <div ref={categoryPickerRef} className="category-picker">
      <button
        className="category-button"
        onClick={() => {
          setSelectOpen(!selectOpen);
        }}
      >
        <span className="category-button-text">
          {choosenCategory == null
            ? "--Wybierz kategorie--"
            : choosenCategory.name}
        </span>
        <ArrowDownIcon />
        {selectOpen ? (
          <div className="category-select">
            {categories?.map((category, index) => (
              <div
                key={index}
                onClick={() => {
                  setChoosenCategory(category);
                }}
                className="category-select-option"
              >
                {category.name}
              </div>
            ))}
          </div>
        ) : null}
      </button>
    </div>
  );
}

export default CategoryPicker;
