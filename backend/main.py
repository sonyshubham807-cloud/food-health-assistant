from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from google.cloud import firestore
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
db = firestore.Client()

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "timestamp": str(datetime.now())})

@app.route("/analyze", methods=["POST"])
def analyze_food():
    try:
        data = request.json
        food_input = data.get("food", "")
        if not food_input:
            return jsonify({"error": "No food input provided"}), 400

        model = genai.GenerativeModel("gemini-pro")
        prompt = f"""
        Analyze the nutritional content of: {food_input}
        
        Return a JSON response with exactly this structure:
        {{
          "food_name": "name of food",
          "calories": number,
          "protein_g": number,
          "carbs_g": number,
          "fat_g": number,
          "fiber_g": number,
          "health_score": number between 1-10,
          "health_tips": ["tip 1", "tip 2"],
          "benefits": ["benefit 1", "benefit 2"],
          "warnings": ["warning if any"]
        }}
        Only return valid JSON, no extra text.
        """
        response = model.generate_content(prompt)
        import json
        analysis = json.loads(response.text)

        doc_ref = db.collection("food_logs").add({
            "food": food_input,
            "analysis": analysis,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "user_id": data.get("user_id", "anonymous")
        })

        return jsonify({"success": True, "data": analysis, "log_id": doc_ref[1].id})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/history", methods=["GET"])
def get_history():
    try:
        docs = db.collection("food_logs")\
            .order_by("timestamp", direction=firestore.Query.DESCENDING)\
            .limit(20)\
            .stream()
        history = []
        for doc in docs:
            d = doc.to_dict()
            history.append({
                "id": doc.id,
                "food": d.get("food"),
                "analysis": d.get("analysis"),
                "timestamp": str(d.get("timestamp"))
            })
        return jsonify({"success": True, "data": history})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/stats", methods=["GET"])
def get_stats():
    try:
        docs = db.collection("food_logs").limit(50).stream()
        total_calories = 0
        total_logs = 0
        avg_health_score = 0
        for doc in docs:
            d = doc.to_dict()
            if d.get("analysis"):
                total_calories += d["analysis"].get("calories", 0)
                avg_health_score += d["analysis"].get("health_score", 0)
                total_logs += 1
        return jsonify({
            "total_logs": total_logs,
            "total_calories": total_calories,
            "avg_health_score": round(avg_health_score / total_logs, 1) if total_logs > 0 else 0
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)), debug=False)
