# System Design Document

## 1. Architecture Overview

BharatAI LearnOS follows a three-tier architecture optimized for rapid hackathon development:

**Presentation Layer**: React-based responsive web application that works across desktop and mobile browsers. Handles user interactions, language selection, and real-time response streaming.

**Application Layer**: Node.js/Express API server that orchestrates requests, manages prompt engineering, handles translation, and coordinates between different AI services.

**AI Layer**: Integration with LLM APIs (OpenAI/Anthropic/Gemini) for core intelligence, supplemented by specialized services for translation and document processing.

The system is stateless for simplicity, with minimal session management. All processing happens server-side to keep the client lightweight. The architecture prioritizes fast iteration over scalability for the MVP phase.

## 2. System Components

### 2.1 Frontend (React SPA)

**Responsibilities**:
- Render responsive UI with mobile-first design
- Handle user input (text, file uploads, voice)
- Manage language selection and preferences
- Display streaming responses with syntax highlighting
- Implement low-bandwidth mode with conditional rendering
- Cache common responses in localStorage

**Key Features**:
- Single-page application with client-side routing
- Markdown rendering for formatted responses
- Code syntax highlighting (Prism.js or similar)
- File upload with drag-and-drop
- Progressive Web App (PWA) capabilities for offline access
- Network detection for auto-switching to low-bandwidth mode

### 2.2 Backend API (Node.js/Express)

**Responsibilities**:
- Route requests to appropriate handlers
- Implement rate limiting and request validation
- Manage API keys and external service integration
- Handle error responses and logging
- Implement response caching (Redis or in-memory)
- Coordinate multi-step workflows (e.g., translate → process → translate back)

**Key Features**:
- RESTful API design
- Request/response logging for debugging
- CORS configuration for frontend access
- Environment-based configuration
- Graceful error handling with user-friendly messages

### 2.3 AI Inference Layer

**Responsibilities**:
- Interface with LLM APIs (OpenAI GPT-4, Anthropic Claude, or Google Gemini)
- Implement prompt templates for different modes
- Handle streaming responses
- Manage context windows and token limits
- Implement fallback logic if primary API fails

**Key Features**:
- Prompt template system with variable injection
- Token counting and truncation
- Response parsing and formatting
- Temperature and parameter tuning per use case
- API response caching for identical queries

### 2.4 Document Processing Module

**Responsibilities**:
- Extract text from PDF files
- Chunk large documents for processing
- Generate summaries using extractive and abstractive methods
- Create quiz questions based on content
- Handle various PDF formats and encodings

**Key Features**:
- PDF text extraction (pdf-parse or similar library)
- Text chunking with overlap for context preservation
- Summary generation with key point extraction
- MCQ generation with distractors
- Support for tables and structured content

### 2.5 Language Translation Module

**Responsibilities**:
- Translate user input from regional languages to English
- Translate AI responses from English to target language
- Preserve technical terms and code snippets during translation
- Handle mixed-language input (code + natural language)

**Key Features**:
- Integration with Google Translate API or similar
- Technical term dictionary to prevent mistranslation
- Code block detection and preservation
- Language detection for auto-switching
- Caching of common translations

### 2.6 Voice Interface Module (Stretch Goal)

**Responsibilities**:
- Convert speech to text for user input
- Convert text to speech for AI responses
- Handle multiple languages and accents
- Manage audio streaming and buffering

**Key Features**:
- Web Speech API or Google Speech-to-Text
- Language-specific voice models
- Audio compression for bandwidth efficiency
- Optional feature flag for enabling/disabling

## 3. Data Flow

### 3.1 Explain Feature Flow

1. User types question in Hindi: "React में useState क्या है?"
2. Frontend sends POST to `/api/explain` with text and language="hi"
3. Backend detects language, translates to English: "What is useState in React?"
4. Backend constructs prompt with context: "You are a patient tutor. Explain this concept to a beginner..."
5. Backend calls LLM API with prompt
6. LLM returns explanation in English
7. Backend translates response back to Hindi
8. Backend streams response to frontend
9. Frontend renders formatted response with code examples

### 3.2 Debug Feature Flow

1. User pastes Python code with error message
2. Frontend sends POST to `/api/debug` with code, error, and language
3. Backend constructs debugging prompt with code and error
4. Backend calls LLM API with specialized debugging instructions
5. LLM analyzes code, identifies issue, generates explanation and fix
6. Backend formats response with diff highlighting
7. Backend translates explanation to user's language (keeps code in English)
8. Frontend displays side-by-side original and fixed code

