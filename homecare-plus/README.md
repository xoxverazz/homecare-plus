# HOMECARE+ 🏥
## AI-Powered Healthcare Assistant

A comprehensive healthcare web application with AI-powered disease prediction, multi-language support, voice recognition, and emergency services.

---

## 🌟 Features

### Core Features
- ✅ **AI Disease Prediction** - Advanced symptom analysis and disease prediction
- ✅ **Voice Recognition** - Speak symptoms in multiple Indian languages
- ✅ **Text-to-Speech** - Listen to responses in your preferred language
- ✅ **Multi-Language Support** - English, Hindi, Marathi, Bengali, Tamil, Telugu, and more
- ✅ **Hospital Locator** - Find nearby hospitals using geolocation
- ✅ **Interactive Maps** - OpenStreetMap integration for hospital locations
- ✅ **Emergency Services** - One-click dial for Ambulance, Police, Fire Brigade
- ✅ **Organs Database** - Comprehensive organ systems and associated diseases
- ✅ **Disease Database** - 500+ diseases with Indian context
- ✅ **User Authentication** - Register/Login with email or Google OAuth
- ✅ **Medical History** - Track your consultation history
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Beautiful Animations** - Framer Motion powered smooth transitions

---

## 🏗️ Technology Stack

### Frontend
- **React 18** - Modern React with Hooks
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **Web Speech API** - Voice recognition (built-in, free)
- **Leaflet** - Interactive maps
- **CSS Modules** - Scoped styling

### Backend
- **Node.js & Express** - REST API server
- **MySQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Passport.js** - Google OAuth
- **CORS** - Cross-origin requests

### AI/ML
- **Rule-based AI** - Symptom matching algorithm
- **Free tier compatible** - No paid API required
- *(Optional)* Hugging Face API integration

