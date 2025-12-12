import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Download, Image as ImageIcon, Loader2 } from 'lucide-react';

export const AssetGenerator: React.FC = () => {
  const [generating, setGenerating] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [card, setCard] = useState<string | null>(null);

  const generate = async (type: 'thumbnail' | 'card') => {
    setGenerating(type);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const isCard = type === 'card';
      
      const prompt = isCard 
        ? "A cinematic 16:9 promotional banner for 'GuardianLink'. A senior person's hand holding a smartphone displaying a large red 'HELP' button. Warm, reassuring home environment in background with soft bokeh. High resolution, photorealistic, 4k."
        : "A modern, minimalist vector app icon for 'GuardianLink'. A red shield shape containing a white medical cross and a digital heartbeat line. Clean, flat design, isolated on white background, high quality.";

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: isCard ? "16:9" : "1:1",
          }
        }
      });

      let base64Data = null;
      if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                  base64Data = part.inlineData.data;
                  break;
              }
          }
      }

      if (base64Data) {
        const url = `data:image/png;base64,${base64Data}`;
        if (isCard) setCard(url);
        else setThumbnail(url);
      }

    } catch (e) {
      console.error(e);
      alert("Generation failed");
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
          <ImageIcon /> Project Asset Generator
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Thumbnail Section */}
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-slate-600">Thumbnail (1:1)</h2>
            <div className="aspect-square bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative">
              {thumbnail ? (
                <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-contain" />
              ) : (
                <span className="text-slate-400 text-sm">No image</span>
              )}
            </div>
            <button 
              onClick={() => generate('thumbnail')}
              disabled={!!generating}
              className="bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {generating === 'thumbnail' && <Loader2 className="animate-spin" size={16}/>}
              Generate Thumbnail
            </button>
            {thumbnail && (
              <a href={thumbnail} download="thumbnail.png" className="text-center text-blue-600 text-sm font-bold hover:underline">Download PNG</a>
            )}
          </div>

          {/* Card Section */}
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-slate-600">Card (16:9)</h2>
            <div className="aspect-video bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative">
               {card ? (
                <img src={card} alt="Card" className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-400 text-sm">No image</span>
              )}
            </div>
            <button 
              onClick={() => generate('card')}
              disabled={!!generating}
              className="bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {generating === 'card' && <Loader2 className="animate-spin" size={16}/>}
              Generate Card
            </button>
            {card && (
              <a href={card} download="card.png" className="text-center text-purple-600 text-sm font-bold hover:underline">Download PNG</a>
            )}
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t text-center">
            <p className="text-sm text-slate-400">
                To return to main app, remove <code>#assets</code> from URL and refresh.
            </p>
        </div>
      </div>
    </div>
  );
};
