from flask import Flask, request, jsonify, render_template
import google.generativeai as genai

app = Flask(__name__)

# Gemini API Key
genai.configure(api_key="AQ.Ab8RN6KcO_Kvz4n70wnQItFNk5gUq6WHG5aWQokrMw_0Aqjl_w")

model = genai.GenerativeModel("gemini-2.5-flash")

SYSTEM_PROMPT = """
You are an expert Career Guidance Counselor named "CareerCompass AI".

Your approach:
1. Ask smart questions about interests, strengths, subjects, and goals.
2. Give personalized career advice.
3. Suggest specific careers with reasons.
4. Mention skills to learn and courses to take.
5. Be encouraging and realistic.

You cover all career domains:
- Technology
- Medicine & Healthcare
- Engineering
- Arts & Design
- Business & Finance
- Law & Civil Services
- Education & Research
- Sports & Fitness
- Media & Journalism
- Entrepreneurship

Keep responses concise but impactful.
"""

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        user_message = data.get("message", "")

        prompt = f"""
        {SYSTEM_PROMPT}

        User: {user_message}
        """

        response = model.generate_content(prompt)

        return jsonify({
            "reply": response.text
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True)