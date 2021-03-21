import React, {useState} from 'react';
import JoditEditor from "jodit-react";

const Editor = ({initialValue, htmlViewState}) => {
  const [content, setContent] = useState(initialValue);

	const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    buttons: ['source']
  }
  
  const clsName = htmlViewState ? "" : "cls-hidden"
  console.log(clsName);

  return (
    <div className="text-editor">
      <div dangerouslySetInnerHTML={{__html: content}} className={htmlViewState ? "" : "cls-hidden"}/>
      <div className={htmlViewState ?  "cls-hidden" : ""}>
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