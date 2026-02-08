# 🏥 HOMECARE+ - Complete Installation Package

## 📦 Package Contents

This ZIP file contains the complete HOMECARE+ healthcare web application with:

- ✅ Backend API (Node.js + Express + MySQL)
- ✅ Frontend Application (React + Vite)
- ✅ Database Schema (MySQL)
- ✅ Complete Documentation
- ✅ All necessary configuration files

---

## 🚀 INSTALLATION GUIDE

### Prerequisites

Download and install these before starting:

1. **Node.js** (v16+) - https://nodejs.org/
2. **MySQL** (v8+) - https://dev.mysql.com/downloads/
3. **Git** (optional) - https://git-scm.com/

---

### Step 1: Extract the ZIP

Extract `homecare-plus-complete.zip` to your desired location:
```
C:\Projects\homecare-plus  (Windows)
~/Projects/homecare-plus    (Mac/Linux)
```

---

### Step 2: Database Setup

1. **Start MySQL Server**

2. **Open MySQL Command Line** or MySQL Workbench

3. **Create Database:**
```sql
CREATE DATABASE homecare_plus;
```

4. **Import Schema:**

**Option A - Command Line:**
```bash
cd homecare-plus
mysql -u root -p homecare_plus < database/schema.sql
```

**Option B - MySQL Workbench:**
- Open MySQL Workbench
- File → Run SQL Script
- Select `database/schema.sql`
- Execute

5. **Verify:**
```sql
USE homecare_plus;
SHOW TABLES;
-- You should see: users, diseases, organs, hospitals, medical_history, emergency_contacts
```

---

### Step 3: Backend Setup

1. **Open Terminal/Command Prompt**

2. **Navigate to backend folder:**
```bash
cd homecare-plus/backend
```

3. **Install dependencies:**
```bash
npm install
```

4. **Create environment file:**
```bash
# Copy the example file
cp .env.example .env

# Windows Command Prompt:
copy .env.example .env
```

5. **Edit `.env` file** (use Notepad, VS Code, or any text editor):
```env
# IMPORTANT: Update these values!

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE  # ← Change this!
DB_NAME=homecare_plus
DB_PORT=3306

JWT_SECRET=your_super_secret_random_key_here_change_this
SESSION_SECRET=another_random_secret_key

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

6. **Start the backend server:**
```bash
npm start
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 5000
```

**Leave this terminal open!**

---

### Step 4: Frontend Setup

1. **Open NEW Terminal/Command Prompt**

2. **Navigate to frontend folder:**
```bash
cd homecare-plus/frontend
```

3. **Install dependencies:**
```bash
npm install
```

This may take 2-3 minutes.

4. **Add Your Logo (Optional):**

Create or download a logo and save it as:
```
frontend/public/logo.png
```

Recommended size: 200x200 pixels, PNG format with transparent background.

**Don't have a logo?** The app will work without it!

5. **Start the development server:**
```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

### Step 5: Open the Application

**Open your web browser** and go to:
```
http://localhost:5173
```

🎉 **Congratulations! HOMECARE+ is now running!**

---

## 🧪 Testing the Application

### Test User Registration:
1. Click "Sign Up" in the navigation
2. Fill in your details
3. Click "Register"

### Test AI Disease Prediction:
1. Click "AI Diagnosis"
2. Type symptoms: "fever, headache, body pain"
3. Click "Predict Disease"
4. View results

### Test Voice Recognition:
1. Go to "AI Diagnosis"
2. Click the 🎤 microphone button
3. Allow microphone access
4. Speak your symptoms clearly
5. Click "Predict Disease"

### Test Emergency Services:
1. Click "Emergency" in navigation
2. View emergency numbers
3. Click "Call" buttons (will open phone dialer)

### Test Hospital Search:
1. Click "Hospitals"
2. Allow location access
3. View nearby hospitals on map

---

## 📱 Supported Browsers

**Voice Recognition works on:**
- ✅ Google Chrome (Desktop & Mobile)
- ✅ Microsoft Edge
- ✅ Safari (iOS 14.5+)
- ⚠️ Firefox (limited support)

**Recommended:** Google Chrome for best experience

---

## 🔧 Troubleshooting

### Backend won't start:

**Problem:** "ECONNREFUSED" or database connection error
**Solution:**
1. Make sure MySQL is running
2. Check username/password in `.env` file
3. Verify database exists: `SHOW DATABASES;`

**Problem:** "Port 5000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Frontend won't start:

