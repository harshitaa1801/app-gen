import React from 'react';
import './FilesList.css';

const FilesList = ({ files = [], onFileSelect, selectedFile, onDownload }) => {
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className="files-list">
      <div className="files-header">
        <h3>Files ({files.length})</h3>
        <button onClick={onDownload}>Download ZIP</button>
      </div>
      
      <div className="files-container">
        {files.map((file) => (
          <div 
            key={file.path}
            className={`file-item ${selectedFile?.path === file.path ? 'selected' : ''}`}
            onClick={() => onFileSelect(file)}
          >
            {file.path}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilesList;
