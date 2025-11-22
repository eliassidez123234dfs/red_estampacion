import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";

import state from "../store";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import { ColorPicker, CustomButton, FilePicker, Tab } from "../components";

const Customizer = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState("");

  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
  });

  // show tab content depending on the activeTab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;

      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;

      default:
        return null;
    }
  };

  /**
   * The function `handleDecals` updates the state with a given result and handles the active filter tab if necessary.
   */
  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  /* The `handleActiveFilterTab` function is responsible for updating the state based on the selected
filter tab. It takes a `tabName` parameter, which represents the name of the selected filter tab. */
  const handleActiveFilterTab = (tabName) => {
    // Toggle behavior for filter tabs. For `logoShirt` toggle visibility
    // and toggle the active state so clicking again closes the tab.
    if (tabName === "logoShirt") {
      state.isLogoTexture = !state.isLogoTexture;
    }

    // update activeFilterTab to reflect UI open/closed state
    setActiveFilterTab((prevState) => ({
      ...prevState,
      [tabName]: !prevState[tabName],
    }));
  };

  /**
   * Reads a file and then calls the `handleDecals` function with the specified
   * type and the result of reading the file, and finally sets the active editor tab to an empty string.
   */
  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          {/* left menu tabs */}
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() =>
                      setActiveEditorTab((prev) => (prev === tab.name ? "" : tab.name))
                    }
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          {/* Go back button */}
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Regresar"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              useThemeColor={false}
            />
          </motion.div>

          {/* filter tabs */}
          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}

            <div className="flex gap-4 items-center px-0">
              <div
                role="button"
                tabIndex={0}
                className="tab-btn rounded-full glassmorphism"
                style={{ color: snap.color }}
                onClick={() => (state.logoScale = Math.max(0.01, state.logoScale - 0.01))}
                onKeyPress={(e) => e.key === 'Enter' && (state.logoScale = Math.max(0.01, state.logoScale - 0.01))}
              >
                <svg viewBox="0 0 24 24" className="w-2/3 h-2/3" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="11" width="14" height="2" fill="currentColor" />
                </svg>
              </div>

              
              <div
                role="button"
                tabIndex={0}
                className="tab-btn rounded-full glassmorphism"
                style={{ color: snap.color }}
                onClick={() => (state.logoScale = Math.min(1.0, state.logoScale + 0.01))}
                onKeyPress={(e) => e.key === 'Enter' && (state.logoScale = Math.min(1.0, state.logoScale + 0.01))}
              >
                <svg viewBox="0 0 24 24" className="w-2/3 h-2/3" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="11" y="5" width="2" height="14" fill="currentColor" />
                  <rect x="5" y="11" width="14" height="2" fill="currentColor" />
                </svg>
              </div>

              <button className="download-btn" onClick={downloadCanvasToImage}>
                <img
                  src={download}
                  alt="Download Image"
                  className="w-3/5 h-3/5 object-contain"
                />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
