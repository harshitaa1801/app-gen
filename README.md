# 🤖 App Generator

An AI-powered application generator that creates complete app scaffolds from natural language prompts. Built with Django backend and React frontend, powered by Google's Gemini AI.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### 1. Backend Setup (Django API)

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env

# Run migrations
python manage.py migrate

# Start the Django server
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### 2. Frontend Setup (React UI)

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start the React development server
npm start
```

Frontend will be available at `http://localhost:3000`

## 🎯 Usage

1. **Open the frontend** in your browser: `http://localhost:3000`
2. **Enter a prompt** describing your desired application
3. **Click "Generate"** to create your app scaffold
4. **Browse generated files** in the file list
5. **Preview code** by clicking on any file
6. **Download ZIP** to get all files

## 📝 Example Input/Output

### Example Input:
```
Create a simple todo app with HTML frontend and Python backend
```

### Example Output:
```json
{
  "id": "abc123-def456-ghi789",
  "files": [
    {
      "path": "frontend/index.html",
      "content": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Todo App</title>\n    <style>\n        body { font-family: Arial, sans-serif; }\n        .todo-item { padding: 10px; border: 1px solid #ddd; margin: 5px 0; }\n    </style>\n</head>\n<body>\n    <h1>Todo App</h1>\n    <div id=\"todo-container\">\n        <input type=\"text\" id=\"todo-input\" placeholder=\"Add new todo...\">\n        <button onclick=\"addTodo()\">Add</button>\n        <div id=\"todo-list\"></div>\n    </div>\n    <script>\n        let todos = [];\n        function addTodo() {\n            const input = document.getElementById('todo-input');\n            todos.push(input.value);\n            renderTodos();\n            input.value = '';\n        }\n        function renderTodos() {\n            const list = document.getElementById('todo-list');\n            list.innerHTML = todos.map(todo => \n                `<div class=\"todo-item\">${todo}</div>`\n            ).join('');\n        }\n    </script>\n</body>\n</html>"
    },
    {
      "path": "backend/main.py",
      "content": "from flask import Flask, jsonify, request\nfrom flask_cors import CORS\n\napp = Flask(__name__)\nCORS(app)\n\n# In-memory storage for todos\ntodos = []\n\n@app.route('/api/todos', methods=['GET'])\ndef get_todos():\n    return jsonify(todos)\n\n@app.route('/api/todos', methods=['POST'])\ndef add_todo():\n    data = request.get_json()\n    todo = {\n        'id': len(todos) + 1,\n        'text': data['text'],\n        'completed': False\n    }\n    todos.append(todo)\n    return jsonify(todo)\n\n@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])\ndef delete_todo(todo_id):\n    global todos\n    todos = [t for t in todos if t['id'] != todo_id]\n    return jsonify({'success': True})\n\nif __name__ == '__main__':\n    app.run(debug=True, port=5000)"
    },
    {
      "path": "requirements.txt",
      "content": "Flask==2.3.3\nFlask-CORS==4.0.0"
    },
    {
      "path": "README.md",
      "content": "# Todo App\n\nA simple todo application with HTML frontend and Flask backend.\n\n## Setup\n\n1. Install dependencies:\n```bash\npip install -r requirements.txt\n```\n\n2. Run the backend:\n```bash\npython backend/main.py\n```\n\n3. Open `frontend/index.html` in your browser\n\n## Features\n\n- Add new todos\n- View todo list\n- Delete todos (backend API ready)\n- Responsive design\n\n## API Endpoints\n\n- `GET /api/todos` - Get all todos\n- `POST /api/todos` - Add new todo\n- `DELETE /api/todos/<id>` - Delete todo"
    }
  ],
  "meta": {
    "description": "Simple todo application",
    "technologies": ["HTML", "JavaScript", "Python", "Flask"],
    "instructions": "Run Flask backend with 'python backend/main.py' and open frontend/index.html in browser"
  }
}
```

## 🔧 Configuration

### Backend Environment (.env)
```bash
# AI Service Configuration
USE_MOCK=true                    # Set to 'false' to use real Gemini API
GEMINI_API_KEY=your_api_key_here # Required when USE_MOCK=false

# Django Configuration
SECRET_KEY=your-secret-key-here
DEBUG=True

```

### Frontend Environment (.env)
```bash
REACT_APP_API_URL=http://localhost:8000/api
```

## 📚 API Documentation

### Generate App Endpoint

**POST** `/api/generate/`

**Request:**
```json
{
  "prompt": "Create a weather dashboard with real-time data"
}
```

**Response:**
```json
{
  "id": "unique-generation-id",
  "files": [
    {
      "path": "relative/path/to/file",
      "content": "file content here"
    }
  ],
  "meta": {
    "description": "Brief description",
    "technologies": ["React", "Node.js"],
    "instructions": "How to run the app"
  }
}
```

## 🏗️ Project Structure

```
app-gen/
├── backend/                 # Django API
│   ├── api/
│   │   ├── views.py        # API endpoints
│   │   ├── services.py     # AI integration
│   │   └── serializers.py  # Request/response validation
│   ├── main/               # Django settings
│   ├── requirements.txt
│   └── manage.py
├── frontend/               # React UI
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   └── App.js         # Main app component
│   ├── package.json
│   └── public/
├── docker-compose-dev.yml  # Development docker setup
├── docker-compose-prod.yml # Production docker setup
├── Dockerfile
└── README.md              # This file
```

## 🔄 Development Workflow

1. **Start backend:** `cd backend && python manage.py runserver`
2. **Start frontend:** `cd frontend && npm start`
3. **Make changes** to components or API
4. **Test generation** with various prompts
5. **Check generated output** in browser

## 🧪 Example Prompts to Try

- `"Create a simple blog with user authentication"`
- `"Build a weather dashboard with real-time data"`
- `"Make a portfolio website with dark mode"`
- `"Create a chat application with WebSocket"`
- `"Build a URL shortener service"`
- `"Create a task management app with teams"`

## 🐳 Docker Deployment

### Development
```bash
docker-compose -f docker-compose-dev.yml up
```

### Production
```bash
docker-compose -f docker-compose-prod.yml up
```


Made with ❤️ for developers who want to quickly scaffold applications using AI.
