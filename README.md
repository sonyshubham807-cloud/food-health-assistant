# FoodHealth AI — Food & Health Assistant

## Vertical
Health & Wellness

## Overview
An AI-powered food nutrition analyzer built with React, Flask, Google Gemini API, and deployed on Cloud Run.

## Features
- Instant nutritional analysis using Gemini AI
- Calorie, macro and health score breakdown
- Food history tracking with Firestore
- One-click quick suggestions

## How It Works
1. User enters a food item in the React frontend
2. Request hits Flask backend on Cloud Run
3. Gemini Pro analyzes nutrition and returns structured JSON
4. Results saved to Firestore and displayed to user

## Google Services Used
- Gemini API — AI nutritional analysis
- Cloud Run — Serverless backend hosting
- Firestore — Food log database
- Artifact Registry — Docker image storage
- Cloud Build — CI/CD pipeline

## Local Setup
```bash
cd backend && pip install -r requirements.txt
export GEMINI_API_KEY=your_key
python main.py
```

```bash
cd frontend && npm install && npm start
```

## Assumptions
- Single serving size assumed unless user specifies quantity
- Nutritional values are AI estimates, not medical advice
- Firestore in native mode required
