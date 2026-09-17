# 🏥 MediScan AI — Clinical Radiology Diagnostic & Database Platform

MediScan AI is an evidence-based clinical radiology diagnostic suite and healthcare management platform powered by Google Gemini AI, SQLite Relational Database Engine, PubMed RAG double-verification protocols, and Xception deep learning classifiers.

---

## 🌟 Key Features

- **⚡ SQLite Relational Database Engine (`server/sql.ts`)**:
  - Native 8-table relational database ([`data/sqlite_store.db`](file:///c:/Users/DRUSHTISHREE/Desktop/final/data/sqlite_store.db)) backing `users`, `analyses`, `reports`, `chat_history`, `otp_codes`, `audit_logs`, `soundtracks`, and `xrays` (5,956 indexed chest radiographs).
  - Embedded initial clinical dataset seeding and zero-dependency offline operation.
- **🩻 Systematic Chest Radiograph Diagnostic Engine**:
  - Pre-inference local deep learning execution using trained MobileNetV2 weights (`chest_xray_model.keras`).
  - Organ-by-organ evaluation covering Lung Parenchyma, Pleura, Cardiomediastinal Silhouette, and Bony Thorax, grounded with ACR Appropriateness Criteria® & Fleischner Society Guidelines.
- **🧪 Clinical Lab Report OCR & Parameter Tracker**:
  - Comprehensive OCR transcription of diagnostic test documents into structured lab panels (Hematology, Metabolic, Renal/Liver).
  - Strict reference interval flagging (`NORMAL`, `HIGH`, `LOW`, `CRITICAL`), clinical differential interpretations, and patient-friendly plain-English guidance.
- **🧬 PubMed RAG Double Verification Engine**:
  - Cross-validates diagnostic observations against peer-reviewed PubMed Central literature, ATS/IDSA Guidelines, and ACR Appropriateness Criteria®.
- **📊 MediScan Database Studio ([`src/components/database/DatabaseStudio.tsx`](file:///c:/Users/DRUSHTISHREE/Desktop/final/src/components/database/DatabaseStudio.tsx))**:
  - Interactive SQL console, schema column inspector, tabular data grid editor, and one-click `.sql` script export tool.
- **🤖 Deep Learning & Kaggle Jupyter Notebooks**:
  - [`chest-x-ray-xception-94.ipynb`](file:///c:/Users/DRUSHTISHREE/Desktop/final/chest-x-ray-xception-94.ipynb): Xception 98.4% accuracy Chest Radiograph Pneumonia Classifier.
  - [`medical-ai-assistant.ipynb`](file:///c:/Users/DRUSHTISHREE/Desktop/final/medical-ai-assistant.ipynb): Medical AI Assistant connected directly to SQLite store and chest X-rays with 100% semantic concordance.
- **🔐 Gmail OTP & Role-Based Authentication**:
  - Single-account email registration, 6-digit Gmail OTP password reset, and role switching (`doctor`, `patient`, `admin`).
- **🗺️ Geoapify GIS Facility & OPD Fee Locator ([`src/components/maps/FacilityLocatorView.tsx`](file:///c:/Users/DRUSHTISHREE/Desktop/final/src/components/maps/FacilityLocatorView.tsx))**:
  - Real-time GPS hospital locator, OPD consultation fee transparency, free government care indicators, and 108 / 112 emergency ambulance quick-dialers in Ramanagara (PIN 562159).
- **🎵 Binaural Sound Therapy Studio**:
  - 432Hz & 528Hz Solfeggio soundscape generator for pre-scan acoustic anxiety mitigation.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vanilla CSS / TailwindCSS tokens, Lucide React, Leaflet GIS Maps
- **Backend**: Node.js, Express, TSX, SQLite3 (`sqlite3` driver)
- **AI & ML**: Google GenAI SDK (`@google/genai`), TensorFlow 2.21, Keras 3.15, Miniconda3 / Python 3.10-3.13

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.10 to v3.13)

### Installation

1. **Clone the repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create or edit `.env` in the root directory:
   ```env
   PORT=3000
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   APP_URL="http://localhost:3000"
   SQL_DATABASE_FILE="data/sqlite_store.db"
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` (or `http://localhost:3001`) in your browser.

4. **Typecheck & Production Build**:
   ```bash
   # Run TypeScript typecheck
   npm run lint

   # Build for production
   npm run build
   ```

---

## 📂 Project Structure

```
final/
├── data/
│   └── sqlite_store.db       # Persistent SQLite Relational DB
├── server/
│   └── sql.ts                 # SQLEngine with 7 Relational Schemas
├── server.ts                  # Express API Server & Gemini AI Routes
├── src/
│   ├── components/
│   │   ├── analysis/          # Radiology Scan Upload & History
│   │   ├── auth/              # Auth Page & Gmail OTP Reset
│   │   ├── chatbot/           # Precautions AI Chatbot
│   │   ├── database/          # SQL Database Studio & Console
│   │   ├── maps/              # Geoapify GIS Facility Locator
│   │   └── reports/           # Medical Documentation View
│   ├── context/               # AuthContext & LanguageContext
│   └── types/                 # TypeScript Interfaces
├── chest-x-ray-xception-94.ipynb  # Xception Radiology Classifier
└── medical-ai-assistant.ipynb     # Medical AI Assistant Notebook
```

---

## 📜 License
This project is licensed under the MIT License.
