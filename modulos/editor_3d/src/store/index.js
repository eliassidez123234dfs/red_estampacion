import { proxy } from "valtio";

// 1x1 transparent PNG as default placeholder for textures
const TRANSPARENT_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

const state = proxy({
  intro: true,
  color: "#353934",
  // Logo (image) settings
  isLogoTexture: true,
  logoDecal: "./logoSena.png",
  logoPosition: [0, 0.04, 0.15],
  isDraggingLogo: false,
  logoScale: 0.15,

  // decals are front-only

  // Text (generated) settings
  isTextEnabled: false,
  textDecal: TRANSPARENT_PNG,
  textValue: "Tu texto aquí",
  textFont: "Impact, Arial",
  textColor: "#000000",
  textPosition: [0, 0.12, 0.15],
  isDraggingText: false,
  textScale: 0.15,
  // text decals are front-only
  // pointer used by CameraRig to rotate the model (normalized -1..1)
  pointer: { x: 0, y: 0 },
});

export default state;