from fastapi import FastAPI, File, UploadFile, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import fitz
import os
import requests
import re
from typing import Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Job & Resume Coach API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:5174",
        "https://ai-job-resume-coach.vercel.app",  # Actual domain
        "https://ai-job-resume-coach-j7i8b3n5y-abdullah-dahabres-projects.vercel.app/",  # Deployment URL
        "https://*.vercel.app"  # Allow all Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for API configuration
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama3-70b-8192"

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "🚀 Transform your career with AI-powered resume feedback, personalized cover letters, interview preparation, and job matching - all in one platform!"}

async def extract_text_from_pdf(contents: bytes) -> str:
    """Extract text content from PDF file."""
    try:
        doc = fitz.open(stream=contents, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text.strip()
    except Exception as e:
        raise Exception(f"Failed to read PDF: {str(e)}")

async def analyze_resume(text: str) -> Dict[str, Any]:
    """Analyze resume and provide structured feedback with scores."""
    
    try:
        # Fallback implementation when API is not available
        if not GROQ_API_KEY:
            return _generate_fallback_analysis(text)
                
        prompt = f"""Analyze this resume and provide structured, actionable feedback using this format:

**Formatting & Structure**: Evaluate layout, organization, and professional appearance. Comment on readability, spacing, font consistency, and overall visual hierarchy.

**Content Quality**: Assess how well achievements are communicated and if projects/experiences are described effectively. Focus on clarity and impact of descriptions.

**Skills Relevance**: Review if skills match current market demands and industry standards. Consider technical skills, tools, and technologies mentioned.

**Areas for Improvement**: List the top 3-5 specific, actionable recommendations that would strengthen this resume. Be concrete and practical.

Provide detailed, constructive feedback for each section. Do NOT include numerical scores in your response - focus on qualitative analysis and specific improvement suggestions.

Resume:
{text}
"""

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": MODEL,
            "messages": [
                {"role": "system", "content": "You are a professional resume reviewer who provides structured, detailed feedback. Use the exact section headers provided. Do NOT include numerical scores or ratings in your response - provide qualitative analysis only. Be specific and actionable in your recommendations."},
                {"role": "user", "content": prompt}
            ]
        }

        response = requests.post(GROQ_BASE_URL, headers=headers, json=payload)
        data = response.json()
        
        if "choices" not in data or not data["choices"]:
            # If API fails, use fallback
            return _generate_fallback_analysis(text)
            
        ai_feedback = data["choices"][0]["message"]["content"]
        
        # Generate scores for visualization
        score_map = {
            "Format": 8,
            "Content": 7,
            "Skills": 8,
            "Impact": 7,
            "Overall": 7
        }

        # Try to extract scores from feedback if they exist
        score_patterns = {
            "Format": [r"format.*?(\d+)/10", r"structure.*?(\d+)/10", r"layout.*?(\d+)/10"],
            "Content": [r"content.*?(\d+)/10", r"quality.*?(\d+)/10"],
            "Skills": [r"skills.*?(\d+)/10", r"technical.*?(\d+)/10"],
            "Impact": [r"impact.*?(\d+)/10", r"achievement.*?(\d+)/10"],
            "Overall": [r"overall.*?(\d+)/10", r"total.*?(\d+)/10", r"final.*?(\d+)/10"]
        }

        for category, patterns in score_patterns.items():
            for pattern in patterns:
                match = re.search(pattern, ai_feedback, re.IGNORECASE)
                if match:
                    try:
                        score_map[category] = int(match.group(1))
                        break
                    except:
                        continue

        return {"feedback": ai_feedback, "scores": score_map}
    except Exception as e:
        # If any error occurs, fall back to basic analysis
        return _generate_fallback_analysis(text)

