import React, {useState, useMemo} from 'react';
import JoditEditor from "jodit-react";

const Editor = ({initialValue, htmlViewState}) => {
  const [content, setContent] = useState(initialValue);

	const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    buttons: ['source']
  }

  const styleEditor = useMemo(() => htmlViewState ? {display: 'none'} : {}, [htmlViewState]);
  const styleDiv = useMemo(() => htmlViewState ? {wordWrap: 'break-word', width: '100%'} : {display: 'none'}, [htmlViewState]);

  return (
    <div className="text-editor">
      <div dangerouslySetInnerHTML={{__html: content}} style={styleDiv}/>
      <div style={styleEditor}>
        <JoditEditor
          value={content}
          config={config}
          onBlur={newContent => setContent(newContent.target.innerHTML)}
          />
      </div>
    </div>
  );
}

export default Editor