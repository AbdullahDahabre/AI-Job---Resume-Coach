# 🚀 Deployment Checklist

## Prerequisites ✅
- [x] GitHub repository set up
- [x] .gitignore configured (excludes .env files)
- [x] Deployment configs created
- [ ] Groq API key ready
- [ ] Render account created
- [ ] Vercel account created

## Backend Deployment (Render) 🔧

### Step 1: Create Web Service
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service" 
3. Connect your GitHub: `AbdullahDahabre/AI-Job---Resume-Coach`
4. Select repository and branch: `main`

### Step 2: Configure Service
```
Name: jobcoach-backend
Environment: Python 3
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Step 3: Environment Variables
- Add `GROQ_API_KEY` = `your_actual_groq_api_key`

### Step 4: Deploy & Get URL
- Click "Create Web Service"
- Wait 2-3 minutes for deployment
- Copy your service URL (e.g., `https://jobcoach-backend.onrender.com`)

## Frontend Deployment (Vercel) 🎨

### Step 1: Import Project
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import from GitHub: `AbdullahDahabre/AI-Job---Resume-Coach`

### Step 2: Configure Project
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 3: Environment Variables
- Add `VITE_API_URL` = `https://your-render-backend-url.onrender.com`

### Step 4: Deploy
- Click "Deploy"
- Wait 1-2 minutes
- Get your live URL (e.g., `https://your-app.vercel.app`)

## Final Steps 🔄

### Update CORS Settings
1. Edit `backend/main.py` line 14
2. Replace `"https://your-app-name.vercel.app"` with your actual Vercel URL
3. Commit and push changes:
   ```bash
   git add backend/main.py
   git commit -m "Update CORS with production URL"
   git push origin main
   ```
4. Render will auto-redeploy with new CORS settings

### Test Everything 🧪
- [ ] Visit your Vercel URL
- [ ] Test resume upload and analysis
- [ ] Test cover letter generation  
- [ ] Test interview questions
- [ ] Test job search links

## Troubleshooting 🐛

### Common Issues:
1. **CORS Error**: Make sure Vercel URL is added to CORS origins
2. **API Errors**: Check Render logs for backend errors
3. **Build Fails**: Check if all dependencies are in requirements.txt/package.json
4. **Environment Variables**: Ensure GROQ_API_KEY is set in Render and VITE_API_URL in Vercel

### Render Free Tier Limits:
- 750 hours/month (automatically sleeps after 15 min of inactivity)
- 512 MB RAM
- First request after sleep takes ~30 seconds (cold start)

### Vercel Free Tier Limits:
- 100GB bandwidth/month
- Unlimited projects
- Custom domains supported

## 💡 Pro Tips
- Render services sleep after 15 minutes of inactivity on free tier
- First request after sleep takes ~30 seconds to wake up
- Consider upgrading if you need 24/7 availability
- Monitor usage in both dashboards
- Keep your API keys secure and never commit them!
