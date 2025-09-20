from flask import Flask, jsonify
from flask_cors import CORS

# This is a simple backend that provides the DSL script.
# It does not communicate with the Gemini API directly.

app = Flask(__name__)
# Enable CORS to allow the frontend to make requests.
CORS(app)

# A simple in-memory "database" for demonstration purposes.
# In a real application, you would use a proper database.
users = {}

# The endpoint for the frontend to get the DSL script.
@app.route('/get-initial-data', methods=['GET'])
def get_dsl():
    """
    Returns the declarative script (DSL) for the frontend to use.
    """
    dsl_script = {
        "script": "form(Product Review): rating(1-5), comments  -> /api/comments"
    }
    return jsonify(dsl_script)

@app.route('/<path:any_path>', methods=['POST'])
def catch_all_post(any_path):
    """
    Catch-all POST endpoint that returns the received JSON data as a string.
    """
    try:
        return jsonify('i_am_a_response')
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    # Run the server on port 5000
    app.run(debug=True, port=5000)
