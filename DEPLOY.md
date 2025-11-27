# Vercel Deployment Guide

## 🚀 Quick Deploy Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Select your project settings
   - Vercel will give you a deployment URL

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the settings

## ⚙️ Environment Variables Setup

**IMPORTANT**: You MUST set environment variables in Vercel Dashboard!

1. Go to your project on Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
RECIPIENT_EMAIL=hr@charmai.in
PORT=4000
```

4. **Redeploy** after adding environment variables (Vercel will prompt you)

## 🌐 After Deployment

Once deployed, you'll get a URL like: `https://your-project.vercel.app`

### Available Endpoints:

1. **POST /contact** - Send contact form
   ```
   https://your-project.vercel.app/contact
   ```

2. **GET /health** - Health check
   ```
   https://your-project.vercel.app/health
   ```

## 📝 Testing Your Deployed API

### Test with curl:
```bash
curl -X POST https://your-project.vercel.app/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "company": "Acme Inc",
    "title": "Test Contact",
    "message": "This is a test message."
  }'
```

### Test Health Endpoint:
```bash
curl https://your-project.vercel.app/health
```

## 🔧 Frontend Integration

In your React/frontend code, update the API URL:

```javascript
// For production
const API_URL = 'https://your-project.vercel.app';

// For local development
const API_URL = 'http://localhost:4000';

// Send contact form
fetch(`${API_URL}/contact`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Inc',
    title: 'Test',
    message: 'Hello!'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## ⚠️ Important Notes

1. **Environment Variables**: Must be set in Vercel Dashboard, not in `.env` file
2. **Gmail App Password**: Use App Password, not regular password
3. **CORS**: Already configured, works with any frontend domain
4. **Auto-deploy**: If connected to GitHub, Vercel auto-deploys on push

## 🐛 Troubleshooting

- **Email not sending?** Check environment variables in Vercel Dashboard
- **403/401 errors?** Verify MAIL_USER and MAIL_PASS are correct
- **CORS issues?** Already handled, but check if frontend URL is correct

