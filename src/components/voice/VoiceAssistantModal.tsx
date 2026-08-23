'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Sparkles,
  TrendingUp,
  Truck,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppLanguage, TRANSLATIONS } from '../../lib/translations';
import {
  voiceAssistantService,
  VoiceAssistantResponse,
} from '../../services/voiceAssistantService';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useApp();
  const langKey: AppLanguage = (language.toLowerCase().includes('marathi') || language.toLowerCase().includes('mr'))
    ? 'mr'
    : (language.toLowerCase().includes('hindi') || language.toLowerCase().includes('hi'))
    ? 'hi'
    : 'en';

  const t = TRANSLATIONS[langKey] || TRANSLATIONS.en;

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [queryInput, setQueryInput] = useState('');
  const [response, setResponse] = useState<VoiceAssistantResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;

        // Set recognition language
        recognition.lang =
          langKey === 'mr' ? 'mr-IN' : langKey === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
          setErrorMessage(null);
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
          setQueryInput(text);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setErrorMessage('Microphone access denied. You can type your query below.');
          } else if (event.error === 'no-speech') {
            setErrorMessage('No speech detected. Please speak clearly or type your question.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [langKey]);

  // Handle Speech Recognition Toggle
  const toggleListening = () => {
    if (!recognitionRef.current) {
      setErrorMessage(t.voiceUnavailable);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (transcript.trim()) {
        handleSubmitQuery(transcript);
      }
    } else {
      setTranscript('');
      setResponse(null);
      setErrorMessage(null);
      try {
        recognitionRef.current.lang =
          langKey === 'mr' ? 'mr-IN' : langKey === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  // Submit Query to Voice Assistant Service & Django Backend
  const handleSubmitQuery = async (text: string) => {
    if (!text.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await voiceAssistantService.processVoiceQuery(text, langKey);
      setResponse(res);
      // Auto-speak response
      speakText(res.spokenText);
    } catch (err) {
      console.warn('Error processing query:', err);
      setErrorMessage('Failed to consult market intelligence engine. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Web Speech Synthesis (Text-to-Speech)
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        langKey === 'mr' ? 'mr-IN' : langKey === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Reset Modal
  const handleReset = () => {
    stopSpeaking();
    setTranscript('');
    setQueryInput('');
    setResponse(null);
    setErrorMessage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-modal-title"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-brand-700 via-emerald-800 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h2 id="voice-modal-title" className="font-black text-lg sm:text-xl text-white">
                {t.askKrishiSetu}
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                {t.speakPrompt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {response && (
              <button
                onClick={handleReset}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition"
                title={t.clear}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition"
              title={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Voice Interaction Wave / Mic Area */}
          <div className="flex flex-col items-center justify-center py-6 px-4 rounded-2xl bg-gradient-to-b from-emerald-50/70 to-slate-50 border border-emerald-100 text-center relative overflow-hidden">
            {/* Animated Pulses when listening */}
            {isListening && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="w-32 h-32 rounded-full bg-brand-500/20 animate-ping"></span>
                <span className="w-24 h-24 rounded-full bg-brand-500/30 animate-pulse"></span>
              </div>
            )}

            {/* Mic Toggle Button */}
            <button
              onClick={toggleListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-90 z-10 ${
                isListening
                  ? 'bg-rose-500 text-white animate-bounce shadow-rose-500/40'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/30 hover:scale-105'
              }`}
              aria-label={isListening ? 'Stop Listening' : 'Start Listening'}
            >
              {isListening ? (
                <MicOff className="w-9 h-9" />
              ) : (
                <Mic className="w-9 h-9" />
              )}
            </button>

            {/* Status Label */}
            <div className="mt-4 font-bold text-sm text-slate-800 z-10">
              {isListening ? (
                <span className="text-rose-600 flex items-center gap-1.5 justify-center animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                  {t.listening}
                </span>
              ) : isProcessing ? (
                <span className="text-brand-700 flex items-center gap-1.5 justify-center">
                  <Sparkles className="w-4 h-4 animate-spin text-brand-600" />
                  {t.processing}
                </span>
              ) : (
                <span className="text-slate-600">
                  {langKey === 'mr'
                    ? 'माइकवर टॅप करा व प्रश्न विचारा'
                    : langKey === 'hi'
                    ? 'माइक पर टैप करें और बोलें'
                    : 'Tap the mic and ask your question'}
                </span>
              )}
            </div>

            {/* Live Transcript / Spoken Text */}
            {transcript && (
              <div className="mt-3 p-3 rounded-xl bg-white/90 border border-slate-200 text-xs font-semibold text-slate-900 max-w-md w-full shadow-sm z-10">
                "{transcript}"
              </div>
            )}
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Structured Live Result Display */}
          {response && (
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Result Header & Audio TTS Button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-amber-400/20 text-amber-400 border border-amber-400/30 text-[10px] font-bold uppercase">
                    {response.intent.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    {response.cropName} ({response.quantityKg} kg)
                  </span>
                </div>

                <button
                  onClick={() => (isSpeaking ? stopSpeaking() : speakText(response.spokenText))}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                    isSpeaking
                      ? 'bg-amber-400 text-slate-950 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title={isSpeaking ? 'Stop Audio' : 'Listen in Audio'}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
                </button>
              </div>

              {/* Formatted Display Text */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {response.displayText}
              </p>

              {/* Metrics Pill Grid */}
              {response.metrics && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                  {response.metrics.netRealizationPerKg !== undefined && (
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Net Payout / kg
                      </span>
                      <span className="text-base font-black text-amber-400">
                        ₹{response.metrics.netRealizationPerKg.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {response.metrics.totalNetPayout !== undefined && (
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Total In-Hand
                      </span>
                      <span className="text-base font-black text-emerald-400">
                        ₹{response.metrics.totalNetPayout.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  {response.metrics.confidenceScore !== undefined && (
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Confidence
                      </span>
                      <span className="text-base font-black text-white">
                        {response.metrics.confidenceScore}%
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Direct Action CTA */}
              {response.actionCta && (
                <div className="pt-2 flex justify-end">
                  <Link
                    href={response.actionCta.href}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition shadow-md shadow-amber-400/20"
                  >
                    <span>{response.actionCta.label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Typed Fallback Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmitQuery(queryInput);
                  }
                }}
                placeholder={t.typePrompt}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition"
              />
              <button
                onClick={() => handleSubmitQuery(queryInput)}
                disabled={!queryInput.trim() || isProcessing}
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <span>{t.sendQuery}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 1-Click Example Queries */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.exampleQueriesTitle}
            </span>
            <div className="flex flex-wrap gap-2">
              {t.examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQueryInput(example);
                    handleSubmitQuery(example);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-brand-700 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-medium text-slate-700 transition text-left"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Disclaimer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>Powered by Django AI Market Intelligence Engine</span>
          </div>
          <span>Language: <strong className="uppercase text-slate-700">{langKey}</strong></span>
        </div>
      </div>
    </div>
  );
};
