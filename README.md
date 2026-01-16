
# BIET Generic OBE Attainment System

A fully configurable, web-based Outcome Based Education (OBE) system designed to automate the calculation of Course Outcome (CO) and Program Outcome (PO) attainment as per NBA/NAAC guidelines.

## 🚀 Overview

This system is built to be institutional-agnostic. All thresholds, weightages, and mapping rules are configurable via the Admin dashboard, allowing any academic institution to adapt the logic to their specific assessment patterns.

### Key Features

- **Admin Dashboard**: Centralized control over institutional configurations.
- **Faculty Management**: Add/Delete faculty members and manage login credentials.
- **Dynamic Course Allotment**: Assign subjects to faculty across different branches and academic years.
- **Multi-Branch Support**: Logical grouping of subjects by Department (IT, CS, AI-ML, etc.) and Academic Year.
- **AI-Powered CO Generation**: Integrated with Google Gemini API to suggest specific Course Outcomes based on subject descriptions.
- **Attainment Heatmaps**: Real-time visualization of CO-PO attainment levels across the entire institution.

## 🛠 Tech Stack

- **Frontend**: React (TypeScript) + Tailwind CSS
- **Icons**: Lucide React
- **AI Engine**: Google Gemini API (@google/genai)
- **Data Visualization**: Recharts (planned)

## ⚙️ Configuration

The system uses a flexible `OBEConfig` structure:
- **Thresholds**: Define percentage marks required for Attainment Level 1, 2, and 3.
- **Weightages**: Configurable Internal (e.g., 30%) and External (e.g., 70%) weightages.
- **Mappings**: Direct articulation mapping between COs and POs.

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd generic-obe-attainment-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file and add your Google Gemini API Key:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `App.tsx`: Main application logic and routing.
- `types.ts`: TypeScript interfaces for the OBE data model.
- `services/`: Backend/External service integrations (e.g., Gemini AI).
- `index.html`: Entry point for the web application.

## 🛡 License

This project is for academic purposes at BIET Jhansi.