def _generate_fallback_analysis(text: str) -> Dict[str, Any]:
    """Generate basic analysis when API is not available."""
    
    # Basic text analysis
    word_count = len(text.split())
    has_contact = any(keyword in text.lower() for keyword in ['email', 'phone', '@', 'linkedin'])
    has_experience = any(keyword in text.lower() for keyword in ['experience', 'work', 'job', 'position'])
    has_education = any(keyword in text.lower() for keyword in ['education', 'degree', 'university', 'college'])
    has_skills = any(keyword in text.lower() for keyword in ['skills', 'programming', 'software', 'technical'])
    
    # Generate scores based on content analysis
    scores = {
        "Format": 8 if word_count > 200 else 6,
        "Content": 8 if has_experience and has_education else 6,
        "Skills": 8 if has_skills else 5,
        "Impact": 7 if any(keyword in text.lower() for keyword in ['achieved', 'improved', 'increased', 'developed']) else 5,
        "Overall": 7
    }
    
    # Generate feedback based on analysis
    feedback = f"""**Resume Analysis Report**

**Strengths:**
- Resume contains {word_count} words, which is {'adequate' if word_count > 200 else 'could be expanded'}
- {'Contact information is present' if has_contact else 'Consider adding complete contact information'}
- {'Work experience section is included' if has_experience else 'Work experience needs to be added'}
- {'Education background is mentioned' if has_education else 'Education section should be included'}

**Areas for Improvement:**
- {'Skills section looks good' if has_skills else 'Add a dedicated skills section with relevant technical and soft skills'}
- {'Good use of action words and achievements' if any(keyword in text.lower() for keyword in ['achieved', 'improved', 'increased']) else 'Include more quantifiable achievements and action words'}
- Consider using bullet points for better readability
- Ensure consistent formatting throughout the document

**Recommendations:**
1. Use action verbs to start bullet points (e.g., "Developed", "Managed", "Achieved")
2. Include quantifiable results where possible (e.g., "Increased sales by 25%")
3. Tailor your resume to match the job description
4. Keep the format clean and professional
5. Proofread for any spelling or grammatical errors

**Overall Score: {scores['Overall']}/10**
Your resume has a solid foundation. Focus on adding more specific achievements and quantifiable results to make it stand out to employers."""

    return {"feedback": feedback, "scores": scores}

async def generate_cover_letter(resume: str, job_description: str) -> str:
    """Generate a professional cover letter based on resume and job description."""
    prompt = f"""You're a professional cover letter writer. Create a compelling, concise cover letter that:

1. **Opening**: Start with "Dear Hiring Manager," followed by a strong introduction mentioning the specific position
2. **Relevant Experience**: Highlight only the most relevant 2-3 experiences/skills from the resume that directly match the job requirements
3. **Value Proposition**: Focus on what value the candidate brings to the company, not personal details
4. **Professional Tone**: Keep it formal, confident, and engaging
5. **Length**: Keep it concise (3-4 paragraphs maximum)

**Important Guidelines:**
- Do NOT include excessive personal background or irrelevant details
- Do NOT mention certificates
- Focus on professional qualifications that match the job requirements
- Avoid repetitive information from the resume
- Make it sound natural and personalized, not generic
- End with a strong closing statement
- Do NOT include any introductory text like "Here is a cover letter..." - start directly with the cover letter content

Resume:
{resume}

Job Description:
{job_description}

Write a professional cover letter that gets straight to the point and demonstrates clear value alignment. Start directly with "Dear Hiring Manager," without any introductory phrases."""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a professional cover letter writer. Write cover letters that start directly with the content - no introductory phrases like 'Here is a cover letter' or similar. Format your response cleanly without excessive spacing. Focus on professional experience only, avoid mentioning certificates or credentials."},
            {"role": "user", "content": prompt}
        ]
    }

    try:
        response = requests.post(GROQ_BASE_URL, headers=headers, json=payload)
        data = response.json()
        
        if "choices" in data and data["choices"]:
            cover_letter = data["choices"][0]["message"]["content"]
            # Clean up extra spaces and line breaks
            cover_letter = re.sub(r'\n\s*\n\s*\n', '\n\n', cover_letter)
            cover_letter = re.sub(r'[ \t]+', ' ', cover_letter)
            cover_letter = cover_letter.strip()
            return cover_letter
        else:
            raise Exception(data.get("error", "LLM response missing 'choices'"))
    except Exception as e:
        raise Exception(f"Failed to generate cover letter: {str(e)}")

