import React, { useState } from 'react';
import { PrismAsyncLight as ReactSyntaxHighlight } from 'react-syntax-highlighter';
import { prism as style } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const CodePreviewer = ({ name, code }: { name: string; code: string }) => {
  const [previewing, setPreviewing] = useState(false);
  return (
    <div
      style={{
        backgroundColor: '#f8f8f8',
        margin: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc'
      }}
    >
      <p style={{ margin: '0', padding: '8px' }} onClick={() => setPreviewing(c => !c)}>
        <span style={{ width: '20px', display: 'inline-block' }}>{previewing ? '-' : '+'}</span> {name}
      </p>
      {previewing ? (
        <ReactSyntaxHighlight language="tsx" style={style}>
          {code}
        </ReactSyntaxHighlight>
      ) : null}
    </div>
  );
};
