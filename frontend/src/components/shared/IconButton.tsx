import type { FC } from "react";
import "remixicon/fonts/remixicon.css";

const base = "hover:text-white rounded font-medium h-9 w-9";

const IconButtonModel = {
  primary: "bg-blue-50 hover:bg-blue-500 text-blue-600 " + base,
  secondary: "bg-indigo-50 hover:bg-indigo-600 text-indigo-600 " + base,
  danger: "bg-rose-50 hover:bg-rose-600 text-rose-600 " + base,
  warning: "bg-amber-50 hover:bg-amber-600 text-amber-600 " + base,
  dark: "bg-zinc-50 hover:bg-zinc-600 text-zinc-600 " + base,
  success: "bg-green-40 hover:bg-green-500 text-green-600 " + base,
  info: "bg-cyan-50 hover:bg-cyan-600 text-cyan-600 " + base,
};

interface IconButtonInterface {
  type?:
    | "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "dark"
    | "success"
    | "info";
  onClick?: () => void;
  icon: string;
}

const IconButton: FC<IconButtonInterface> = ({
  type = "primary",
  onClick,
  icon,
}) => {
  return (
    <button className={IconButtonModel[type]} onClick={onClick}>
      <i className={`ri-${icon} text-base`}></i>
    </button>
  );
};

export default IconButton;