# Endpoints
@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and analyze resume."""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        contents = await file.read()
        text = await extract_text_from_pdf(contents)
        result = await analyze_resume(text)
        return {"feedback": result["feedback"], "scores": result["scores"]}
    except Exception as e:
        print(f"Error in upload_resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")

@app.post("/extract-resume")
async def extract_resume(file: UploadFile = File(...)):
    """Extract text from resume PDF."""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        contents = await file.read()
        text = await extract_text_from_pdf(contents)
        return {"text": text, "score": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-cover-letter")
async def generate_cover_letter_endpoint(payload: dict = Body(...)):
    """Generate cover letter based on resume and job description."""
    try:
        resume = payload.get("resume", "").strip()
        job = payload.get("job", "").strip()
        
        if not resume or not job:
            raise HTTPException(status_code=400, detail="Missing resume or job description")
        
        letter = await generate_cover_letter(resume, job)
        return {"letter": letter}
    except Exception as e:
        print(f"Error in generate_cover_letter: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate cover letter: {str(e)}")

@app.post("/interview-trainer")
async def interview_trainer(payload: dict = Body(...)):
    """Generate interview questions and answers based on resume and job description."""
    try:
        print(f"🔧 Interview trainer called with payload keys: {list(payload.keys())}")
        resume = payload.get("resume", "").strip()
        job = payload.get("job", "").strip()
        
        print(f"🔧 Resume length: {len(resume)}, Job length: {len(job)}")
        
        if not resume or not job:
            print(f"🔧 Missing data - Resume: {bool(resume)}, Job: {bool(job)}")
            raise HTTPException(status_code=400, detail="Missing resume or job description")
        
        # Check if GROQ API key is available
        if not GROQ_API_KEY:
            print(f"🔧 GROQ API key not found!")
            raise HTTPException(status_code=500, detail="GROQ API key not configured")
        
        prompt = f"""Create 10 interview questions with answers. Generate 5 questions based on the resume and 5 questions based on the job description.

Format each question and answer like this:
Q1: How do you handle challenges when working with incomplete data sets?
A1: Based on my experience in data analysis projects, I approach incomplete data by...

Continue this pattern through Q10 and A10.

**Resume-Based Questions (Q1-Q5):** Create insightful behavioral and technical questions that explore the candidate's actual experience. Analyze their projects, skills, and background to ask about:
- Specific challenges they likely faced in their listed projects or roles
- How they applied the technologies/skills mentioned in their resume
- Problem-solving approaches related to their field of expertise
- Leadership or collaboration experiences based on their background
- Learning and adaptation in areas they've worked in

**Job Description-Based Questions (Q6-Q10):** Create questions that test fit for this specific role. Based on the job requirements, ask about:
- How they would approach key responsibilities mentioned in the job description
- Their experience with specific tools, technologies, or methodologies required
- How they would handle challenges unique to this role or industry
- Their strategy for meeting specific objectives outlined in the job posting
- How they would contribute to team goals and company mission as described

Make each question specific and relevant. Avoid generic questions. The answers should demonstrate how the candidate's background directly prepares them for both the challenges they've faced and the role they're applying for.

Resume:
{resume}

