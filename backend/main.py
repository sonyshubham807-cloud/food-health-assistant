from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from google.cloud import firestore
import os
import json
import re
from datetime import datetime, timezone

app = Flask(__name__)
CORS(app, origins="*")

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def get_db():
    try:
        return firestore.Client()
    except Exception:
        return None

@app.route("/", methods=["GET"])
def root():
    return jsonify({"app": "The Living Ledger", "status": "running", "version": "1.0.0"})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()})

@app.route("/analyze", methods=["POST"])
def analyze_food():
    try:
        data = request.get_json(force=True)
        food_input = data.get("food", "").strip()
        meal_type = data.get("meal_type", "Breakfast")

        if not food_input:
            return jsonify({"error": "No food input provided"}), 400

        if not GEMINI_API_KEY:
            mock = {
                "food_name": food_input,
                "calories": 320,
                "protein_g": 18,
                "carbs_g": 42,
                "fat_g": 8,
                "fiber_g": 4,
                "sugar_g": 6,
                "sodium_mg": 180,
                "health_score": 8,
                "grade": "A",
                "health_tips": [
                    "Great protein source for sustained energy",
                    "Pair with vegetables to increase fiber intake"
                ],
                "benefits": ["High protein", "Good fiber content"],
                "warnings": [],
                "meal_type": meal_type,
                "serving_size": "1 serving"
            }
            return jsonify({"success": True, "data": mock})

        model = genai.GenerativeModel("gemini-pro")
        prompt = f"""
Analyze the nutritional content of: "{food_input}" for a {meal_type} meal.

Respond ONLY with valid JSON in this exact format, no markdown, no backticks, no extra text:
{{
  "food_name": "exact name of food",
  "calories": integer,
  "protein_g": float,
  "carbs_g": float,
  "fat_g": float,
  "fiber_g": float,
  "sugar_g": float,
  "sodium_mg": float,
  "health_score": integer from 1 to 10,
  "grade": "A, B, C, D or F",
  "health_tips": ["tip 1", "tip 2"],
  "benefits": ["benefit 1", "benefit 2"],
  "warnings": ["warning if any, else empty"],
  "meal_type": "{meal_type}",
  "serving_size": "estimated serving size"
}}
"""
        response = model.generate_content(prompt)
        raw = response.text.strip()
        raw = re.sub(r"```json|```", "", raw).strip()
        analysis = json.loads(raw)

        db = get_db()
        if db:
            db.collection("food_logs").add({
                "food": food_input,
                "meal_type": meal_type,
                "analysis": analysis,
                "timestamp": firestore.SERVER_TIMESTAMP
            })

        return jsonify({"success": True, "data": analysis})

    except json.JSONDecodeError:
        return jsonify({"error": "AI returned invalid format. Try again."}), 422
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/history", methods=["GET"])
def get_history():
    try:
        db = get_db()
        if not db:
            return jsonify({"success": True, "data": []})
        docs = db.collection("food_logs") \
            .order_by("timestamp", direction=firestore.Query.DESCENDING) \
            .limit(30) \
            .stream()
        history = []
        for doc in docs:
            d = doc.to_dict()
            ts = d.get("timestamp")
            history.append({
                "id": doc.id,
                "food": d.get("food"),
                "meal_type": d.get("meal_type", "Breakfast"),
                "analysis": d.get("analysis"),
                "timestamp": ts.isoformat() if hasattr(ts, "isoformat") else str(ts)
            })
        return jsonify({"success": True, "data": history})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/stats", methods=["GET"])
def get_stats():
    try:
        db = get_db()
        if not db:
            return jsonify({"total_logs": 0, "total_calories": 0, "avg_health_score": 0, "today_calories": 0, "today_protein": 0, "today_carbs": 0, "today_fat": 0})
        docs = db.collection("food_logs").limit(100).stream()
        total_logs = 0
        total_calories = 0
        total_score = 0
        today_calories = 0
        today_protein = 0
        today_carbs = 0
        today_fat = 0
        today = datetime.now(timezone.utc).date()
        for doc in docs:
            d = doc.to_dict()
            a = d.get("analysis", {})
            if a:
                cal = a.get("calories", 0)
                total_calories += cal
                total_score += a.get("health_score", 0)
                total_logs += 1
                ts = d.get("timestamp")
                if ts and hasattr(ts, "date") and ts.date() == today:
                    today_calories += cal
                    today_protein += a.get("protein_g", 0)
                    today_carbs += a.get("carbs_g", 0)
                    today_fat += a.get("fat_g", 0)
        return jsonify({
            "total_logs": total_logs,
            "total_calories": total_calories,
            "avg_health_score": round(total_score / total_logs, 1) if total_logs else 0,
            "today_calories": round(today_calories),
            "today_protein": round(today_protein),
            "today_carbs": round(today_carbs),
            "today_fat": round(today_fat)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/recipes", methods=["GET"])
def get_recipes():
    try:
        goal = request.args.get("goal", "balanced")
        if not GEMINI_API_KEY:
            return jsonify({"success": True, "data": [
                {"name": "Grilled Chicken Salad", "calories": 380, "time": "20 min", "difficulty": "Easy", "tags": ["High Protein", "Low Carb"]},
                {"name": "Avocado Toast", "calories": 290, "time": "10 min", "difficulty": "Easy", "tags": ["Healthy Fats", "Fiber"]},
                {"name": "Greek Yogurt Bowl", "calories": 220, "time": "5 min", "difficulty": "Easy", "tags": ["Probiotics", "Calcium"]}
            ]})
        model = genai.GenerativeModel("gemini-pro")
        prompt = f"""
Give 4 healthy recipe suggestions for goal: {goal}.
Return ONLY valid JSON array, no markdown:
[{{"name":"...", "calories": int, "time":"...", "difficulty":"Easy/Medium/Hard", "tags":["tag1","tag2"], "description":"one line"}}]
"""
        response = model.generate_content(prompt)
        raw = re.sub(r"```json|```", "", response.text.strip()).strip()
        recipes = json.loads(raw)
        return jsonify({"success": True, "data": recipes})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/insight", methods=["GET"])
def get_insight():
    try:
        today_cal = request.args.get("calories", 0)
        today_protein = request.args.get("protein", 0)
        meal_type = request.args.get("next_meal", "Lunch")
        if not GEMINI_API_KEY:
            return jsonify({"insight": f"Based on your meals so far, consider a protein-focused {meal_type} to maintain your metabolic rate steady until dinner.", "emoji": "⚡"})
        model = genai.GenerativeModel("gemini-pro")
        prompt = f"""
User has consumed {today_cal} calories and {today_protein}g protein today. 
Next meal is {meal_type}.
Give ONE short, actionable, personalized health insight in 1-2 sentences. 
Return ONLY JSON: {{"insight": "...", "emoji": "relevant emoji"}}
"""
        response = model.generate_content(prompt)
        raw = re.sub(r"```json|```", "", response.text.strip()).strip()
        result = json.loads(raw)
        return jsonify(result)
    except Exception as e:
        return jsonify({"insight": "Stay hydrated and aim for balanced macros in your next meal!", "emoji": "💧"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port, debug=False)
