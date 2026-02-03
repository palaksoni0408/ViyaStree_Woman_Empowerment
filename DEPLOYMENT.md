# Deployment Guide: ViyaStree

This guide covers deploying ViyaStree to **Render** (backend) and **Vercel** (frontend).

## Architecture Overview

- **Backend**: Node.js/Express API deployed on Render
- **Frontend**: React/Vite app deployed on Vercel
- **Database**: MongoDB (MongoDB Atlas recommended for production)

---

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
4. **MongoDB Atlas Account**: Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) (free tier available)

---

## Part 1: Backend Deployment on Render

### Step 1: Set Up MongoDB Atlas

1. Create a new cluster on MongoDB Atlas
2. Create a database user (username/password)
3. Whitelist IP addresses (use `0.0.0.0/0` for Render, or add Render's IPs)
4. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/viyastree?retryWrites=true&w=majority
   ```

### Step 2: Deploy Backend to Render

1. **Connect Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

2. **Configure Service**:
   - **Name**: `viyastree-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Set Environment Variables**:
   Click "Advanced" → "Add Environment Variable":
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-a-random-secret-string>
   ```

4. **Health Check**:
   - Health Check Path: `/api/v1/orchestration/health`

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://viyastree-backend.onrender.com`

### Step 3: Seed Database (Optional)

After deployment, you can seed the database by running:
```bash
# SSH into Render or use Render Shell
cd backend
npm run seed
```

Or manually trigger via Render's shell feature.

---

## Part 2: Frontend Deployment on Vercel

### Step 1: Update Vercel Configuration

The `vercel.json` file is already configured. Update it with your backend URL:

```json
{
  "env": {
    "VITE_API_URL": "https://viyastree-backend.onrender.com"
  }
}
```

### Step 2: Deploy Frontend to Vercel

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install`

3. **Set Environment Variables**:
   Click "Environment Variables" → Add:
   ```
   VITE_API_URL=https://viyastree-backend.onrender.com
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend will be live at: `https://your-project.vercel.app`

### Step 3: Update Vercel Routes (if needed)

The `vercel.json` already includes proxy routes for `/api` and `/uploads`. If your backend URL changes, update the `dest` fields in `vercel.json`.

---

## Part 3: Post-Deployment Configuration

### Update CORS Settings

Ensure your backend allows requests from your Vercel domain:

1. In `backend/index.js`, update CORS configuration:
```javascript
app.use(cors({
  origin: [
    'https://your-project.vercel.app',
    'http://localhost:5173' // for local testing
  ],
  credentials: true
}))
```

### Update Frontend API Configuration

If you need to change the API URL after deployment:

1. **Via Vercel Dashboard**:
   - Go to Project Settings → Environment Variables
   - Update `VITE_API_URL`

2. **Via vercel.json**:
   - Update the `env.VITE_API_URL` value
   - Redeploy

---

## Part 4: Testing Deployment

### Test Backend

1. Health Check:
   ```bash
   curl https://viyastree-backend.onrender.com/api/v1/orchestration/health
   ```
   Should return: `{"status":"ok","timestamp":"...","service":"viyastree-backend"}`

2. Test API Endpoint:
   ```bash
   curl https://viyastree-backend.onrender.com/api/v1/shiksha/courses
   ```

### Test Frontend

1. Visit your Vercel URL
2. Check browser console for API errors
3. Test login/signup flows
4. Verify API calls are going to correct backend

---

## Troubleshooting

### Backend Issues

**Problem**: Backend won't start
- **Solution**: Check Render logs, verify `MONGO_URI` is correct, ensure MongoDB Atlas IP whitelist includes Render

**Problem**: Database connection fails
- **Solution**: Verify MongoDB Atlas connection string, check network access settings

**Problem**: Health check fails
- **Solution**: Ensure `/api/v1/orchestration/health` route exists (already added)

### Frontend Issues

**Problem**: API calls fail with CORS errors
- **Solution**: Update backend CORS settings to include Vercel domain

**Problem**: API calls go to wrong URL
- **Solution**: Verify `VITE_API_URL` environment variable in Vercel dashboard

**Problem**: Build fails
- **Solution**: Check Vercel build logs, ensure all dependencies are in `package.json`

---

## Environment Variables Reference

### Backend (.env)
```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/viyastree
JWT_SECRET=your-secret-key-here
```

### Frontend (.env.local)
```
VITE_API_URL=https://viyastree-backend.onrender.com
```

---

## Continuous Deployment

Both Render and Vercel support automatic deployments:

- **Render**: Automatically deploys on push to connected branch
- **Vercel**: Automatically deploys on push to main branch (configurable)

To disable auto-deploy, configure in respective dashboards.

---

## Cost Estimates

- **Render** (Free Tier): 750 hours/month (enough for 24/7 single service)
- **Vercel** (Free Tier): Unlimited deployments, 100GB bandwidth
- **MongoDB Atlas** (Free Tier): 512MB storage, shared cluster

**Total**: $0/month for small-scale deployments

---

## Security Checklist

- [ ] Use strong `JWT_SECRET` (random string, 32+ characters)
- [ ] MongoDB Atlas user has minimal required permissions
- [ ] CORS configured to only allow your frontend domain
- [ ] Environment variables set in platform dashboards (not committed)
- [ ] HTTPS enabled (automatic on Render/Vercel)
- [ ] Helmet.js security headers enabled (already in backend)

---

## Support

For issues:
1. Check Render/Vercel deployment logs
2. Review MongoDB Atlas connection logs
3. Test API endpoints directly with curl/Postman
4. Check browser console for frontend errors

---

## Next Steps

After deployment:
1. Set up custom domains (optional)
2. Configure monitoring/alerts
3. Set up database backups
4. Implement CI/CD workflows
5. Add error tracking (Sentry, etc.)