Job Description:
{job}"""

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload_ai = {
            "model": MODEL,
            "messages": [
                {"role": "system", "content": "You are an interview coach. Generate interview questions and answers using the Q#:/A#: format. Be clear and direct."},
                {"role": "user", "content": prompt}
            ]
        }

        print(f"🔧 Making API call to GROQ...")
        response = requests.post(GROQ_BASE_URL, headers=headers, json=payload_ai)
        print(f"🔧 GROQ API response status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"🔧 GROQ API error: {response.text}")
            raise HTTPException(status_code=500, detail=f"GROQ API error: {response.status_code}")
        
        data = response.json()
        print(f"🔧 GROQ API response keys: {list(data.keys())}")
        
        if "choices" in data and data["choices"]:
            content = data["choices"][0]["message"]["content"]
            print(f"🔧 AI response length: {len(content)}")
            print(f"🔧 First 500 chars: {content[:500]}...")
            
            # Parse using the specific Q#:/A#: format
            pairs = []
            import re
            
            # Find all Q#: and A#: patterns
            qa_pattern = r'Q(\d+):\s*([^A]*?)A\1:\s*([^Q]*?)(?=Q\d+:|$)'
            matches = re.findall(qa_pattern, content, re.DOTALL | re.IGNORECASE)
            
            print(f"🔧 Found {len(matches)} Q/A matches")
            
            for match in matches:
                question_num, question, answer = match
                question = question.strip()
                answer = answer.strip()
                
                if question and answer and len(question) > 5 and len(answer) > 10:
                    pairs.append({
                        "question": question,
                        "answer": answer
                    })
                    print(f"🔧 Added Q{question_num}: {question[:50]}...")
            
            print(f"🔧 Successfully parsed {len(pairs)} question-answer pairs")
            
            # If we have at least some pairs, return them
            if len(pairs) >= 1:
                return {"pairs": pairs[:10]}  # Return max 10 pairs
            else:
                print(f"🔧 No pairs found. Raw content: {content}")
                # Simple fallback - just extract any text that looks like questions and answers
                lines = content.split('\n')
                fallback_pairs = []
                
                for i, line in enumerate(lines):
                    if line.strip().startswith('Q') and ':' in line:
                        question = line.split(':', 1)[1].strip()
                        # Look for the corresponding answer
                        if i + 1 < len(lines) and lines[i + 1].strip().startswith('A') and ':' in lines[i + 1]:
                            answer = lines[i + 1].split(':', 1)[1].strip()
                            if question and answer:
                                fallback_pairs.append({
                                    "question": question,
                                    "answer": answer
                                })
                
                if fallback_pairs:
                    return {"pairs": fallback_pairs[:10]}
                else:
                    raise Exception("Could not parse interview questions from AI response")
        else:
            print(f"🔧 No choices in API response: {data}")
            raise Exception("Failed to get AI response for interview questions")
            
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"🔧 Error in interview_trainer: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-links")
async def generate_links(payload: dict = Body(...)):
    """Generate job search links based on resume."""
    try:
        resume = payload.get("resume", "").strip()
        
        if not resume:
            raise HTTPException(status_code=400, detail="Resume content is required")
        
        # Extract skills and job titles for better job matching
        prompt = f"""You are an expert job search assistant.

Your task is to:
1. Extract from the resume:
   - Most relevant job title (based on major, experience, education, projects)
   - Location(s) if mentioned

2. Based on the extracted title and location, generate job search links on:
   LinkedIn, Indeed, Google Jobs, Upwork, Wellfound, Glassdoor, RemoteOK, WeWorkRemotely

🔎 Rules for link generation:
- Use **only one consistent job title** across all links
- Ensure all links point to **search result pages**, not homepage
- Title and location must be part of the URL where applicable
- If any platform cannot find a matching job or location, return the platform's general job search URL as a fallback

🌍 Platform-specific rules:
- **Glassdoor**: Always use: https://www.glassdoor.com/Job/index.htm
- **RemoteOK**: Always use: https://remoteok.com
- **WeWorkRemotely**: Use job title as the search term in the URL.
- **Wellfound**: Always use: https://wellfound.com/remote
- **Upwork**: Always use: https://www.upwork.com/freelance-jobs
❌ Do NOT generate custom or dynamic links for RemoteOK, Wellfound, Upwork, or Glassdoor. Use only the URLs above as-is.

⚠️ Output requirements:
- Return only **pure JSON**
- Do NOT include triple backticks
- Do NOT include explanations or intro text

📦 Example Search links:
{{
  "search_links": [
    {{"platform": "LinkedIn", "url": "complete URL with job title and location"}},
    {{"platform": "Indeed", "url": "complete URL with job title and location"}},
    {{"platform": "Google Jobs", "url": "complete URL with job title and location"}},
    {{"platform": "Glassdoor", "url": "complete URL with job title"}},
    {{"platform": "WeWorkRemotely", "url": "complete URL with job title"}},
    {{"platform": "RemoteOK", "url": "complete URL with job title"}},
    {{"platform": "Wellfound", "url": "complete URL with job title"}},
    {{"platform": "Upwork", "url": "complete URL with job title"}}
  ]
}}

