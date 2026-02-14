[Uploading README-2.md…]()
# 🛡️ EquiMigrant - AI-Powered Migration Safety Platform

> **Protecting Vulnerable Workers Through Intelligent Contract Analysis**

[![Gemini 3 Hackathon](https://img.shields.io/badge/Hackathon-Gemini%203-4285F4?style=flat-square&logo=google)](https://cerebralvalley.ai)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%20AI-8E75FF?style=flat-square)](https://ai.google.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)

---

## 🌍 The Problem

Every year, millions of migrant workers face:
- **Exploitative contracts** with hidden clauses (e.g., passport confiscation, unpaid wages)
- **Financial traps** where salaries don't cover living costs
- **Language barriers** preventing them from understanding their rights
- **Legal risks** from visa fraud and illegal employment practices
- **Cultural shocks** they're unprepared for

**EquiMigrant** is an AI-powered platform that analyzes job offers, scans contracts, and provides personalized migration guidance in multiple languages — protecting workers *before* they leave home.

---

## ✨ Key Features

### 🤖 AI Swarm Architecture
EquiMigrant uses a **multi-agent swarm** powered by **Gemini 3 Flash** to analyze migration offers from multiple perspectives:

| Agent | Purpose | What It Does |
|-------|---------|--------------|
| **Legal Guardian** | Legal Compliance | Checks for visa fraud, illegal clauses, passport retention, labor law violations |
| **Economist** | Financial Viability | Calculates PPP-adjusted salaries, cost of living, hidden fees, "poverty traps" |
| **Settler** | Living Conditions | Assesses healthcare access, culture shocks, safety scores, education quality |
| **Consensus Engine** | Final Decision | Synthesizes all agent analyses into a single, actionable risk score (0-100) |

---

### 🔍 Core Capabilities

#### 1️⃣ **Job Offer Analysis**
- Paste a job offer → Get instant risk assessment
- Legal risk score (0-100) with color-coded visual gauge
- Identifies hidden costs (e.g., visa fees, agent commissions)
- Culture shock warnings (e.g., strict laws, dress codes)
- Living condition breakdown (Healthcare, Education, Housing, Safety)

#### 2️⃣ **Contract Scanner** (Gemini Vision)
- Upload photos of contracts (printed, handwritten, any language)
- Extracts text using Gemini's OCR + Vision API
- Detects language automatically
- Identifies **red flags** (passport confiscation, unpaid overtime)
- Suggests **negotiation points** (salary increase, holiday rights)

#### 3️⃣ **AI Negotiation Coach**
- Generates negotiation strategies based on contract analysis
- Suggests specific contract amendments
- Provides conversation scripts for negotiations
- Calculates risk reduction after proposed changes

#### 4️⃣ **Better Alternatives Recommender**
- Suggests safer migration destinations with similar roles
- Compares salaries, safety scores, and quality of life
- Uses current offer as baseline to find upgrades

#### 5️⃣ **Multilingual Voice Assistant**
- Speak in your native language (Hindi, Arabic, Spanish, Bengali, etc.)
- Get instant voice responses in the same language
- Ask questions about contracts, rights, or migration safety
- Powered by Gemini's Speech-to-Speech capabilities

#### 6️⃣ **Universal Translator**
- Translate any page content into 18+ languages
- Includes: Hindi, Arabic, Spanish, French, Bengali, Urdu, Tamil, Telugu, Chinese, Russian, Thai, Swahili, etc.
- Maintains context and legal terminology accuracy

---

## 🏗️ Architecture

### Tech Stack

#### **Backend** (Python + FastAPI)
- **Framework**: FastAPI for async API endpoints
- **AI Model**: Google Gemini 3 Flash Preview (`gemini-3-flash-preview`)
- **AI Agents**: Swarm orchestrator coordinating 4 specialized agents
- **Vision AI**: Gemini Vision for contract scanning (OCR + handwriting recognition)
- **Voice AI**: Gemini Speech for TTS and voice interactions
- **Data Models**: Pydantic for request/response validation

#### **Frontend** (React + Vite)
- **Framework**: React 19.2 with Vite 7.3 for fast HMR
- **Styling**: Tailwind CSS 4.1 with custom design system
- **Components**: Lucide React icons, Recharts for data visualization
- **State**: React hooks for lightweight state management
- **API Client**: Axios for backend communication

### System Flow

```
┌─────────────────┐
│   User Input    │
│ (Text/Voice/    │
│  Image)         │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│      React Frontend (Vite)          │
│  • JobForm                          │
│  • ContractScanner                  │
│  • VoiceAssistant                   │
│  • NegotiationPanel                 │
└────────┬────────────────────────────┘
         │ HTTP/REST
         ▼
┌─────────────────────────────────────┐
│   FastAPI Backend (Python)          │
│  • /analyze-migration               │
│  • /scan-contract                   │
│  • /negotiate                       │
│  • /recommend                       │
│  • /voice-respond                   │
│  • /translate                       │
│  • /tts                             │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Gemini 3 Flash API                │
│  • Text Generation (JSON mode)      │
│  • Vision (Contract OCR)            │
│  • Speech-to-Speech                 │
│  • Multilingual Translation         │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Swarm Orchestrator                │
│  ┌────────────────────────────────┐ │
│  │  Legal Guardian Agent          │ │
│  │  • Visa fraud detection        │ │
│  │  • Labor law compliance        │ │
│  │  • Risk scoring (0-100)        │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │  Economist Agent               │ │
│  │  • PPP salary analysis         │ │
│  │  • Cost of living calc         │ │
│  │  • Poverty trap detection      │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │  Settler Agent                 │ │
│  │  • Culture shock warnings      │ │
│  │  • Healthcare/education info   │ │
│  │  • Safety assessment           │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │  Consensus Engine              │ │
│  │  • Aggregates agent outputs    │ │
│  │  • Final advice synthesis      │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **Gemini API Key** ([Get one here](https://ai.google.dev))

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/SIDR1921/equimigrant.git
cd equimigrant/equimigrate
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn python-dotenv google-genai pydantic

# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Run backend
uvicorn main:app --reload
```

Backend will start at `http://localhost:8000`

#### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will start at `http://localhost:5173`

---

## 📖 Usage Examples

### Example 1: Analyzing a Job Offer
```javascript
POST http://localhost:8000/analyze-migration
Content-Type: application/json

{
  "origin": "India",
  "destination": "Dubai, UAE",
  "job_description": "Domestic Helper",
  "salary": "800 AED",
  "offer_text": "Urgent requirement for housemaid in Dubai. Salary 800 AED. Passport must be submitted to employer upon arrival. No holidays for first 6 months. Visa costs deducted from salary."
}
```

**Response:**
```json
{
  "legal_risk": 85,
  "economic_verdict": "REJECT: Poverty trap detected. Salary below living wage.",
  "culture_shocks": [
    "Strict dress codes in public",
    "No alcohol consumption allowed",
    "Public displays of affection are illegal"
  ],
  "living_conditions": {
    "healthcare": "Expensive for migrants without insurance",
    "education": "High quality but costly for expatriates",
    "housing": "Unaffordable on this salary",
    "safety": "High personal safety, low worker rights protection"
  },
  "final_advice": "⚠️ CRITICAL RISK: Passport confiscation is illegal. This contract violates UAE labor law. Salary insufficient for basic needs.",
  "hidden_costs": [
    "Visa sponsorship fees (typically 3000-5000 AED)",
    "Medical fitness test (500 AED)",
    "Agent commission (often 2-3 months salary)",
    "Emergency fund requirement"
  ]
}
```

### Example 2: Scanning a Contract
```javascript
POST http://localhost:8000/scan-contract
Content-Type: application/json

{
  "image_data": "<base64_encoded_image>",
  "file_name": "contract.jpg"
}
```

**Response:**
```json
{
  "extracted_text": "Employment Contract... [full OCR text]",
  "detected_language": "Arabic",
  "red_flags": [
    "Clause 4.2: Employee must surrender passport to employer",
    "Clause 6.1: No leave allowed for first 12 months",
    "Clause 8.3: Salary payment 'as per employer discretion'"
  ],
  "negotiation_points": [
    "Request passport to be kept by employee or embassy",
    "Negotiate minimum 1 day off per week as per labor law",
    "Demand fixed salary payment date in contract"
  ],
  "summary": "Contract contains multiple illegal clauses violating UAE labor law. Immediate renegotiation required."
}
```

---

## 🎯 Key Innovations for Gemini 3 Hackathon

### 1. **Multi-Agent Swarm Intelligence**
- Novel use of Gemini for **swarm orchestration**
- Each agent has specialized expertise (legal, economic, social)
- Consensus engine synthesizes diverse perspectives

### 2. **Multimodal AI Integration**
- **Text**: Job offer analysis with JSON-structured responses
- **Vision**: Contract scanning with OCR + handwriting recognition
- **Speech**: Bidirectional voice interactions in 18+ languages
- **Translation**: Context-aware legal document translation

### 3. **Social Impact Focus**
- Addresses real-world vulnerability of 280M+ migrant workers globally
- Prevents human trafficking and labor exploitation
- Democratizes access to legal/financial advice

### 4. **Cross-Cultural Intelligence**
- Culture shock warnings tailored to origin + destination
- Language-agnostic interface (voice + text translation)
- Respects local laws and customs in recommendations

---

## 🛠️ API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/analyze-migration` | POST | Analyze job offer across legal, economic, social dimensions |
| `/scan-contract` | POST | OCR + red flag detection for contract images |
| `/negotiate` | POST | Generate negotiation strategies and scripts |
| `/recommend` | POST | Suggest better migration alternatives |
| `/voice-respond` | POST | Multilingual voice query handling |
| `/translate` | POST | Translate text into target language |
| `/tts` | POST | Text-to-speech audio generation |

---

## 📁 Project Structure

```
equimigrant/
└── equimigrate/
    ├── backend/
    │   ├── main.py           # FastAPI app + endpoints
    │   ├── agents.py         # Swarm orchestrator + agent logic
    │   ├── models.py         # Pydantic data models
    │   └── .env              # Gemini API key (not in repo)
    └── frontend/
        ├── src/
        │   ├── App.jsx                    # Main application
        │   ├── components/
        │   │   ├── JobForm.jsx            # Job offer input
        │   │   ├── RiskMeter.jsx          # Visual risk gauge
        │   │   ├── ContractScanner.jsx    # Image upload + OCR
        │   │   ├── VoiceAssistant.jsx     # Speech interaction
        │   │   ├── NegotiationPanel.jsx   # Contract negotiation
        │   │   ├── RecommendationsPanel.jsx # Alternative destinations
        │   │   ├── TranslateDialog.jsx    # Language translation
        │   │   └── AgentCard.jsx          # Agent output display
        │   ├── App.css                    # Custom design system
        │   └── index.css                  # Global styles
        ├── package.json
        └── vite.config.js
```

---

## 🎨 Design Highlights

- **Dark Mode First**: Elegant dark theme with purple accent colors
- **Animated UI**: Smooth transitions, gradient shifts, pulse effects
- **Accessibility**: High contrast, clear typography, keyboard navigation
- **Responsive**: Mobile-first design for on-the-go workers

---

## 🌟 Future Enhancements

- [ ] **Real-time chat** with AI counselor via WebSocket
- [ ] **Blockchain verification** of contracts on-chain
- [ ] **Community reviews** of employers and agents
- [ ] **Government API integration** for real-time visa status checks
- [ ] **SMS/WhatsApp bot** for low-bandwidth users
- [ ] **Legal aid network** connection to pro-bono lawyers
- [ ] **Emergency SOS button** for workers in danger

---

## 🤝 Contributing

We welcome contributions! This project aims to protect vulnerable workers — every improvement matters.

```bash
# Fork the repo
# Create a feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m "Add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📜 License

This project is open source for humanitarian purposes. See `LICENSE` file for details.

---

## 🙏 Acknowledgments

- **Cerebral Valley** for hosting the Gemini 3 Hackathon
- **Google Gemini Team** for the powerful AI models
- **International Labour Organization (ILO)** for migration research
- **Migrant worker advocacy groups** for inspiration

---

## ���� Contact

**Project Lead**: SIDR1921  
**GitHub**: [@SIDR1921](https://github.com/SIDR1921)  
**Repository**: [github.com/SIDR1921/equimigrant](https://github.com/SIDR1921/equimigrant)

---

## 🏆 Hackathon Submission

**Hackathon**: Gemini 3 (Cerebral Valley)  
**Category**: Social Impact / Multimodal AI  
**Built with**: Google Gemini 3 Flash, FastAPI, React, Vite  

---

<div align="center">

**💙 Built with compassion for those who risk everything for a better life 💙**

*"Every migrant worker deserves a fair chance — and the right to know their rights."*

</div>
