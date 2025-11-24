export const downloadCanvasToImage = () => {
  const canvas = document.querySelector("canvas");
  const dataURL = canvas.toDataURL();
  const link = document.createElement("a");

  link.href = dataURL;
  link.download = "canvas.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const reader = (file) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.readAsDataURL(file);
  });

export const getContrastingColor = (color) => {
  // Remove the '#' character if it exists
  const hex = color.replace("#", "");

  // Convert the hex string to RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate the brightness of the color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black or white depending on the brightness
  return brightness > 128 ? "black" : "white";
};

/**
 * Generate a data URL for given text using a canvas. Returns a PNG data URL.
 * Options: { fontFamily, fontSize, color, padding }
 */
export const generateTextDataURL = async (
  text,
  { fontFamily = "Impact, Arial", fontSize = 160, color = "#000000", padding = 40 } = {}
) => {
  if (!text) return null;

  // Ensure the font is loaded (best-effort). If the font is not available,
  // the browser will fall back to a default font.
  try {
    if (document?.fonts && fontFamily) {
      // Try to load the first family name
      const familyName = fontFamily.split(",")[0].replace(/['"]+/g, "").trim();
      await document.fonts.load(`${fontSize}px ${familyName}`);
    }
  } catch (e) {
    // ignore font loading issues
  }

  // create a large enough canvas to get good resolution
  const DPR = Math.max(1, window.devicePixelRatio || 1);
  const baseWidth = 2048;
  const baseHeight = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = baseWidth * DPR;
  canvas.height = baseHeight * DPR;
  const ctx = canvas.getContext("2d");
  ctx.scale(DPR, DPR);

  // background transparent
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // font settings
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${fontSize}px ${fontFamily}`;

  // compute center and draw text
  const cx = baseWidth / 2;
  const cy = baseHeight / 2;

  // Optional outline for better contrast
  ctx.lineWidth = Math.max(2, Math.floor(fontSize / 20));
  ctx.strokeStyle = "rgba(255,255,255,0)"; // disabled by default
  // draw text
  ctx.fillText(text, cx, cy);

  return canvas.toDataURL("image/png");
};
