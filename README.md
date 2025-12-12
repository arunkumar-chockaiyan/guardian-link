# GuardianLink 🚑

**AI-Powered Emergency Response Coordinator**

GuardianLink is a concept web application designed to assist seniors and individuals with medical conditions during critical emergencies. By leveraging **Google's Gemini API**, it acts as a central nervous system during a crisis, providing intelligent, parallel coordination of emergency services, family notifications, and community support.

> **⚠️ CRITICAL DISCLAIMER: PROTOTYPE ONLY**
>
> This application is a **Proof of Concept** built for demonstration and hackathon purposes. It is **NOT** connected to real emergency services (911) and should **NOT** be used in actual life-threatening situations. The "simulated" calls and alerts are purely visual or mock implementations.

## 🌟 Features

*   **One-Tap Activation**: A high-contrast, accessible "Panic Button" interface designed for high-stress situations.
*   **Intelligent Intake**: Activates the camera and microphone to capture the visual and audio context of the emergency immediately.
*   **AI Dispatch Script**: Uses **Gemini 2.5 Flash** to analyze the user's location, medical profile, and dictated situation to generate a concise, professional script for 911 operators.
*   **Real-World Grounding**: Utilizes **Google Maps Grounding** to locate the exact name and address of the nearest emergency medical facility.
*   **Community Responder Network**: Simulates a system that alerts registered CPR/EMT-certified volunteers within a 2-mile radius.
*   **Calming Voice Guidance**: Uses **Gemini TTS (Text-to-Speech)** to provide immediate, reassuring audio instructions to the user while help is organized.

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   A Google Cloud Project with the **Gemini API** enabled.
*   A valid API Key accessible via `process.env.API_KEY`.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/guardian-link.git
    cd guardian-link
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Ensure your build tool (e.g., Vite/Webpack) is configured to expose your Google GenAI API key.
    
    *Example (.env):*
    ```env
    API_KEY=your_actual_api_key_here
    ```

4.  **Run the Application**
    ```bash
    npm start
    ```

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript, Vite
*   **AI Models**: 
    *   `gemini-2.5-flash` (Logic & Scripting)
    *   `gemini-2.5-flash-preview-tts` (Audio Generation)
*   **Tools**: Google Maps Grounding
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.