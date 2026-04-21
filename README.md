# 📓 Mood Journal Project

A modern web-based **Mood Journal application** that helps users track their daily emotions, write journal entries, and analyze mood patterns over time. This project is built using **React, Vite, and Tailwind CSS** with additional features like authentication and AI-based mood analysis.

---

## 🚀 Features

- 🔐 User Authentication (Login / Register / Forgot Password)
- 📝 Create, edit, and delete journal entries
- 😊 Select and track daily moods
- 📅 Calendar view for mood tracking
- 📊 Mood statistics and insights
- 🔍 Search and filter journal entries
- 🤖 AI-based mood analysis
- 💾 Local storage-based data persistence
- 🎨 Responsive and modern UI

---

## 🛠️ Tech Stack

- **Frontend:** React (JSX)  
- **Build Tool:** Vite  
- **Styling:** Tailwind CSS  
- **State Management:** React Context API  
- **Storage:** Local Storage  
- **AI Service:** Custom AI Analysis (JavaScript)  

---

## 📂 Project Structure

```
Mood_journal_project-main/
│── src/
│   ├── components/
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Dashboard and analytics
│   │   ├── journal/         # Journal entry management
│   │   ├── layout/          # Header and layout components
│   │   └── ui/              # Reusable UI components
│   ├── context/             # Auth & Journal context
│   ├── services/            # AI analysis logic
│   ├── utils/               # Helper functions & storage
│   ├── constants/           # Mood definitions
│   ├── App.jsx              # Main App component
│   └── main.jsx             # Entry point
│
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/mood-journal.git
cd mood-journal
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the project
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🧠 How It Works

- Users register/login to access the app  
- They can write journal entries and select moods  
- Entries are stored in local storage  
- The dashboard shows:
  - Mood trends  
  - Recent entries  
  - Calendar visualization  
- AI module analyzes text and provides mood insights  

---

## 📊 Key Components

- **AuthContext** → Handles authentication  
- **JournalContext** → Manages journal data  
- **Dashboard** → Displays analytics and stats  
- **EntryEditor** → Add/Edit journal entries  
- **AI Analysis Service** → Analyzes mood patterns  

---

## 🔮 Future Improvements

- Backend integration (MongoDB / Firebase)  
- Real AI API (OpenAI / NLP models)  
- User profile customization  
- Dark mode support  
- Mobile app version  

---

## 👨‍💻 Author

**Nikhil Jangir**

---

## 📜 License

This project is for educational purposes and can be modified or extended.


---
> 🛡️ **Security Status:** Scan Completed ✅ | **Last Audit:** 21-April-2026
