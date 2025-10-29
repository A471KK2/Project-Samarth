# 🌾 Project Samarth

**Empowering Agriculture with Data and Intelligence**

Project Samarth is a cloud-native, AI-powered platform that integrates **agricultural and climate data** across India to deliver meaningful insights through natural language queries. It bridges the gap between complex datasets and easy decision-making — for farmers, researchers, and policymakers alike.

---

## 🌟 Overview

Project Samarth is an end-to-end web application built with a **modular cloud architecture**, combining:

- **Frontend**: Responsive website with intuitive navigation  
- **Backend**: RESTful APIs and PostgreSQL database  
- **AI Layer**: Natural Language Query understanding (powered by GPT-4)  

It allows users to ask real-world agricultural questions and receive **data-backed, cited answers** instantly.

---

## 🏗️ Website Structure

| Page | Description |
|------|--------------|
| **Home** | Overview of Samarth’s mission, stats, and features |
| **Platform** | Explains the 4-step process (Parse → Fetch → Analyze → Answer) |
| **About** | Mission statement, problem & solution overview, data integrity |
| **Chat** | Interactive Q&A interface with real-time responses and source citations |

---

## 🗄️ Backend & Database

**Database:** PostgreSQL  
Includes 5 key datasets:

| Table | Description |
|--------|-------------|
| `agricultural_data` | 1000+ records of crop production data |
| `climate_data` | 500+ climate records across states |
| `crop_reference` | 15 major crop categories |
| `geographic_data` | 28 states and 20 districts |
| `data_sources` | Source citation tracking for transparency |

---

## 🧠 API Endpoints

### 🔹 Ask Intelligent Questions
```http
POST /api/samarth/ask
{
  "question": "Compare rainfall in Punjab and Maharashtra"
}
Response:
{
  "answer": "...",
  "citations": ["data.gov.in", "IMD Records"],
  "dataUsed": "climate_data"
}
