import React from "react";
import { useSnapshot } from "valtio";

import state from "../store";

const CustomButton = ({
  type,
  title,
  customStyles = "",
  handleClick,
  useThemeColor = true,
  icon = null,
  variant = "circle",
}) => {
  const snap = useSnapshot(state);

  // Decide base classes by variant
  const baseClass =
    variant === "rect"
      ? `filepicker-label ${customStyles}`.trim()
      : `tab-btn rounded-full glassmorphism ${customStyles}`.trim();

  return (
    <button className={baseClass} onClick={handleClick} aria-label={title}>
      {icon ? (
        typeof icon === "string" ? (
          <img src={icon} alt={title} className="w-5 h-5" />
        ) : (
          icon
        )
      ) : (
        <span>{title}</span>
      )}
    </button>
  );
};

export default CustomButton;
