import React, { useState } from 'react';
import './App.css';
import { PromptForm, FilesList, PreviewPane } from './components';
import apiService from './services/apiService';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [generationResult, setGenerationResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async (prompt) => {
    setIsLoading(true);
    setError(null);
    setSelectedFile(null);

    try {
      const result = await apiService.generateApp(prompt);
      setGenerationResult(result);
      
      // Auto-select the first file if available
      if (result.files && result.files.length > 0) {
        setSelectedFile(result.files[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate app. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleDownload = async () => {
    if (!generationResult?.files) return;

    try {
      const projectName = 'generated-app';
      await apiService.downloadZip(generationResult.files, projectName);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download files. Please try again.');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>App Generator</h1>
        
        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <PromptForm 
          onGenerate={handleGenerate} 
          isLoading={isLoading} 
        />

        {generationResult && (
          <>
            <FilesList
              files={generationResult.files}
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              onDownload={handleDownload}
            />
            
            <PreviewPane file={selectedFile} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
