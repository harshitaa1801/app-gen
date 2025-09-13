const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ApiService {
  /**
   * Generate app scaffold from user prompt
   * @param {string} prompt - User's prompt for app generation
   * @returns {Promise<Object>} Generation result with id, files, and meta
   */
  async generateApp(prompt) {
    try {
      const response = await fetch(`${API_BASE_URL}/generate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating app:', error);
      throw error;
    }
  }

  /**
   * Check API health
   * @returns {Promise<Object>} Health status
   */
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health/`);
      return await response.json();
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }

  /**
   * Get API information
   * @returns {Promise<Object>} API info
   */
  async getApiInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/info/`);
      return await response.json();
    } catch (error) {
      console.error('Error getting API info:', error);
      throw error;
    }
  }

  /**
   * Create and download a zip file from generated files
   * @param {Array} files - Array of file objects with path and content
   * @param {string} projectName - Name for the zip file
   */
  async downloadZip(files, projectName = 'generated-app') {
    try {
      // Import JSZip dynamically
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Add each file to the zip
      files.forEach(file => {
        zip.file(file.path, file.content);
      });

      // Generate the zip file
      const content = await zip.generateAsync({ type: 'blob' });

      // Create download link
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating zip:', error);
      throw error;
    }
  }

  /**
   * Get file type from file path
   * @param {string} filePath - Path to the file
   * @returns {string} File type
   */
  getFileType(filePath) {
    const extension = filePath.split('.').pop()?.toLowerCase();
    
    const typeMap = {
      'html': 'html',
      'htm': 'html',
      'css': 'css',
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'json': 'json',
      'md': 'markdown',
      'txt': 'text',
      'yml': 'yaml',
      'yaml': 'yaml',
      'xml': 'xml',
      'svg': 'xml',
    };

    return typeMap[extension] || 'text';
  }

  /**
   * Check if file should be rendered in iframe
   * @param {string} filePath - Path to the file
   * @returns {boolean} Whether file should be rendered in iframe
   */
  shouldRenderInIframe(filePath) {
    const fileType = this.getFileType(filePath);
    return fileType === 'html';
  }
}

export default new ApiService();
