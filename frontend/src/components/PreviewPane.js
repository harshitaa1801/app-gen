import React from 'react';
import './PreviewPane.css';

const PreviewPane = ({ file }) => {
  if (!file) {
    return null;
  }

  const isHtml = file.path.toLowerCase().endsWith('.html');

  return (
    <div className="preview-pane">
      <div className="preview-header">
        <h4>{file.path}</h4>
      </div>
      
      <div className="preview-content">
        {isHtml ? (
          <iframe
            srcDoc={file.content}
            title="Preview"
            className="preview-iframe"
          />
        ) : (
          <pre className="code-block">
            {file.content}
          </pre>
        )}
      </div>
    </div>
  );
};

export default PreviewPane;
