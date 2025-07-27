# AI Job & Resume Coach

A comprehensive AI-powered job application assistant that helps you optimize your resume, generate cover letters, practice interviews, and find relevant job opportunities.

## Features

- **Resume Analysis**: Upload your PDF resume and get detailed AI feedback with scoring across multiple categories
- **Cover Letter Generation**: Create personalized cover letters based on your resume and specific job descriptions
- **Interview Preparation**: Generate realistic interview questions and practice answers based on your resume and target positions
- **Job Search**: Get personalized job search links across multiple platforms

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Recharts** for data visualization
- **Marked** for markdown rendering
- Modern component-based architecture with proper separation of concerns

### Backend
- **FastAPI** with Python 3.8+
- **Groq AI** for large language model integrations
- **PyMuPDF (fitz)** for PDF text extraction
- Clean, modular architecture with all endpoints in main.py


## Project Structure

```
jobcoach/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── HomeSection.tsx
│   │   │   ├── FeedbackSection.tsx
│   │   │   ├── CoverLetterSection.tsx
│   │   │   ├── InterviewSection.tsx
│   │   │   ├── JobMatchingSection.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Notification.tsx
│   │   │   └── ResumeScoreChart.tsx
│   │   ├── services/            # API service layer
│   │   │   └── api.ts
│   │   ├── types/               # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── App.tsx              # Main application component
│   │   └── main.tsx             # Application entry point
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── main.py                  # FastAPI application entry point with all routes
│   └── requirements.txt
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.8+
- Groq API key (for AI features)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file with your API keys:
```env
GROQ_API_KEY=your_groq_api_key_here
```

5. Start the development server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`


## Features in Detail

### Resume Feedback
- Upload PDF resumes for automatic text extraction
- Get comprehensive AI feedback on content, structure, and presentation
- Visual scoring across multiple categories (experience, skills, formatting, etc.)
- Actionable recommendations for improvement

### Cover Letter Generator
- Input job descriptions to generate tailored cover letters
- AI matches your resume experience to job requirements
- Professional formatting and tone
- Copy to clipboard or save as text file

### Interview Trainer
- Generates 10 realistic interview questions (5 based on resume, 5 based on job description)
- Provides suggested answers for each question
- Interactive show/hide answer functionality
- Export all Q&A for offline practice

### Job Search Assistant
- Analyzes your resume to extract relevant skills and experience
- Generates targeted search URLs for major job platforms
- Personalized search queries based on your background


## API Endpoints

### Resume Analysis
- `POST /analyze-resume` - Upload PDF resume for analysis and scoring
- `POST /extract-resume` - Extract text content from PDF resume

### Cover Letters
- `POST /generate-cover-letter` - Generate personalized cover letter

### Interview Preparation
- `POST /interview-trainer` - Generate interview Q&A pairs

### Job Search
- `POST /generate-links` - Get personalized job search links


## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🚀 Deployment Guide

This project is designed to be deployed 100% free using:
- **Vercel** for frontend hosting
- **Render** for backend hosting

### Prerequisites
1. [Groq API Key](https://console.groq.com/keys) (free tier available)
2. GitHub account
3. Vercel account (free)
4. Render account (free)

### Step 1: Setup Repository
```bash
# Clone or download this repository
git clone <your-repo-url>
cd jobcoach

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy Backend on Render

1. **Sign up/Login to [Render](https://render.com)**

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository and branch `main`

3. **Configure Service Settings**
   ```
   Name: jobcoach-backend (or your preferred name)
   Environment: Python 3
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. **Add Environment Variables**
   - Go to "Environment" tab
   - Add: `GROQ_API_KEY` = `your_groq_api_key_here`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (usually 2-3 minutes)
   - Copy the service URL (e.g., `https://your-service.onrender.com`)

### Step 3: Deploy Frontend on Vercel

1. **Sign up/Login to [Vercel](https://vercel.com)**

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project

3. **Configure Project Settings**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-render-service.onrender.com`
   - Apply to: Production, Preview, and Development

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (usually 1-2 minutes)
   - Your app will be live at `https://your-app.vercel.app`

### Step 4: Update CORS Settings

After deployment, update the backend CORS origins:

1. **Edit `backend/main.py`**
   - Replace `"https://your-app-name.vercel.app"` with your actual Vercel URL
   
2. **Redeploy Backend**
   - Push changes to GitHub
   - Render will automatically redeploy

### Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Test all features:
   - Resume upload and analysis
   - Cover letter generation
   - Interview questions
   - Job search links

## 💰 Cost Breakdown (All Free!)

- **Vercel**: Free tier includes 100GB bandwidth, unlimited personal projects
- **Render**: Free tier includes 750 hours/month (enough for personal use)
- **Groq API**: Free tier includes sufficient requests for testing and moderate use
- **GitHub**: Free for public repositories

## License

This project is licensed under the Apache License 2.0 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Powered by Groq AI for advanced language model capabilities
- Built with modern React and FastAPI frameworks
- Designed for professional job seekers and career development
