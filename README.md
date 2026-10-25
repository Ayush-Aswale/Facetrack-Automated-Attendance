# 🎯 FaceTrack - Automated Attendance Management System

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend%20%26%20Database-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An intelligent, real-time facial recognition attendance management web application. **FaceTrack** eliminates manual paper sign-ins, proxy attendance, and biometric hardware bottlenecks by providing an intuitive browser-based face enrollment, camera-assisted check-in, real-time attendance logging, and analytic dashboard.

---

## 📸 Overview & Key Features

- **⚡ Real-Time Attendance Verification**: Quick face-based check-in directly through the web camera.
- **👤 Instant User / Student Enrollment**: Capture profile photo from web camera along with name, department, and contact details with real-time feedback.
- **📊 Live Analytics Dashboard**:
  - Total registered users / students.
  - Daily check-in counts & presentee rate.
  - Interactive status trackers and quick navigation.
- **📜 Searchable Attendance Logs**:
  - Filter logs by date range or specific day.
  - Search by name or department.
  - Timestamped records with user identification.
- **🔒 Secure Cloud Architecture**: Powered by Supabase PostgreSQL database with Row Level Security (RLS) policies.
- **🎨 Modern & Responsive UI**: Clean interface built with Tailwind CSS, Lucide icons, and Shadcn UI components.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | [React 18](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/) |
| **Styling & Components** | [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/) |
| **State & Data Fetching** | [@tanstack/react-query](https://tanstack.com/query), React Hooks |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL, Storage, Realtime) |
| **Computer Vision / AI** | Hugging Face Transformers & Canvas-based image capture |

---

## 📁 Project Structure

```text
Facetrack/
├── .gitignore                      # Root Git ignore configuration
├── README.md                       # Project documentation
└── Project/                        # Main Application root
    ├── .env.example                # Sample environment configuration
    ├── index.html                  # HTML entry point
    ├── package.json                # Dependencies and npm scripts
    ├── tsconfig.json               # TypeScript configuration
    ├── vite.config.ts              # Vite bundler configuration
    ├── supabase/                   # Supabase database config & migrations
    │   ├── config.toml
    │   └── migrations/
    └── src/
        ├── main.tsx                # React application entry
        ├── App.tsx                 # Root router and layout
        ├── components/             # Reusable UI & Stat components
        │   ├── Navigation.tsx      # Main navigation bar
        │   ├── StatCard.tsx        # Dashboard metric cards
        │   └── ui/                 # Shadcn UI component suite
        ├── pages/
        │   ├── Dashboard.tsx       # System overview & statistics
        │   ├── Enroll.tsx          # Face capture & user enrollment
        │   ├── Attendance.tsx      # Live camera attendance scanner
        │   ├── Logs.tsx            # Historical attendance logs & search
        │   └── NotFound.tsx        # 404 handler
        └── integrations/
            └── supabase/           # Supabase client initialization & types
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18.x or newer)
- [npm](https://www.npmjs.com/) (or yarn / pnpm / bun)
- A [Supabase](https://supabase.com/) project (free tier works great)

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ayush-Aswale/Facetrack-Automated-Attendance.git
   cd Facetrack-Automated-Attendance/Project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   ```

4. **Database Setup (Supabase):**
   Run the SQL scripts located in `Project/supabase/migrations/` in your Supabase SQL Editor:
   - Creates the `users` table (`id`, `name`, `email`, `department`, `face_encoding`, `created_at`).
   - Creates the `attendance` table (`id`, `user_id`, `check_in_time`, `status`).
   - Configures foreign keys and RLS policies.

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` (or the URL displayed in the terminal).

---

## 📖 Usage Guide

1. **Enroll User / Student**:
   - Navigate to `/enroll`.
   - Allow camera permissions and click **Start Camera**.
   - Position the face in frame, click **Capture**, enter user details, and click **Enroll User**.
2. **Mark Attendance**:
   - Navigate to `/attendance`.
   - Click **Start Scanner**.
   - Position face in the video viewfinder and click **Scan Face** to record attendance in real time.
3. **Monitor Logs**:
   - Navigate to `/logs` to view timestamps, filter records by date, or search by student/employee name.
4. **Dashboard View**:
   - Navigate to `/` to view aggregate statistics and system status.

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).