### 3.3 PDF Summarize Flow

1. User uploads PDF file (5MB, 30 pages)
2. Frontend sends multipart POST to `/api/summarize`
3. Backend extracts text from PDF using pdf-parse
4. Backend chunks text into 3-4 segments (token limit consideration)
5. Backend sends each chunk to LLM with summarization prompt
6. LLM returns summary for each chunk
7. Backend combines summaries into coherent final summary
8. Backend generates 5 quiz questions based on summary
9. Backend translates summary and questions to user's language
10. Frontend displays summary with collapsible sections and quiz interface

### 3.4 Study Plan Flow

1. User fills form: Goal="Learn DSA", Duration="8 weeks", Hours="2/day", Level="Beginner"
2. Frontend sends POST to `/api/plan` with parameters
3. Backend constructs detailed prompt with constraints
4. Backend calls LLM API with planning instructions
5. LLM generates week-by-week breakdown with topics and resources
6. Backend formats response as structured JSON
7. Backend translates plan to user's language
8. Frontend renders interactive calendar view with daily tasks

## 4. Tech Stack

### Frontend
- **React 18**: Component-based UI, hooks for state management
- **Vite**: Fast build tool, better than CRA for hackathons
- **Tailwind CSS**: Rapid styling, responsive utilities
- **Axios**: HTTP client with interceptors
- **React Markdown**: Render formatted responses
- **Prism.js**: Code syntax highlighting

**Why**: React ecosystem is mature, Vite enables fast iteration, Tailwind speeds up styling without custom CSS.

### Backend
- **Node.js 18+**: JavaScript everywhere, fast for I/O-bound tasks
- **Express.js**: Minimal, flexible, well-documented
- **pdf-parse**: Pure JavaScript PDF text extraction
- **node-cache**: In-memory caching for responses
- **dotenv**: Environment configuration
- **cors**: Handle cross-origin requests

**Why**: Node.js allows code sharing with frontend, Express is quick to set up, pdf-parse has no external dependencies.

### AI Services
- **OpenAI GPT-4 Turbo** (Primary): Best reasoning, good multilingual support
- **Google Gemini** (Fallback): Free tier, good for hackathons
- **Google Translate API**: Reliable translation with technical term handling

**Why**: GPT-4 Turbo offers best quality for complex explanations and debugging. Gemini provides free fallback. Google Translate is industry standard.

### Infrastructure
- **Vercel/Netlify**: Frontend hosting with CDN
- **Railway/Render**: Backend hosting with free tier
- **GitHub**: Version control and collaboration

**Why**: Zero-config deployment, free tiers sufficient for hackathon, automatic HTTPS.

### Development Tools
- **ESLint + Prettier**: Code quality and formatting
- **Postman**: API testing
- **VS Code**: IDE with extensions

## 5. API Design

### 5.1 POST /api/explain

**Description**: Explains technical concepts or code

**Request**:
```json
{
  "query": "What is a closure in JavaScript?",
  "language": "hi",
  "level": "beginner",
  "context": "optional previous conversation"
}
```

**Response**:
```json
{
  "success": true,
  "explanation": "क्लोजर एक फंक्शन है जो...",
  "examples": [
    {
      "code": "function outer() { ... }",
      "description": "यह उदाहरण दिखाता है..."
    }
  ],
  "relatedTopics": ["scope", "lexical environment"],
  "responseTime": 3.2
}
```

### 5.2 POST /api/debug

**Description**: Debugs code and explains errors

**Request**:
```json
{
  "code": "def factorial(n):\n  return n * factorial(n-1)",
  "error": "RecursionError: maximum recursion depth exceeded",
  "language": "en",
  "programmingLanguage": "python"
}
```

**Response**:
```json
{
  "success": true,
  "analysis": {
    "errorType": "RecursionError",
    "rootCause": "Missing base case in recursive function",
    "explanation": "Your function calls itself infinitely..."
  },
  "fix": {
    "code": "def factorial(n):\n  if n <= 1:\n    return 1\n  return n * factorial(n-1)",
    "changes": "Added base case: if n <= 1, return 1",
    "explanation": "The base case stops recursion when n reaches 1"
  },
  "learningPoints": [
    "Every recursive function needs a base case",
    "Base case prevents infinite recursion"
  ]
}
```

### 5.3 POST /api/summarize

**Description**: Summarizes PDF and generates quiz

**Request**: Multipart form data
- `file`: PDF file (max 10MB)
- `language`: Target language code
- `includeQuiz`: Boolean

