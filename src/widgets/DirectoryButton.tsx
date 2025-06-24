import type { ReactNode } from "react";

function DirectoryButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: (open: boolean) => void;
}) {
  return <button>{children}</button>;
}

export default DirectoryButton;
