import { Icon } from "./icon";

function StopIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      className="icon stop-icon"
      fill="currentColor"
      {...props}
    >
      <path d="M240-240v-480h480v480H240Z" />
    </svg>
  );
}

export default Icon(StopIcon);
