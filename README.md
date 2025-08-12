# 📝 FormBuilder

FormBuilder is a full-stack MERN (MongoDB, Express, React, Node.js) application that lets users **create, publish, and solve interactive forms/quizzes** with multiple question types — supporting **Categorize (drag & drop)**, **Cloze (fill-in-the-blanks)**, and **Comprehension** questions — along with public shareable links, response collection, and scoring.

---

## 🚀 Tech Stack

### **Frontend**

- **React 18** (Vite)
- **React Router DOM** (SPA navigation)
- **MUI (Material-UI)** for responsive UI components
- **Tailwind CSS** (utility-first styling)
- **dnd-kit** for draggable Categorize question type
- **Axios** for API requests
- **React Hooks** for state management
- **Vercel** for frontend hosting

### **Backend**

- **Express.js**
- **Node.js**
- **MongoDB + Mongoose** (data persistence)
- **CORS** configured for dev & prod
- **cookie-parser** (auth/session support if needed)
- **dotenv** for environment variables
- **Render** for backend hosting

---

## ✨ Features

### **Form Creation**

- Create forms with **custom titles & descriptions**.
- Support for **three question types**:
  1. 🗂 **Categorize** — Drag & drop items into categories.
  2. ✏️ **Cloze** — Fill-in-the-blank or dropdown in a passage.
  3. 📖 **Comprehension** — Read a passage and answer MCQ, True/False, or short text.
- Define points, instructions, and mark questions required or optional.
- Upload images for items/passages (optional).

### **Form Publishing**

- Publish form to generate a **shareable public link**:

- Only published forms are accessible publicly.

### **Form Player (Public Quiz Mode)**

- Visitors can:
- Answer Categorize questions with drag & drop.
- Fill Cloze blanks (text or dropdown).
- Answer Comprehension questions.
- Real-time **required field validation** before submission.
- On submit:
- Store answers & score on backend.
- Show `Thank You` and results with score breakdown.

### **Authentication**

- User login/logout system using JWT/localStorage.
- Authenticated dashboard to manage your forms & see responses.

### **Response Management**

- View all form responses.
- Score calculation on submission (server-side).
- Calculate percentage and per-question correctness.

### **Deployment & API**

- Frontend deployed on **Vercel**.
- Backend deployed on **Render**.
- CORS configured to allow frontend domain.

---

## 📂 Project Structure

root/
├── backend/
│ ├── models/
│ ├── controllers/
│ ├── routes/
│ ├── server.js (Express app)
│ └── ...
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── services/ (axios API calls)
│ │ ├── pages/ (Dashboard, FormEditor, FormPlayer)
│ │ └── App.jsx
│ └── vite.config.js
│
├── .gitignore
├── README.md
└── ...

---

## ⚙️ Installation & Setup

### **1. Clone the repo**

### **2. Setup Backend**

**Environment variables (.env):**
PORT=4000
MONGO_URL=<your-mongodb-uri>
JWT_SECRET=<jwt-secret>

Run backend:
npm run dev # or node server.js

### **3. Setup Frontend**

cd ../frontend
npm install

Run frontend: npm run dev

---

## 🌐 Deployment

### **Backend (Render)**

- Deploy backend repo to Render.
- Add Environment Variables to Render:
  - `MONGO_URL`
  - `JWT_SECRET`
  - `PORT=4000`
- Enable CORS for your frontend's Vercel domain.

### **Frontend (Vercel)**

- Deploy frontend repo to Vercel.
- Set `VITE_API_BASE_URL` in Vercel project settings to point to your backend API (Render URL).

---

## 📖 How to Use

1. **Sign Up / Login**

   - Go to `/login`, enter credentials, and get authenticated.

2. **Create a Form**

   - Go to Dashboard → `Create New Form`.
   - Add questions (Categorize / Cloze / Comprehension).
   - Save.

3. **Publish**

   - When ready, click `Publish`.
   - Get your public link.

4. **Share & Collect Responses**

   - Share the `/form/:shareableLink` with respondents.
   - They fill and submit.
   - You see scores & stats in Dashboard.

5. **Logout**
   - Click `Logout` in the Navbar.

---

## ✅ API Endpoints (Backend Summary)

/api/login – POST (Authenticate user)  
/forms – CRUD for forms  
/questions – CRUD for form questions  
/responses/submit/:shareableLink – POST (Submit form response)  
/public/forms/:shareableLink – GET (Load public form data)

---

## 📸 Screenshots (suggested)

_(Add screenshots of UI: Dashboard, FormEditor, FormPlayer, Results)_

---

## 📌 Notes

- Make sure your backend CORS config includes:
  - localhost for dev, Vercel frontend domain for prod.
- Always run `npm run build` in frontend before deploying to Vercel.

---

## 🧑‍💻 Author

**Sahil Yuvraj kamble** – https://github.com/sahil2448

---
