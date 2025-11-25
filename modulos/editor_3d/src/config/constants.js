import { swatch, fileIcon, logoShirt, textIcon } from "../assets";

export const EditorTabs = [
  {
    name: "colorpicker",
    icon: swatch,
  },
  {
    name: "filepicker",
    icon: fileIcon,
  },
  {
    name: "texteditor",
    icon: textIcon,
  },
];

export const FilterTabs = [
  {
    name: "logoShirt",
    icon: logoShirt,
  },
  {
    name: "textShirt",
    icon: textIcon,
  },
];

export const DecalTypes = {
  logo: {
    stateProperty: "logoDecal",
    filterTab: "logoShirt",
  },
  text: {
    stateProperty: "textDecal",
    filterTab: "textShirt",
  },
};