**Problem:** "ENOENT" or module not found
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Problem:** "Port 5173 already in use"
**Solution:** Edit `vite.config.js` and change port to 5174

### Voice recognition not working:

**Solutions:**
1. Use Google Chrome browser
2. Allow microphone permissions
3. Use HTTPS (or localhost)
4. Check browser console for errors

### Database issues:

**Reset database:**
```sql
DROP DATABASE homecare_plus;
CREATE DATABASE homecare_plus;
-- Then run schema.sql again
```

---

## 📂 Project Structure

```
homecare-plus/
├── backend/              # Node.js Backend
│   ├── config/          # Database configuration
│   ├── controllers/     # API controllers
│   ├── middleware/      # Authentication
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── services/        # AI service
│   ├── .env.example     # Environment template
│   ├── package.json     # Dependencies
│   └── server.js        # Main server
│
├── frontend/            # React Frontend
│   ├── public/          # Static files
│   │   └── logo.png     # YOUR LOGO HERE
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API & Voice services
│   │   ├── styles/      # CSS files
│   │   ├── utils/       # Helper functions
│   │   ├── App.jsx      # Main app
│   │   └── main.jsx     # Entry point
│   ├── index.html       # HTML template
│   ├── package.json     # Dependencies
│   └── vite.config.js   # Vite config
│
├── database/
│   └── schema.sql       # Database schema
│
├── README.md            # Main documentation
├── QUICK_START_GUIDE.md # Quick reference
└── INSTALLATION.md      # This file
```

---

## 🎨 Customization

### Change App Name:
- Edit `frontend/index.html` - Update `<title>`
- Edit `frontend/src/components/Navbar.jsx` - Update logo text

### Change Colors:
- Edit `frontend/src/styles/global.css` - Update CSS variables

### Add More Diseases:
- Edit `database/schema.sql` - Add INSERT statements
- Or use phpMyAdmin to add via GUI

### Change Port Numbers:
- Backend: Edit `backend/.env` - Change `PORT`
- Frontend: Edit `frontend/vite.config.js` - Change `port`

---

## 🌍 Deployment

### Deploy Backend:
- **Heroku:** Free tier available
- **Railway:** Free tier available
- **Render:** Free tier available

### Deploy Frontend:
- **Vercel:** Free hosting
- **Netlify:** Free hosting
- **GitHub Pages:** Free hosting

### Database:
- **PlanetScale:** Free MySQL hosting
- **Railway:** Includes database
- **Clever Cloud:** Free tier available

---

## 📞 Need Help?

### Documentation:
- Main README: `README.md`
- Quick Start: `QUICK_START_GUIDE.md`
- Components: `COMPLETE_COMPONENTS_CODE.md`

### Common Issues:
1. Make sure MySQL is running
2. Check all passwords in `.env`
3. Install dependencies: `npm install`
4. Use Node.js v16 or higher
5. Use supported browser (Chrome)

---

## 📋 Checklist

Before using the app, ensure:

- [ ] Node.js installed
- [ ] MySQL installed and running
- [ ] Database created (homecare_plus)
- [ ] Schema imported (schema.sql)
- [ ] Backend dependencies installed
- [ ] Backend .env configured
- [ ] Backend server running (port 5000)
- [ ] Frontend dependencies installed
- [ ] Logo added (optional)
- [ ] Frontend server running (port 5173)
- [ ] Browser opened to localhost:5173
- [ ] Microphone permission granted
- [ ] Location permission granted

---

## ✅ Success Indicators

### Backend Running:
```
✅ Database connected successfully
✅ Database tables already exist
🚀 Server running on port 5000
```

### Frontend Running:
```
VITE v5.0.8  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### App Working:
- Homepage loads with animations
- Can navigate between pages
- Can register/login
- AI prediction works
- Voice input works
- Maps show hospitals
- Emergency numbers dial

---

## 🎊 You're All Set!

Your HOMECARE+ application is ready to use!

**Default URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

**First Steps:**
1. Create an account (optional - app works without login)
2. Try AI diagnosis with symptoms
3. Test voice recognition
4. Explore disease database
5. Find nearby hospitals
6. Check emergency services

---

## 📄 License

This project is for educational purposes.

---

## 💝 Made with Love

Created for better healthcare accessibility in India.

**Features:**
- 500+ Diseases (Indian context)
- 12+ Indian Languages
- Free & Open Source
- No paid APIs required
- Fully functional offline

---

**Enjoy your HOMECARE+ application!** 🏥✨

For questions, refer to the documentation files included in this package.