Resume:
{resume}"""

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload_ai = {
            "model": MODEL,
            "messages": [
                {"role": "system", "content": "You are an expert job search assistant. Return only valid JSON format with search links."},
                {"role": "user", "content": prompt}
            ]
        }

        try:
            print(f"🔧 Making API call for job search...")
            response = requests.post(GROQ_BASE_URL, headers=headers, json=payload_ai)
            data = response.json()
            
            if "choices" in data and data["choices"]:
                ai_response = data["choices"][0]["message"]["content"].strip()
                print(f"🔧 AI job search response: {ai_response[:200]}...")
                
                # Try to parse the AI response as JSON
                try:
                    import json
                    ai_json = json.loads(ai_response)
                    if "search_links" in ai_json:
                        return ai_json
                except Exception as parse_error:
                    print(f"🔧 Failed to parse AI JSON: {parse_error}")
                    
                # If JSON parsing fails, extract job title manually and create links
                import urllib.parse
                
                # Extract job title using simple NLP (first relevant noun phrase)

                # Try to find job titles using common patterns
                job_title_matches = re.findall(r'(?:Position|Title|Role|Applying for|Objective)[:\- ]+([A-Za-z ]+)', resume, re.IGNORECASE)
                if job_title_matches:
                    job_title = job_title_matches[0].strip()
                else:
                    # Fallback: find first capitalized phrase that looks like a job title
                    possible_titles = re.findall(r'\b([A-Z][a-z]+(?: [A-Z][a-z]+){0,2})\b', resume)
                    job_title = possible_titles[0] if possible_titles else "software engineer"

                # Extract location if present
                location_matches = re.findall(r'(?:Location|Based in|Lives in|City|Address)[:\- ]+([A-Za-z, ]+)', resume, re.IGNORECASE)
                location = location_matches[0].strip() if location_matches else "remote"
                # URL encode for safety
                job_title_encoded = urllib.parse.quote_plus(job_title)
                location_encoded = urllib.parse.quote_plus(location)
                job_title_hyphenated = job_title.replace(' ', '-').lower()
                
                # Create search links with extracted job title
                search_links = [
                    {"platform": "LinkedIn", "url": f"https://www.linkedin.com/jobs/search/?keywords={job_title_encoded}&location={location_encoded}"},
                    {"platform": "Indeed", "url": f"https://www.indeed.com/jobs?q={job_title_encoded}&l={location_encoded}"},
                    {"platform": "Google Jobs", "url": f"https://www.google.com/search?q={job_title_encoded}+jobs+{location_encoded}"},
                    {"platform": "Glassdoor", "url": f"https://www.glassdoor.com/Job/jobs.htm?sc.keyword={job_title_encoded}"},
                    {"platform": "WeWorkRemotely", "url": f"https://weworkremotely.com/remote-jobs/search?term={job_title_encoded}"},
                    {"platform": "RemoteOK", "url": f"https://remoteok.io/?search={job_title_encoded}"},
                    {"platform": "Wellfound", "url": f"https://wellfound.com/role/{job_title_hyphenated}"},
                    {"platform": "Upwork", "url": f"https://www.upwork.com/freelance-jobs/search/?q={job_title_encoded}"}
                ]
                
                return {
                    "job_title": job_title,
                    "location": location,
                    "skills": ["extracted from resume"],
                    "search_links": search_links
                }
            
        except Exception as e:
            print(f"🔧 Error in job search API call: {str(e)}")
            # Fallback if AI call fails
            search_links = [
                {"platform": "LinkedIn", "url": "https://www.linkedin.com/jobs/search/?keywords=software%20engineer"},
                {"platform": "Indeed", "url": "https://www.indeed.com/jobs?q=software+engineer"},
                {"platform": "Google Jobs", "url": "https://www.google.com/search?q=software+engineer+jobs"},
                {"platform": "Glassdoor", "url": "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=software%20engineer"}
            ]
            return {
                "job_title": "software engineer",
                "location": "remote",
                "skills": ["programming", "software development"], 
                "search_links": search_links
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
