# Smart Invoice OCR - Invoice Intelligence

Full-stack application for intelligent invoice management, featuring Optical Character Recognition (OCR) for text extraction and Large Language Model (LLM) integration for contextual analysis and Q&A.

## Technologies

- **Frontend:** Next.js 14, React, TailwindCSS, Lucide Icons, React Markdown
- **Backend:** NestJS, Prisma ORM, Multer
- **Database:** PostgreSQL
- **AI & OCR:**
    - **OCR:** Tesseract.js (dependent on system-level libraries poppler-utils and tesseract-ocr)
    - **LLM:** Google Gemini Flash (Free Tier)
- **Infrastructure:** Docker & Docker Compose

## Prerequisites

Due to specific system dependencies required for PDF-to-Image conversion and OCR, **this project is designed to run within Docker**.

- Docker Desktop & Docker Compose installed
- Git
- Google Gemini API Key

## How to Get a Free Gemini API Key

This project uses Google's Gemini model, which offers a free tier for development.

1. Go to Google AI Studio (https://aistudio.google.com/).
2. Sign in with your Google Account.
3. Click on the "Get API key" button.
4. Click "Create API key".
5. Copy the key string. You will use this in the environment variables.

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/Fernando7492/smart-invoice-ocr.git
cd smart-invoice-ocr
```
### 2. Configure Environment Variables

Navigate to the backend folder. Duplicate the example environment file and rename it to .env.
```bash
cd backend
cp .env.example .env
```
Open the newly created .env file and update the variables. Ensure the database URL matches the service name defined in Docker (host: db).

```
# Database Connection (Host 'db' refers to the Docker service name)
DATABASE_URL="postgresql://user:password@db:5432/sio_db?schema=public"

# Security
JWT_SECRET="change_this_to_a_secure_secret"

# AI Configuration
GEMINI_API_KEY="paste_your_google_api_key_here"
```

### 3. Run with Docker

Return to the root directory and start the application using Docker Compose.
```bash
cd ..
docker compose up -d --build
```

### 4. Access the Application

   - Frontend (Dashboard): http://localhost:3001

   - Backend API: http://localhost:3000

   Note: When accessing the application, you must create an account with an email and password. This account is stored locally in your database instance.

# Features

   - Smart Upload: Accepts PDF and Image formats. Automatically detects if a PDF has a text layer (fast processing) or requires OCR rasterization (deep processing).

   - Interactive Chat: Users can ask questions about the invoice content (e.g., "What is the total value?", "Who is the supplier?").

   - Real-time Status: Polling mechanism updates the dashboard as soon as the OCR process finishes in the background.

   - Report Download: Users can download a .txt file containing the file metadata, the full extracted text, and the entire chat history with the AI.

   - Authentication: JWT Authentication ensures users only access their own documents.