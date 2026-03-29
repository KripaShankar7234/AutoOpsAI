import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, Loader2, Mic, MicOff } from 'lucide-react';


const API_BASE = 'http://localhost:5000/api';

export default function MeetingUpload({ onProcessed }) {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition isn't supported in your browser.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
      let finalStr = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalStr += event.results[i][0].transcript + ' ';
        }
      }
      if (finalStr) {
        setTranscript(prev => prev + finalStr);
      }
    };

    recognition.onerror = (e) => {
      console.error(e);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
    // Auto stop after 10 seconds for demo purposes or let user manually stop it (here we just let it run until stop is called but we don't save the reference to the object so they can't stop it easily without keeping state. Let's just fix that by saving it in state.)
    window.currentRecognition = recognition;
  };

  const stopRecording = () => {
    if (window.currentRecognition) {
      window.currentRecognition.stop();
      setIsRecording(false);
    }
  };


  const handleUpload = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API_BASE}/meeting/analyze`, { transcript });
      setResult(res.data);
      onProcessed();
      setTranscript('');
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
          <UploadCloud size={24} />
        </div>
        <h2 className="text-xl font-semibold text-slate-800">Meeting Intelligence</h2>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Paste a meeting transcript. The AI will extract decisions and tasks, and push them to the workflow automatically.
      </p>
      <textarea
        className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none font-medium text-slate-700 bg-slate-50"
        placeholder="Paste meeting transcript here or use live voice recording..."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
      />
      <div className="mt-4 flex justify-between items-center">
        <div>
          {isRecording ? (
             <button onClick={stopRecording} className="flex items-center gap-2 text-rose-600 font-medium py-2 px-4 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors">
               <MicOff size={18} className="animate-pulse" /> Stop Recording
             </button>
          ) : (
             <button onClick={startRecording} className="flex items-center gap-2 text-brand-600 font-medium py-2 px-4 rounded-lg bg-brand-50 hover:bg-brand-100 transition-colors">
               <Mic size={18} /> Record Live Meeting
             </button>
          )}
        </div>
        <button

          onClick={handleUpload}
          disabled={loading || !transcript.trim()}
          className="bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <><Loader2 size={18} className="animate-spin" /> Processing AI...</> : 'Analyze Meeting'}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 flex flex-col gap-2">
          <p className="font-semibold">{result.message}</p>
          <ul className="list-disc list-inside text-sm">
            {result.decisions?.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
