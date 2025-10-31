# 🧩 TalentFlow — Recruitment & Assessment Management Platform

A complete **Recruitment and Assessment Management System** built using **React + Vite + Tailwind CSS**, integrated with a simulated backend powered by **Mock Service Worker (MSW)** and **Dexie.js** for local data persistence.

---

## 🚀 Overview

TalentFlow streamlines the hiring process by allowing recruiters to:
- Create and manage job postings
- Track candidate progress
- Build and conduct assessments
- View assessment results
- Manage users through a protected login system

---

## 🧠 Login Credentials

To access the application, use the following credentials:

| **Email** | **Password** |
|------------|--------------|
| **b22ee009@nitm.ac.in** | **123456** |

These credentials are required for login during local testing or demo purposes.

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/talentflow.git
cd talentflow
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Start Development Server
```bash
npm run dev
```

Your app will run on:  
👉 **http://localhost:5173**

---

## 🧩 Project Architecture

```
src/
│
├── api/
│   ├── db/
│   │   └── dexie.js              # Local IndexedDB setup using Dexie
│   ├── handlers/                 # API request handlers for MSW
│   │   ├── assessmentHandlers.js
│   │   ├── authHandler.js
│   │   ├── candidatesHandlers.js
│   │   └── jobsHandlers.js
│   ├── msw/
│   │   └── server.js             # Mock Service Worker setup
│   └── seeds/
│       └── seedData.js           # Preloaded mock data for startup
│
├── assets/
│   ├── assessment1.jpg
│   └── home.png
│
├── components/
│   ├── AssessmentModule/
│   ├── CandidateModule/
│   │   ├── CandidateList.jsx
│   │   ├── KanbanBoard.jsx
│   │   ├── NotesSection.jsx
│   │   └── Timeline.jsx
│   ├── Forms/
│   │   ├── CandidateForm.jsx
│   │   └── JobForm.jsx
│   ├── layout/
│   │   ├── Layout.jsx
│   │   └── Navbar.jsx
│   ├── Modal/
│   │   ├── CandidateModal.jsx
│   │   └── JobModal.jsx
│   └── ui/
│       ├── HomeCard.jsx
│       └── ProtectedRoute.jsx
│
├── pages/
│   ├── Assessment/
│   │   ├── AssessmentBuilder.jsx
│   │   ├── AssessmentFormRuntime.jsx
│   │   └── AssessmentsPage.jsx
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── Candidate/
│   │   ├── CandidateProfile.jsx
│   │   └── Candidates.jsx
│   ├── Jobs/
│   │   ├── JobDetails.jsx
│   │   └── JobsBoard.jsx
│   └── HomePage.jsx
│
├── App.jsx
├── main.jsx
├── App.css
├── index.css
└── vite.config.js
```

---

## ⚙️ Technical Decisions

| **Technology** | **Purpose** |
|----------------|--------------|
| **React + Vite** | Fast and modular frontend framework with optimized build times |
| **Tailwind CSS** | Utility-first styling framework for responsive design |
| **Dexie.js** | Wrapper over IndexedDB for structured local storage |
| **MSW (Mock Service Worker)** | Simulated backend API handling |
| **React Router DOM** | Client-side routing and protected route setup |
| **Component-Based Architecture** | Separation of concerns and easy scalability |

---

## 🔐 Authentication & Protected Routes

- Users must log in to access protected pages.
- Auth data (token) is stored in `localStorage`.
- `ProtectedRoute.jsx` ensures unauthorized users are redirected to `/login`.

---

## 🧠 Known Issues / Fixes

| **Issue** | **Cause** | **Fix** |
|------------|------------|----------|
| **401 Unauthorized (e.g., /jobs/:id or /builder)** | Missing/invalid token in localStorage | Log in again to generate a new session |
| **Logout not redirecting** | Missing navigation after logout | Add `navigate("/login")` after clearing token |
| **Data lost after refresh** | MSW resets data on reload | Integrate real backend or persist Dexie data |

---

## 📈 Future Improvements

- Backend integration using **Node.js / Express** or **Firebase**
- Role-based dashboards (Admin vs Candidate)
- Enhanced analytics and reporting
- Email notifications for assessments
- Global search & filtering features

---

## 👨‍💻 Developer Info

**Developer:** Jitendra Dubey  
**B.Tech, Electronics & Communication Engineering**  
**National Institute of Technology Meghalaya**  
📧 **jitendradubey0122@gmail.com**

---

## 🪄 License

This project is licensed under the **MIT License**.  
Feel free to use, modify, and distribute it for educational or personal purposes.

---

### 🧩 Quick Login Info
> Email: **b22ee009@nitm.ac.in**  
> Password: **123456**

---

**Run → Build → Hire Smarter 🚀**
