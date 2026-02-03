# Quick Deployment Checklist

## 🚀 Render (Backend) Setup

1. **Create MongoDB Atlas Cluster**
   - Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/viyastree`

2. **Deploy on Render**
   - New Web Service → Connect GitHub repo
   - Settings:
     - **Name**: `viyastree-backend`
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment**: `Node`
   - Environment Variables:
     ```
     NODE_ENV=production
     PORT=10000
     MONGO_URI=<your-mongodb-atlas-uri>
     JWT_SECRET=<random-32-char-string>
     FRONTEND_URL=https://your-project.vercel.app
     ```
   - Health Check Path: `/api/v1/orchestration/health`

3. **Note Backend URL**: `https://viyastree-backend.onrender.com`

---

## ⚡ Vercel (Frontend) Setup

1. **Deploy on Vercel**
   - Import GitHub repo
   - Settings:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build` (auto)
     - **Output Directory**: `dist` (auto)
   - Environment Variables:
     ```
     VITE_API_URL=https://viyastree-backend.onrender.com
     ```

2. **Update vercel.json** (if backend URL changes)
   - Edit `vercel.json` → Update API proxy URLs

---

## ✅ Post-Deployment

1. **Update Backend CORS** (if needed)
   - Add Vercel domain to allowed origins in backend CORS config

2. **Test**
   - Backend: `curl https://viyastree-backend.onrender.com/api/v1/orchestration/health`
   - Frontend: Visit Vercel URL and check console

---

## 📝 Files Created

- ✅ `render.yaml` - Render deployment config
- ✅ `vercel.json` - Vercel deployment config  
- ✅ `DEPLOYMENT.md` - Full deployment guide
- ✅ `frontend/.env.example` - Frontend env template
- ✅ Health check endpoint added to backend

---

## 🔧 Troubleshooting

**Backend won't start**: Check MongoDB connection string
**CORS errors**: Update backend CORS with Vercel domain
**API 404**: Verify `vercel.json` proxy routes are correct
