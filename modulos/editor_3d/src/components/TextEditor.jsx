import React, { useState } from "react";
import { useSnapshot } from "valtio";

import state from "../store";
import { generateTextDataURL } from "../config/helpers";
import CustomButton from "./CustomButton";

const TextEditor = () => {
  const snap = useSnapshot(state);
  const [text, setText] = useState(snap.textValue || "");
  const [font, setFont] = useState(snap.textFont || "Impact, Arial");
  const [color, setColor] = useState(snap.textColor || "#000000");
  const [scale, setScale] = useState(snap.textScale || 0.15);
  const [loading, setLoading] = useState(false);

  const applyText = async () => {
    if (!text) return;
    setLoading(true);
    const fontSize = Math.max(24, Math.floor(160 * scale * 2));
    const dataUrl = await generateTextDataURL(text, {
      fontFamily: font,
      fontSize,
      color,
    });

    if (dataUrl) {
      state.textDecal = dataUrl;
      state.isTextEnabled = true;
      state.textValue = text;
      state.textFont = font;
      state.textColor = color;
      state.textScale = scale;
    }
    setLoading(false);
  };

  return (
    <div className="filepicker-container">
      <div className="flex-1 flex flex-col">
        <label className="block text-sm font-medium mb-2">Texto</label>
        <input
          className="w-full p-2 border rounded mb-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe aquí"
        />

        <label className="block text-sm font-medium mb-2">Fuente</label>
        <select
          className="w-full p-2 border rounded mb-2"
          value={font}
          onChange={(e) => setFont(e.target.value)}
        >
          <option>Impact, Arial</option>
          <option>Arial</option>
          <option>Roboto</option>
          <option>Pacifico</option>
          <option>Times New Roman</option>
        </select>

        <label className="block text-sm font-medium mb-2">Color</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-8 p-0 border-0 mb-2"
        />

        <label className="block text-sm font-medium mb-2">Tamaño</label>
        <input
          type="range"
          min="0.05"
          max="0.5"
          step="0.01"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="w-full mb-4"
        />
        {/* Text placement is front-only now, 'Espalda' option removed */}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <CustomButton
          type="outline"
          title={loading ? "Generando..." : "Aplicar/Colocar"}
          handleClick={applyText}
          customStyles="text-xs"
          variant="rect"
        />
      </div>
    </div>
  );
};

export default TextEditor;
