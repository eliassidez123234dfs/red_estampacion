import React from "react";
import PropTypes from "prop-types";
import { useSnapshot } from "valtio";

import CustomButton from "./CustomButton";
import state from "../store";

/**
 * The `FilePicker` component is a React component that allows users to upload a file and provides
 * buttons to read different parts of the file.
 * @returns The FilePicker component is returning JSX elements.
 */
const FilePicker = ({ file, setFile, readFile }) => {
  const snap = useSnapshot(state);

  return (
    <div className="filepicker-container">
      <div className="flex-1 flex flex-col">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          /* The `onChange` event handler in the `input` element is responsible for updating the `file` state
            when a file is selected by the user. */
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="file-upload" className="filepicker-label">
          Upload File
        </label>

        <p className="mt-2 text-gray-500 text-xs truncate">
          {file === "" ? "No file selected" : file.name}
        </p>
        {/* Only front placement supported — 'Espalda' removed as requested */}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <CustomButton
          type="outline"
          title="Logo"
          handleClick={() => readFile("logo")}
          customStyles="text-xs"
          variant="rect"
        />
        
      </div>
    </div>
  );
};

FilePicker.propTypes = {
  file: PropTypes.object,
  setFile: PropTypes.func.isRequired,
  readFile: PropTypes.func.isRequired,
};

export default FilePicker;
