import type { ReactNode } from "react";

function CategoryNav({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return (
    <div className="category-nav">
      <div className="category-nav-name">{name}</div>
      {children}
    </div>
  );
}

export default CategoryNav;
