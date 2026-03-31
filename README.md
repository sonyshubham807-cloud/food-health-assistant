# The Living Ledger — Food & Health Assistant

## Vertical
Health & Wellness

## Overview
A premium AI-powered meal logging and nutrition analysis web app with a professional dashboard UI, Gemini AI analysis, and real-time health insights.

## Features
- AI-powered food nutrition analysis (Gemini Pro)
- Real-time calorie and macro tracking
- Health score grading (A+ to F)
- Meal type logging (Breakfast, Lunch, Dinner, Snacks)
- Personalized AI insights
- Recipe explorer by health goal
- Persistent food history (Firestore)

## Google Services Used
- Gemini API — AI nutritional analysis
- Cloud Run — Serverless backend
- Firestore — Food log database
- Cloud Build — Docker image builds
- Artifact Registry — Image storage

## Architecture
React Frontend → Flask Backend (Cloud Run) → Gemini API + Firestore

## Local Development
### Backend
```bash
cd backend
pip install -r requirements.txt
export GEMINI_API_KEY=your_key
python main.py
```

### Frontend
```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8080 npm start
```

## Assumptions
- Single serving unless user specifies quantity
- Gemini Pro estimates; not medical advice
- Firestore in Native mode
- Google Cloud project with billing enabled
