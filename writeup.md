# GuardianLink: AI-Powered Emergency Response Coordinator

> **"When seconds count and words fail, GuardianLink speaks for you."**

## 🚨 The Problem
For senior citizens or individuals with chronic conditions, medical emergencies (like shortness of breath, stroke, or falls) often result in **panic** and an **inability to communicate clearly**.

In a critical moment:
1.  Speaking to a 911 operator can be physically difficult.
2.  Locating the nearest specific hospital address is impossible mentally.
3.  Family members and neighbors are often notified too late.

## 💡 The Solution
**GuardianLink** is a web application designed to act as an automated central nervous system during a medical crisis. With a single tap and a brief voice description, the app triggers a parallel response protocol:

1.  **Contextual 911 Scripting:** Generates a concise, medically relevant script for operators using **Gemini 2.5 Flash**.
2.  **Hospital Grounding:** Locates the nearest emergency facility using **Google Maps Grounding**.
3.  **Community Dispatch:** Alerts a network of registered volunteer responders (CPR/EMT certified) within a 2-mile radius.
4.  **Evidence Collection:** Records live video/audio of the incident for first responders to review upon arrival.
5.  **Calming Feedback:** Uses **Gemini TTS** to provide reassuring audio instructions to the user.

## 🤖 Powered by Google Gemini
GuardianLink relies heavily on the Google GenAI SDK to handle unstructured data and logic in real-time.

### 1. Dynamic Script Generation (Gemini 2.5 Flash)
When the user dictates "I can't breathe" or "Chest pain", we combine that with their stored medical profile and GPS coordinates. Gemini transforms this raw data into a precise, 35-word script designed for emergency operators.

```typescript
const prompt = `
  Emergency Context:
  User: ${profile.name}
  Conditions: ${profile.medicalConditions}
  Location: Lat ${coords.latitude}, Long ${coords.longitude}
  Situation: ${situation} // e.g. "I fell and can't get up"

  Task: Write a concise, clear emergency script (max 35 words) that a user should read to a 911 operator. 
`;

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt,
});
```

### 2. Real-World Grounding (Google Maps Tool)
In an emergency, hallucinations are dangerous. We use the **Google Maps Tool** to ensure the hospital data returned is real, accurate, and the absolute closest facility to the user's live coordinates.

```typescript
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: "Find the nearest emergency room...",
  config: {
    tools: [{ googleMaps: {} }], // Grounding enabled
    toolConfig: {
      retrievalConfig: {
        latLng: { latitude, longitude }
      }
    }
  }
});
```

### 3. Empathetic Audio Response (Gemini TTS)
To reduce user panic, we use the Text-to-Speech model to generate a calming voice command based on the specific situation.

```typescript
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-preview-tts",
  contents: [{ parts: [{ text: "Help is on the way. Stay where you are and breathe slowly." }] }],
  config: {
    responseModalities: [Modality.AUDIO],
    speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
    },
  },
});
```

## 📱 Application Flow

### Step 1: The Panic Button
A high-contrast, accessible interface designed for seniors. One tap initiates the sequence.

### Step 2: Intelligent Intake
The app activates the **Selfie Camera** and **Microphone**.
*   **Dictation:** The user says what is wrong (e.g., "My chest hurts").
*   **Visuals:** The app records the user's condition to share with paramedics.

### Step 3: The Live Emergency Dashboard
The app enters "Live Mode," performing four actions simultaneously:
*   **Status 1:** Displays the AI-generated script for the 911 call.
*   **Status 2:** Shows the located hospital destination.
*   **Status 3:** Sends SMS/Email to family contacts (simulated).
*   **Status 4:** Pages community volunteers (simulated) based on the "Community Network" settings.

## 🛠️ Tech Stack
*   **Frontend:** React 19, TypeScript, Vite
*   **AI:** Google GenAI SDK (`@google/genai`)
*   **Browser APIs:**
    *   `Navigator.geolocation` (High accuracy location)
    *   `MediaDevices.getUserMedia` (Camera/Mic access)
    *   `Web Speech API` (Speech-to-text dictation)
    *   `MediaRecorder` (Video blob capture)
*   **Styling:** Tailwind CSS

## 🔮 Future Improvements
1.  **Integration with Smart Wearables:** Triggering alerts automatically via fall detection data from watches.
2.  **Live Video Streaming:** Replacing the recorded blob with a WebRTC stream directly to 911 dispatch.
3.  **Twilio Integration:** Replacing simulated SMS with actual telephony API calls.

---

*This project was built to demonstrate how Multimodal AI can be applied to time-sensitive, critical safety infrastructure.*