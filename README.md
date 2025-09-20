## Version
Current release: `v1.0.0`

# AI-as-a-Frontend Compiler

This project is a prototype of a novel architectural paradigm where a web frontend is not a static artifact but is dynamically generated at runtime by a Large Language Model (LLM). It demonstrates a system that compiles a complete, functional user interface—including HTML, CSS, and JavaScript—from a simple, declarative Domain-Specific Language (DSL).

The primary purpose of this project is to evaluate the feasibility of using an LLM as a core compiler for frontend development.

## Core Components

The system is composed of three main tiers:

- **Backend:** A lightweight Python server that serves high-level, declarative DSL strings to the frontend client. It contains no UI logic.
- **Frontend Client:** An HTML shell with a JavaScript client that acts as an "intelligent agent." It fetches the DSL from the backend, formulates a prompt for the LLM, and injects the dynamically generated UI code directly into the page.
- **LLM Compiler:** A cloud-based LLM (e.g., the Gemini API) that serves as the compiler, interpreting the DSL and generating the complete frontend code in a single response.

## How It Works

The UI compilation process is executed in a series of sequential steps:

1. The frontend client makes a request to the backend to get a DSL string.
2. The backend responds with a JSON object containing the DSL (e.g., `form(Customer Feedback): page1: name, company -> Next; page2: rating, comments -> Submit`).
3. The frontend client constructs a prompt and sends it to the LLM API.
4. The LLM generates a single-file HTML document containing all the required HTML, CSS, and JavaScript.
5. The client receives the code and injects it into the page, rendering the UI instantly.

## How to Run

To run the full prototype, you need to start the backend server and then open the frontend files in your browser.

### Prerequisites

- **Python:** Ensure Python 3.x is installed on your system.
- **Flask & Flask-CORS:** These Python libraries are required for the backend.

Install dependencies:
```sh
pip install Flask Flask-Cors
```

### Step 1: Run the Backend

Navigate to the directory containing `backend.py` and execute it from your terminal:

```sh
python backend.py
```

The server will start on [http://127.0.0.1:5000](http://127.0.0.1:5000).

### Step 2: Run the Frontend

The frontend is a static web page. Simply open `index.html` in your web browser. The JavaScript client will automatically connect to the running backend and begin the compilation process.

### Step 3: Update DSL 

Update DSL in backend.py 'dsl_script' variable

## DSL Examples

The compiler can handle a variety of DSL prompts, including:

- **Static Display:**
  ```
  display(Backend Status): message: 'The backend is now in a simplified state.'
  ```
- **Simple Form:**
  ```
  form(User Registration): firstname, lastname, email, password -> /api/register
  ```
- **Multi-page Form:**
  ```
  form(Customer Feedback): page1: name, company -> Next; page2: rating, comments -> Submit -> /api/submit-survey
  ```