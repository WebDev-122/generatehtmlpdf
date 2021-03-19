import React, { useCallback, useMemo } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, Slate } from "slate-react";
import { createEditor, Editor } from "slate";
import { withHistory } from "slate-history";

import Box from "@material-ui/core/Box";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import CodeIcon from "@material-ui/icons/Code";
import LooksOneIcon from "@material-ui/icons/LooksOne";
import LooksTwoIcon from "@material-ui/icons/LooksTwo";
import FormatQuoteIcon from "@material-ui/icons/FormatQuote";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import EditIcon from "@material-ui/icons/Edit";
import Divider from "@material-ui/core/Divider";

import BlockButton from './BlockButton';
import Element from './Element';
import Leaf from './Leaf';
import MarkButton from './MarkButton';

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code"
};

const RichEditor = ({ value, setValue }) => {
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Box p={1} m={2} border={1} borderColor="grey.500" borderRadius={4}>
      <Slate
        editor={editor}
        value={value}
        onChange={value => {
          setValue(value);
        }}
      >
        <Toolbar>
          <MarkButton format="bold">
            <FormatBoldIcon />
          </MarkButton>
          <MarkButton format="italic">
            <FormatItalicIcon />
          </MarkButton>
          <MarkButton format="underline">
            <FormatUnderlinedIcon />
          </MarkButton>
          <MarkButton format="code">
            <CodeIcon />
          </MarkButton>
          <BlockButton format="heading-one">
            <LooksOneIcon />
          </BlockButton>
          <BlockButton format="heading-two">
            <LooksTwoIcon />
          </BlockButton>
          <BlockButton format="block-quote">
            <FormatQuoteIcon />
          </BlockButton>
          <BlockButton format="numbered-list">
            <FormatListNumberedIcon />
          </BlockButton>
          <BlockButton format="bulleted-list">
            <FormatListBulletedIcon />
          </BlockButton>
          <BlockButton format="code-view">
            <EditIcon />
          </BlockButton>
        </Toolbar>
        <Box pl={1}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Enter some rich text…"
            spellCheck
            autoFocus
            onKeyDown={event => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event)) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey];
                  toggleMark(editor, mark);
                }
              }
            }}
          />
        </Box>
      </Slate>
    </Box>
  );
};

const Menu = React.forwardRef(({ children, ...props }, ref) => (
  <>
    <Box
      display="flex"
      direction="row"
      justify="flex-start"
      alignItems="center"
      flexWrap="wrap"
    >
      {children}
    </Box>
    <Box pt={2}>
      <Divider variant="middle" />
    </Box>
  </>
));

const Toolbar = React.forwardRef(({ className, ...props }, ref) => (
  <Menu {...props} ref={ref} />
));

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export default RichEditor;