**Response**:
```json
{
  "success": true,
  "summary": {
    "title": "Data Structures and Algorithms",
    "keyPoints": [
      "Arrays store elements in contiguous memory",
      "Linked lists use pointers for dynamic size"
    ],
    "sections": [
      {
        "heading": "Arrays",
        "content": "Arrays are..."
      }
    ]
  },
  "quiz": [
    {
      "question": "What is the time complexity of array access?",
      "options": ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
      "correctAnswer": 0,
      "explanation": "Array access is O(1) because..."
    }
  ],
  "pageCount": 30,
  "processingTime": 25.4
}
```

### 5.4 POST /api/plan

**Description**: Generates personalized study plan

**Request**:
```json
{
  "goal": "Learn React and build a project",
  "duration": 4,
  "durationUnit": "weeks",
  "hoursPerDay": 2,
  "currentLevel": "beginner",
  "language": "en"
}
```

**Response**:
```json
{
  "success": true,
  "plan": {
    "title": "4-Week React Learning Plan",
    "totalHours": 56,
    "weeks": [
      {
        "week": 1,
        "focus": "JavaScript Fundamentals",
        "days": [
          {
            "day": 1,
            "topics": ["ES6 syntax", "Arrow functions", "Destructuring"],
            "tasks": [
              "Watch: ES6 tutorial (30 min)",
              "Practice: 10 ES6 exercises (60 min)",
              "Read: MDN arrow functions (30 min)"
            ],
            "resources": [
              "https://javascript.info/arrow-functions"
            ]
          }
        ]
      }
    ],
    "milestones": [
      "Week 1: Complete JS fundamentals",
      "Week 4: Deploy portfolio project"
    ]
  }
}
```

### 5.5 GET /api/health

**Description**: Health check endpoint

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-03-15T10:30:00Z",
  "services": {
    "llm": "operational",
    "translation": "operational"
  }
}
```

## 6. Prompt Engineering Strategy

### 6.1 Tutoring Mode Prompt Template

```
You are a patient and encouraging AI tutor for Indian students learning technology.

Context:
- Student's level: {level}
- Student's language: {language}
- Topic: {topic}

Instructions:
- Explain concepts in simple, clear language
- Use real-world analogies relevant to Indian context
- Provide code examples with comments
- Break down complex ideas into steps
- Encourage the student
- If explaining in English, avoid idioms and complex vocabulary

Student's question: {query}

Provide a clear explanation with examples.
```

### 6.2 Debugging Mode Prompt Template

```
You are an expert code mentor helping a student debug their code.

Code:
{code}

Error:
{error}

Programming Language: {language}

Instructions:
1. Identify the error and its location
2. Explain WHY the error occurred (root cause)
3. Provide the corrected code
4. Explain what you changed and why
5. Share 1-2 learning points to prevent similar errors

Be specific and educational, not just prescriptive.
```

### 6.3 Summarization Mode Prompt Template

```
You are summarizing educational content for a student.

Content:
{document_text}

Instructions:
- Extract the main concepts and key points
- Organize information logically
- Keep technical terms but explain them
- Aim for 20-30% of original length
- Use bullet points for clarity

Provide a structured summary.
```

### 6.4 Planner Mode Prompt Template

```
You are creating a personalized study plan for a student.

Goal: {goal}
Duration: {duration} {unit}
Available time: {hours} hours per day
Current level: {level}

Instructions:
- Break down the goal into weekly themes
- Create daily tasks (1-2 hours each)
- Include specific topics, not vague advice
- Suggest free, accessible resources
- Make the plan realistic and achievable
- Include practice exercises and projects
- Add milestones for motivation

