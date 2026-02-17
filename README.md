# BharatAI LearnOS

> An AI-powered learning assistant for Indian students — making technical education accessible in multiple languages

## 🚀 Live Demo

**[Try BharatAI LearnOS →](https://bharatai-i7yp.onrender.com/)**

---

## Overview

BharatAI LearnOS is an intelligent tutoring platform designed to help Indian students learn programming and technical concepts more effectively. It breaks down complex topics into simple explanations, helps debug code with detailed guidance, and generates personalized study plans — all available in English and Indian regional languages.

Built for the **AI for Bharat Hackathon**, this project addresses the language barriers and accessibility challenges faced by students in tier-2 and tier-3 cities across India.

## Features

### 🎓 AI Explainer
Explains technical concepts, code snippets, and programming topics in simple language. Adapts to your knowledge level (beginner/intermediate/advanced).

### 🐛 Code Debugging Mentor
Analyzes your code, identifies errors, explains why they occurred, and provides corrected code with learning points — not just fixes, but understanding.

### 📄 PDF Summarizer + Quiz Generator
Upload lecture notes or textbooks (up to 50 pages), get concise summaries, and auto-generated quiz questions for self-assessment.

### 📅 Personalized Study Planner
Creates customized day-by-day study schedules based on your goals, available time, and current skill level.

### 🌐 Multilingual Support
All features work in English, Hindi, Tamil, and Telugu. Switch languages anytime during your learning session.

### 📱 Low-Bandwidth Mode
Optimized for 2G/3G connections with reduced data usage and simplified UI — accessible even with slow internet.

## Tech Stack

**Frontend**
- React 18 with Vite
- Tailwind CSS
- Axios for API calls
- React Markdown for formatted responses

**Backend**
- Node.js + Express
- pdf-parse for document processing
- node-cache for response caching

**AI Services**
- OpenAI GPT-4 Turbo (primary LLM)
- Google Translate API (multilingual support)

**Deployment**
- Frontend: Vercel/Netlify
- Backend: Render
- Version Control: GitHub

## How to Run Locally

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- OpenAI API key
- Google Translate API key (optional)

### Setup

1. Clone the repository
```bash
git clone https://github.com/sarthakm008/BharatAI.git
cd BharatAI
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file in the root directory
```env
OPENAI_API_KEY=your_openai_api_key
GOOGLE_TRANSLATE_API_KEY=your_translate_api_key
PORT=3000
```

4. Start the development server
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

### Running Frontend and Backend Separately

If using separate frontend/backend setup:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## Architecture

```
┌─────────────┐
│   React UI  │  (User Interface)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Express    │  (API Server)
│  Backend    │  - Routes requests
└──────┬──────┘  - Manages prompts
       │         - Handles translation
       ▼
┌─────────────┐
│  AI Layer   │  (LLM Integration)
│  - OpenAI   │  - Generates explanations
│  - Gemini   │  - Debugs code
└─────────────┘  - Creates summaries
```

**Key Components:**
- **Frontend**: Responsive web app with language selector and feature modules
- **Backend API**: RESTful endpoints for explain, debug, summarize, and plan features
- **AI Inference**: Prompt engineering layer that adapts responses based on user context
- **Translation Module**: Converts between English and regional languages while preserving technical terms

## Hackathon Context

This project was built for the **AI for Bharat Hackathon** with the goal of making technical education more accessible to Indian students who face language barriers and lack personalized learning support.

**Problem Addressed:**
- Most technical content is in English, creating barriers for vernacular medium students
- Quality tutoring is expensive and inaccessible in smaller cities
- Students waste time debugging simple errors without guidance
- Generic online courses don't adapt to individual learning needs

**Solution:**
An AI-powered platform that explains concepts in regional languages, provides patient debugging help, and creates personalized study plans — all optimized for Indian internet infrastructure.

**Hackathon Timeline:** 48 hours  
**Focus:** MVP with core features, multilingual support, and mobile-friendly design

## Future Scope

- **More Languages**: Add Bengali, Marathi, Kannada, Malayalam, Gujarati
- **Voice Interface**: Full speech-to-text and text-to-speech for hands-free learning
- **Mobile Apps**: Native Android/iOS apps with offline mode
- **Adaptive Learning**: Track progress and automatically adjust difficulty
- **Community Features**: Peer learning, study groups, mentor matching
- **Code Execution**: Live coding sandbox for practice
- **Exam Prep Modules**: Specialized content for GATE, JEE, coding interviews
- **Integration**: Connect with educational institutions and LMS platforms

## Project Structure

```
BharatAI/
├── public/           # Static assets
├── src/              # Frontend source code
├── index.js          # Backend server
├── package.json      # Dependencies
├── requirement.md    # Product requirements
├── design.md         # System design document
└── README.md         # This file
```

## Contributing

This is a hackathon project, but contributions are welcome! Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Improve documentation

## Team

**Author:** Sarthak Madaan 
**GitHub:** [@sarthakm008](https://github.com/sarthakm008)

Built with ❤️ for Indian students during the AI for Bharat Hackathon

## License

MIT License - feel free to use this project for learning and development.

---

**Note:** This is an MVP built during a 48-hour hackathon. Some features may be in early stages. Feedback and suggestions are appreciated!
