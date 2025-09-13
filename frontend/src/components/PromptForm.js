import React, { useState } from 'react';
import './PromptForm.css';

const PromptForm = ({ onGenerate, isLoading = false }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate(prompt.trim());
  };

  return (
    <div className="prompt-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your app..."
          className="prompt-input"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="generate-button"
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </form>
    </div>
  );
};

export default PromptForm;
