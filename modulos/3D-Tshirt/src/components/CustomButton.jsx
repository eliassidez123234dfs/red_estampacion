import React from "react";
import { useSnapshot } from "valtio";

import state from "../store";
import { getContrastingColor } from "../config/helpers"; 

const CustomButton = ({ type, title, customStyles, handleClick, useThemeColor = true }) => {
  const snap = useSnapshot(state);

  // This function generates a style object based on the type of style required
  const generateStyle = (type) => {
    // If useThemeColor is false, return fixed fallback styles so the button doesn't change with the shirt color
    if (!useThemeColor) {
      if (type === "filled") {
        return {
          backgroundColor: "#2f3a2f",
          color: "#ffffff",
        };
      }
      if (type === "outline") {
        return {
          borderWidth: "1px",
          borderColor: "#2f3a2f",
          color: "#2f3a2f",
        };
      }
      return {};
    }

    if (type === "filled") {
      return {
        backgroundColor: snap.color,
        color: getContrastingColor(snap.color),
      };
    } else if (type === "outline") {
      return {
        borderWidth: "1px",
        borderColor: snap.color,
        color: snap.color,
      };
    }
    return {};
  };

  return (
    <button
      className={`px-2 py-1.5 flex-1 rounded-md ${customStyles}`}
      style={generateStyle(type)}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
