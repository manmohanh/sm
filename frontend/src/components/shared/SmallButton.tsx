import type { FC } from "react";
import "remixicon/fonts/remixicon.css";

const SmallButtonModel = {
  primary:
    "bg-blue-500 hover:bg-blue-600 rounded font-medium text-white px-3 py-1.5 text-sm",
  secondary:
    "bg-indigo-500 hover:bg-indigo-600 rounded font-medium text-white px-3 py-1.5 text-sm",
  danger:
    "bg-rose-500 hover:bg-rose-600 rounded font-medium text-white px-3 py-1.5 text-sm",
  warning:
    "bg-amber-500 hover:bg-amber-600 rounded font-medium text-white px-3 py-1.5 text-sm",
  dark:
    "bg-zinc-500 hover:bg-zinc-600 rounded font-medium text-white px-3 py-1.5 text-sm",
  success:
    "bg-green-400 hover:bg-green-500 rounded font-medium text-white px-3 py-1.5 text-sm",
  info:
    "bg-cyan-500 hover:bg-cyan-600 rounded font-medium text-white px-3 py-1.5 text-sm",
};

interface SmallButtonInterface {
  children?: string;
  type?:
    | "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "dark"
    | "success"
    | "info";
  onClick?: () => void;
  icon?: string;
  loading?: boolean;
}

const SmallButton: FC<SmallButtonInterface> = ({
  children = "Submit",
  type = "primary",
  onClick,
  icon,
  loading = false,
}) => {
  if (loading)
    return (
      <button
        disabled
        className="flex items-center text-gray-400 text-sm cursor-not-allowed"
      >
        <i className="ri-loader-4-line animate-spin mr-2 text-base"></i>
        Loading...
      </button>
    );

  return (
    <button
      className={`flex items-center justify-center ${SmallButtonModel[type]} transition-all duration-200`}
      onClick={onClick}
    >
      {icon && <i className={`ri-${icon} mr-1 text-base`}></i>}
      {children}
    </button>
  );
};

export default SmallButton;
