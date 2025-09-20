/**
 * WARNING: Storing an API key in localStorage is not a secure practice for production.
 * This is intended for a local demo or development environment only.
 */
const url = "http://127.0.0.1:5000";
let endPoint = "/get-initial-data";

/**
 * Retrieves the API key from local storage or prompts the user for it.
 * @returns {string} The Gemini API key.
 */
function getApiKey() {
  let key = localStorage.getItem("geminiApiKey");
  if (!key) {
    key = prompt("Please enter your Gemini API key:");
    if (key) {
      localStorage.setItem("geminiApiKey", key);
    } else {
      throw new Error("API key is required to use this application.");
    }
  }
  return key;
}

/**
 * Compiles the given DSL script into a user-friendly HTML form using the Gemini API.
 * @param {string} dslScript - The DSL script to be compiled.
 * @param {string} apiKey - The Gemini API key.
 */
async function invokeAI(dslScript, apiKey) {
  const outputContainer = document.getElementById("output");

  // Remove any previous submit listeners to avoid duplicates
  const newOutputContainer = outputContainer.cloneNode(true);
  outputContainer.parentNode.replaceChild(newOutputContainer, outputContainer);

  // Intercept all form submissions inside outputContainer to prevent default GET
  newOutputContainer.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();
    },
    true
  );

  // Set loading state with a spinner
  newOutputContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center py-10">
            <div class="border-4 border-gray-200 border-t-blue-500 rounded-full w-12 h-12 animate-[spin_1s_linear_infinite]"></div>
            <p class="mt-4 text-gray-700">Compiling frontend... <span id="compile-time" class="font-mono text-sm"></span></p>
        </div>
    `;

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  try {
    const prompt = `
You are a frontend compiler. 
Interpret the following DSL and generate a user-friendly HTML form. 
Include CSS for layout and JavaScript for form submission to the endpoint. 
Endpoint URL must be dynamically constructed in JavaScript before making the fetch call baseUrl is avaliable in url variable. 
The generated code should be placed inside a <div> element. The output must contain only a single <div> element.

DSL:
${dslScript}
`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const startTime = Date.now();
    const geminiResponse = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const endTime = Date.now();
    const compileTime = (endTime - startTime) / 1000;

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      throw new Error(
        errorData.error || "Failed to get a response from the Gemini API."
      );
    }

    const result = await geminiResponse.json();
    const generatedHtml = result.candidates[0].content.parts[0].text;

    // Isolate HTML and JavaScript from generatedHtml
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    let scripts = [];
    let htmlOnly = generatedHtml.replace(
      scriptRegex,
      (match, scriptContent) => {
        scripts.push(scriptContent);
        return "";
      }
    );

    // Create a new div for the HTML content
    const htmlDiv = document.createElement("div");
    htmlDiv.className = "w-full";
    htmlDiv.innerHTML = `
            <h2 class="text-lg text-gray-600 mb-4 text-center">Compilation Time: <span class="font-bold text-blue-500">${compileTime.toFixed(
              2
            )}s</span></h2>
            ${htmlOnly}
        `;

    // Remove previous content and append the new div
    newOutputContainer.innerHTML = "";
    newOutputContainer.appendChild(htmlDiv);

    // Dynamically create and append script tags so browser executes them
    scripts.forEach((scriptContent) => {
      const scriptEl = document.createElement("script");
      scriptEl.type = "text/javascript";
      scriptEl.defer = false;
      scriptEl.text = scriptContent;
      document.body.appendChild(scriptEl);
    });
  } catch (error) {
    newOutputContainer.innerHTML = `
            <div class="p-4 bg-red-100 rounded-lg text-red-700">
                <p class="font-semibold">Error:</p>
                <p>${error.message}.</p>
            </div>
        `;
  }
}

/**
 * A reusable function to make fetch calls to a specified URL.
 * @param {string} url - The URL to fetch.
 * @returns {Promise<any>} The parsed JSON response.
 */
async function fetchAPI(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data from ${url}. Is the backend running?`
    );
  }
  return response.json();
}

/**
 * Fetches the initial DSL from the backend and then invokes the AI compiler.
 */
async function fetchAndInvoke() {
  try {
    const apiKey = getApiKey();
    // Step 1: Fetch the DSL from the backend using the reusable method
    const dslData = await fetchAPI(url + endPoint);
    const dslScript = dslData.script;

    // Step 2: Compile the DSL and display the result
    invokeAI(dslScript, apiKey);
  } catch (error) {
    document.getElementById("output").innerHTML = `
            <div class="p-4 bg-red-100 rounded-lg text-red-700">
                <p class="font-semibold">Error:</p>
                <p>${error.message}.</p>
            </div>
        `;
  }
}

// Invoke the function on page load
document.addEventListener("DOMContentLoaded", fetchAndInvoke);