Generate a detailed day-by-day study plan in JSON format.
```

### 6.5 Prompt Optimization Techniques

**Context Injection**: Include user's level and language in every prompt to personalize responses.

**Few-Shot Examples**: For quiz generation, include 2-3 example questions in the prompt to guide format.

**Constraint Specification**: Explicitly state response length limits (e.g., "Explain in 200 words or less").

**Output Formatting**: Request structured output (JSON, markdown) for easier parsing.

**Chain-of-Thought**: For debugging, ask the model to "think step by step" before providing the fix.

**Temperature Tuning**:
- Explanations: 0.7 (creative but accurate)
- Debugging: 0.3 (precise and deterministic)
- Summarization: 0.5 (balanced)
- Planning: 0.6 (structured but flexible)

## 7. Scalability Considerations

### 7.1 Immediate Optimizations (Post-Hackathon)

**Caching Layer**: Implement Redis for caching common queries, translations, and summaries. Cache hit rate target: 40%.

**Database**: Add PostgreSQL for user sessions, query history, and analytics. Enables personalization and progress tracking.

**Rate Limiting**: Implement per-user rate limits to prevent abuse. Use token bucket algorithm.

**CDN**: Serve static assets through CloudFlare or similar CDN to reduce latency globally.

### 7.2 Medium-Term Scaling (3-6 Months)

**Microservices**: Split into separate services:
- API Gateway
- Explanation Service
- Debugging Service
- Document Processing Service
- Translation Service

**Message Queue**: Use RabbitMQ or AWS SQS for async processing of PDFs and long-running tasks.

**Load Balancing**: Deploy multiple API server instances behind a load balancer.

**Model Optimization**: Fine-tune smaller models (Llama 2, Mistral) for specific tasks to reduce API costs.

### 7.3 Long-Term Scaling (6-12 Months)

**Self-Hosted Models**: Deploy open-source models on GPU infrastructure to eliminate per-request API costs.

**Edge Computing**: Deploy lightweight models at edge locations for faster response times in India.

**Horizontal Scaling**: Kubernetes orchestration for auto-scaling based on traffic.

**Data Pipeline**: Build analytics pipeline for user behavior analysis and model improvement.

## 8. Security & Privacy

### 8.1 Data Handling

**User Documents**: PDFs are processed in-memory and not stored permanently. Deleted immediately after processing.

**Query Logging**: Log queries for debugging but anonymize user identifiers. Implement log rotation and retention policies (7 days for hackathon).

**API Keys**: Store in environment variables, never commit to version control. Use separate keys for dev/prod.

**Input Validation**: Sanitize all user inputs to prevent injection attacks. Validate file types and sizes.

### 8.2 Privacy Measures

**No User Tracking**: Minimal analytics, no third-party tracking scripts.

**Session Management**: Use short-lived session tokens, no persistent user accounts in MVP.

**HTTPS Only**: Enforce HTTPS for all communications.

**CORS Policy**: Restrict API access to known frontend domains.

### 8.3 Content Safety

**Prompt Injection Protection**: Sanitize user inputs to prevent prompt injection attacks.

**Content Filtering**: Implement basic profanity and inappropriate content detection.

**Rate Limiting**: Prevent abuse through aggressive rate limiting (100 requests/hour per IP).

## 9. Deployment Plan

### 9.1 Hackathon Deployment (48 Hours)

**Day 1 Morning**:
- Set up GitHub repository
- Initialize React frontend with Vite
- Initialize Express backend
- Deploy skeleton to Vercel (frontend) and Railway (backend)
- Configure environment variables

**Day 1 Afternoon**:
- Implement explain and debug features
- Basic UI with language selector
- Test with sample queries

**Day 1 Evening**:
- Implement PDF summarization
- Add translation integration
- Deploy updates

**Day 2 Morning**:
- Implement study planner
- Add low-bandwidth mode
- UI polish and responsive design

**Day 2 Afternoon**:
- Testing and bug fixes
- Prepare demo data and scenarios
- Documentation and README

**Day 2 Evening**:
- Final deployment
- Smoke testing
- Presentation preparation

### 9.2 Deployment Architecture

**Frontend**: Vercel
- Automatic deployments from main branch
- Environment variables for API URL
- Custom domain (optional)

**Backend**: Railway or Render
- Automatic deployments from main branch
- Environment variables for API keys
- Health check endpoint configured

**Monitoring**: Basic logging to console, Railway/Render built-in logs

### 9.3 Rollback Strategy

**Version Control**: Tag releases (v0.1-hackathon)

**Deployment Branches**: Keep stable version on `main`, active development on `dev`

**Quick Rollback**: Vercel and Railway support instant rollback to previous deployment

### 9.4 Demo Environment

**Test Data**: Prepare sample PDFs, code snippets, and queries in multiple languages

**Demo Accounts**: No authentication needed, but prepare demo scenarios

**Backup Plan**: Record video demo in case of live demo issues

**Performance**: Pre-warm cache with common queries before presentation

### 9.5 Post-Hackathon Deployment

**Domain**: Register custom domain (bharatai-learnos.com)

**Monitoring**: Add Sentry for error tracking, Google Analytics for usage

**CI/CD**: Set up GitHub Actions for automated testing and deployment

**Staging Environment**: Create separate staging deployment for testing

**Database**: Migrate from in-memory to PostgreSQL for persistence

**Backup**: Implement automated backups for user data and configurations
