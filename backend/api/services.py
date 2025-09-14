import os
import json
import uuid
import logging
from typing import Dict, Any

from backend.api.prompt import SYSTEM_PROMPT_FOR_APP_GEN
import google.generativeai as genai
from django.conf import settings

logger = logging.getLogger(__name__)


def call_genai_system(user_prompt: str) -> Dict[str, Any]:
    """
    Either call the real Gemini LLM or return a mock response.
    
    Args:
        user_prompt: The user's prompt for generating app scaffold
        
    Returns:
        Dictionary containing generated files and metadata
    """
    # Check if we should use mock response
    use_mock = os.getenv("USE_MOCK", "true").lower() == "true"
    
    if use_mock:
        # Simple mock: returns one frontend html + backend readme
        return {
            "files": [
                {
                    "path": "frontend/index.html", 
                    "content": "<!doctype html><html><body><h1>Mock App</h1><p>Generated from: {}</p></body></html>".format(user_prompt[:50])
                },
                {
                    "path": "README.md", 
                    "content": "# Mock Generated App\n\nThis app was generated from the prompt: '{}'\n\n## Getting Started\n\n1. Install dependencies\n2. Run locally\n3. Deploy".format(user_prompt)
                },
                {
                    "path": "backend/main.py",
                    "content": "# Generated backend for: {}\n\ndef main():\n    print('Hello from generated app!')\n\nif __name__ == '__main__':\n    main()".format(user_prompt[:30])
                }
            ],
            "meta": {
                "note": "mock response",
                "prompt": user_prompt,
                "generated_at": "2024-01-01T00:00:00Z"
            }
        }
    
    # Real Gemini API call
    try:
        # Configure Gemini API
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.error("GEMINI_API_KEY not found in environment variables")
            raise ValueError("Gemini API key not configured")
        
        genai.configure(api_key=api_key)
        
        # Initialize the model
        model = genai.GenerativeModel('gemini-pro')
        
        # Create system prompt for structured response
        system_prompt = SYSTEM_PROMPT_FOR_APP_GEN
        
        # Combine system prompt with user prompt
        full_prompt = f"{system_prompt}\n\nUser Request: {user_prompt}"
        
        # Generate content
        response = model.generate_content(
            full_prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.2,
                max_output_tokens=4000,
            )
        )
        
        # Extract text from response
        response_text = response.text.strip()
        
        # Try to parse JSON from response
        try:
            # Remove any markdown code blocks if present
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            response_text = response_text.strip()
            
            # Parse JSON
            result = json.loads(response_text)
            
            # Validate structure
            if "files" not in result:
                raise ValueError("Response missing 'files' key")
            
            # Add metadata if missing
            if "meta" not in result:
                result["meta"] = {
                    "description": "Generated application scaffold",
                    "generated_by": "Gemini Pro"
                }
            
            # Add generation timestamp
            result["meta"]["generated_at"] = "2024-01-01T00:00:00Z"  # You can use datetime.now().isoformat()
            result["meta"]["prompt"] = user_prompt
            
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from Gemini response: {e}")
            logger.error(f"Raw response: {response_text}")
            
            # Fallback: wrap entire text as one file
            return {
                "files": [
                    {
                        "path": "generated_output.txt", 
                        "content": response_text
                    }
                ], 
                "meta": {
                    "raw": True,
                    "note": "Could not parse as JSON, returning raw response",
                    "prompt": user_prompt
                }
            }
            
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")
        
        # Return error response
        return {
            "files": [
                {
                    "path": "error.txt",
                    "content": f"Error generating content: {str(e)}"
                }
            ],
            "meta": {
                "error": True,
                "message": str(e),
                "prompt": user_prompt
            }
        }
