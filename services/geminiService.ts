import { GoogleGenAI, Modality } from "@google/genai";
import { Coordinates, UserProfile } from "../types";

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// 1. Generate a concise emergency script to be read to 911 or sent to contacts
export const generateEmergencyScript = async (
  profile: UserProfile,
  coords: Coordinates,
  situation: string
): Promise<string> => {
  const ai = getClient();
  try {
    const prompt = `
      Emergency Context:
      User: ${profile.name}
      Conditions: ${profile.medicalConditions}
      Location: Lat ${coords.latitude}, Long ${coords.longitude} (Approx address: ${profile.address})
      Situation: ${situation}

      Task: Write a concise, clear emergency script (max 35 words) that a user should read to a 911 operator. 
      It must state "This is an emergency", the specific condition, and the location clearly.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "This is an emergency. Help needed at current location.";
  } catch (error) {
    console.error("Script generation failed", error);
    return `This is an emergency. ${profile.name} needs help at current location.`;
  }
};

// 2. Find nearest hospital using Google Maps Grounding
export const findNearestHospital = async (coords: Coordinates): Promise<{ name: string; address: string }> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Find the nearest emergency room or hospital to my location. Return just the name and address.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: coords.latitude,
              longitude: coords.longitude
            }
          }
        }
      }
    });

    // Extracting grounding information if available, otherwise fallback to text
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
      // Look for a map chunk
      const mapChunk = chunks.find(c => c.web?.title || c.web?.uri); // Maps chunks often structure like web in this SDK version or similar
      // Simple parsing of text response since structured object return varies by query
      return {
        name: "Nearest Emergency Facility", // Fallback name if extraction is complex
        address: response.text.substring(0, 100) // Truncate for safety
      };
    }

    return {
      name: "Local Emergency Services",
      address: response.text
    };

  } catch (error) {
    console.error("Hospital search failed", error);
    return { name: "Local Hospital", address: "Unable to locate specifically" };
  }
};

// 3. Generate Audio Instructions (TTS) to calm the user
export const generateCalmInstructions = async (situation: string): Promise<ArrayBuffer> => {
  const ai = getClient();
  
  // Step 1: Generate the text message first (Reasoning)
  // We use the standard flash model for this to ensure we get good text.
  // This avoids issues where the TTS model rejects complex instruction prompts.
  let message = "Help is being contacted. Please remain calm and stay where you are.";
  try {
    const textPrompt = `
      Situation: ${situation}
      Task: Write a single, short, calming sentence to say to the user. 
      Example: "Help is on the way, breathe slowly."
    `;
    const textResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: textPrompt,
    });
    if (textResponse.text) {
        message = textResponse.text;
    }
  } catch (e) {
    console.warn("Failed to generate custom calming text, using default.", e);
  }

  // Step 2: Convert to Speech
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: message }] }], 
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data received from model");

    // Decode base64 to ArrayBuffer
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;

  } catch (error) {
    console.error("TTS failed", error);
    throw error;
  }
};