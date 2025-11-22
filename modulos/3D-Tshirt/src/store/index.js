import {proxy} from 'valtio';

const state = proxy({
  intro: true,
  color: '#353934',
  isLogoTexture: true,
  logoDecal: './logoSena.png',
  // logo placement state: position is in local mesh coordinates
  logoPosition: [0, 0.04, 0.15],
  // whether the user is currently dragging the logo
  isDraggingLogo: false,
  // scale for the logo decal
  logoScale: 0.15,
  // logo placement state: position is in local mesh coordinates
  logoPosition: [0, 0.04, 0.15],
  // whether the user is currently dragging the logo
  isDraggingLogo: false,
});

export default state;