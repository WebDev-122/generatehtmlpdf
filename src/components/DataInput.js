import React, {useRef, useCallback} from 'react';
import { Button } from '@material-ui/core';

const DataInput = ({handleFile}) => {
  const fileInput = useRef();

  const handleChange = useCallback((e) => {
    const files = e.target.files;
    if (files && files[0]) handleFile(files[0]);
  }, [handleFile]);

  return (
    <>
      <Button className="import-file-button" onClick={() => fileInput.current.click()}> Import File </Button>
      <input
        ref={fileInput}
        type="file"
        hidden
        accept={SheetJSFT}
        onChange={handleChange}
      />
    </>
  );
}

const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm"
]
  .map(function(x) {
    return "." + x;
  })
  .join(",");

export default DataInput;