import React, { useMemo, useCallback } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import Box from "@material-ui/core/Box";

import Element from './Element';
import Leaf from './Leaf';

const ReadOnly = ({ initialValue, borderSize = 0 }) => {
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withReact(createEditor()), []);
  return (
    <Box p={1} m={2} border={borderSize}>
      <Slate editor={editor} value={initialValue}>
        <Editable
          readOnly
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
      </Slate>
    </Box>
  );
};

export default ReadOnly;