---

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **MySQL** (v8 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
3. **Git** - [Download](https://git-scm.com/)
4. **Text Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

---

## 🚀 Installation & Setup

### Step 1: Database Setup

1. **Install MySQL** and start the MySQL service

2. **Open MySQL Command Line** or MySQL Workbench

3. **Run the schema file**:
```bash
# From project root
mysql -u root -p < database/schema.sql
```

OR manually:
```sql
-- In MySQL Workbench or command line
SOURCE /path/to/homecare-plus/database/schema.sql;
```

4. **Verify database creation**:
```sql
USE homecare_plus;
SHOW TABLES;
```

You should see: `users`, `diseases`, `organs`, `medical_history`, `hospitals`, `emergency_contacts`

### Step 2: Backend Setup

1. **Navigate to backend folder**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create environment file**:
```bash
cp .env.example .env
```

4. **Edit `.env` file** with your settings:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=homecare_plus
DB_PORT=3306

# JWT Secret (change this!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Session Secret
SESSION_SECRET=your_session_secret_key_here

# Server Port
PORT=5000

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

5. **Start the backend server**:
```bash
npm start
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 5000
```

6. **Add sample hospital data** (optional but recommended):
```bash
# In a new terminal or use Postman/Insomnia
curl -X POST http://localhost:5000/api/hospitals/sample
```

### Step 3: Frontend Setup

1. **Open new terminal** and navigate to frontend folder:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create `.env` file** (optional):
```bash
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

4. **Add your logo**:
- Place your logo image as `/frontend/public/logo.png`
- Recommended size: 200x200px PNG with transparent background
- Or use any image editing tool to create a simple medical cross logo

5. **Start the development server**:
```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

6. **Open your browser** and go to: `http://localhost:5173`

---

## 📁 Project Structure

```
homecare-plus/
├── backend/
│   ├── config/
│   │   └── database.js          # MySQL connection
│   ├── controllers/
│   │   ├── authController.js    # User authentication
│   │   ├── diseaseController.js # Disease prediction
│   │   └── hospitalController.js# Hospital search
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── models/
│   │   └── User.js              # User model
│   ├── routes/
│   │   └── api.js               # API routes
│   ├── services/
│   │   └── aiService.js         # AI prediction logic
│   ├── .env.example             # Environment template
│   ├── package.json             # Dependencies
│   └── server.js                # Main server file
│
├── frontend/
│   ├── public/
│   │   └── logo.png             # YOUR LOGO HERE
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── OrgansPage.jsx
│   │   │   ├── DiseasePage.jsx
│   │   │   ├── HospitalMapPage.jsx
│   │   │   ├── EmergencyPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── services/            # API & Voice services
│   │   │   ├── api.js
│   │   │   └── voiceService.js
│   │   ├── styles/              # CSS files
│   │   │   ├── global.css
│   │   │   └── *.module.css
│   │   ├── utils/               # Helper functions
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── index.html               # HTML template
│   ├── package.json             # Dependencies
│   └── vite.config.js           # Vite configuration
│
└── database/
    └── schema.sql               # Database schema
```

---

## 🎨 Creating Your Logo

### Option 1: Use an Online Tool
1. Go to [Canva](https://www.canva.com/) or [Figma](https://www.figma.com/)
2. Create a 200x200px canvas
3. Add medical symbols (cross, heart, stethoscope)
4. Add "HC+" text
5. Export as PNG with transparent background
6. Save as `/frontend/public/logo.png`

### Option 2: Use an AI Generator
1. Use [DALL-E](https://openai.com/dall-e-2) or [Midjourney](https://www.midjourney.com/)
2. Prompt: "minimalist medical healthcare logo with cross symbol, modern design, blue and white colors"
3. Download and save as `/frontend/public/logo.png`

### Option 3: Use Free Icons
1. Download from [Flaticon](https://www.flaticon.com/)
2. Search for "medical cross" or "healthcare"
3. Download PNG format
4. Save as `/frontend/public/logo.png`

---

## 🎯 How to Use

### For Users (No Login Required)

1. **Visit Homepage** - `http://localhost:5173/`
2. **Click "Start Diagnosis"**
3. **Enter or speak your symptoms**
4. **Get AI predictions**
5. **View disease details**
6. **Find nearby hospitals**
7. **Access emergency services if needed**

### With User Account

1. **Register** - Create account with email/password or Google
2. **Login** - Access your profile
3. **View History** - See past consultations
4. **Save Medical Records** - Track your health journey

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `GET /api/auth/verify` - Verify token (protected)

### Diseases
- `POST /api/diseases/predict` - Predict disease from symptoms
- `GET /api/diseases` - Get all diseases
- `GET /api/diseases/search?query=...` - Search diseases
- `GET /api/diseases/:diseaseId` - Get disease details

### Organs
- `GET /api/organs` - Get all organs
- `GET /api/organs/:organSystem/diseases` - Get diseases by organ

### Hospitals
- `GET /api/hospitals/nearby?latitude=...&longitude=...&radius=...` - Find nearby
- `GET /api/hospitals/search?city=...` - Search by city
- `GET /api/hospitals/:hospitalId` - Get hospital details

### Medical History
- `GET /api/medical-history` - Get user history (protected)

---

## 🌍 Supported Languages

The app supports voice recognition and text-to-speech in:
- 🇮🇳 English (India)
- 🇮🇳 Hindi
- 🇮🇳 Marathi
- 🇮🇳 Bengali
- 🇮🇳 Tamil
- 🇮🇳 Telugu
- 🇮🇳 Kannada
- 🇮🇳 Malayalam
- 🇮🇳 Gujarati
- 🇮🇳 Punjabi
- 🇺🇸 English (US)
- 🇬🇧 English (UK)

---

## 📱 Mobile Support

The Web Speech API works on:
- ✅ Chrome (Desktop & Mobile)
- ✅ Edge (Desktop & Mobile)
- ✅ Safari (iOS 14.5+)
- ❌ Firefox (limited support)

For production, consider using:
- Google Cloud Speech-to-Text API
- Azure Speech Services
- AWS Transcribe

---

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- SQL injection prevention
- XSS protection
- CORS configuration
- Environment variables for secrets
- Session management

---

## 🚨 Emergency Services

The app provides one-click access to:
- 🚑 Ambulance: 102 / 108
- 👮 Police: 100
- 🚒 Fire Brigade: 101

These automatically initiate phone calls on mobile devices.

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check MySQL is running
mysql --version

# Test connection
mysql -u root -p

# Grant privileges
GRANT ALL PRIVILEGES ON homecare_plus.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Backend Not Starting
```bash
# Check if port 5000 is free
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Kill process if needed
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Mac/Linux
```

### Frontend Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Try with legacy peer deps
npm install --legacy-peer-deps
```

### Voice Recognition Not Working
- Ensure you're using HTTPS (or localhost)
- Grant microphone permissions
- Use supported browser (Chrome recommended)
- Check browser console for errors

---

## 📈 Future Enhancements

- [ ] Add real AI/ML model integration
- [ ] Implement appointment booking
- [ ] Add doctor consultation feature
- [ ] Create mobile app (React Native)
- [ ] Add medication reminders
- [ ] Implement health tracking
- [ ] Add telemedicine features
- [ ] Create admin dashboard
- [ ] Add multilingual content translation
- [ ] Implement progressive web app (PWA)

---

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

---

## 📄 License

This project is created for educational purposes.

---

## 👨‍💻 Developer

Created with ❤️ for better healthcare accessibility

---

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review the code comments
- Consult the API documentation

---

## 🎉 Getting Started Checklist

- [ ] MySQL installed and running
- [ ] Database schema loaded
- [ ] Backend dependencies installed
- [ ] Backend .env configured
- [ ] Backend server running (port 5000)
- [ ] Frontend dependencies installed
- [ ] Logo added to /public/logo.png
- [ ] Frontend server running (port 5173)
- [ ] Browser opened to http://localhost:5173
- [ ] Test voice recognition
- [ ] Test disease prediction
- [ ] Test hospital search
- [ ] Create user account
- [ ] Test all features

---

**Congratulations! 🎊 HOMECARE+ is now running!**

Visit: http://localhost:5173 and start exploring!
