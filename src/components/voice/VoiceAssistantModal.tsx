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
        className="bg-white rounded-xl shadow-menu border border-stone-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-modal-title"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center font-bold">
              <Mic className="w-4 h-4 text-brand-700" />
            </div>
            <div>
              <h2 id="voice-modal-title" className="font-bold text-base text-stone-900 leading-snug">
                {t.askKrishiSetu}
              </h2>
              <p className="text-2xs text-stone-500">
                {t.speakPrompt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {response && (
              <button
                onClick={handleReset}
                className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
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
              className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              title={t.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Main Voice Interaction Wave / Mic Area */}
          <div className="flex flex-col items-center justify-center py-6 px-4 rounded-lg bg-stone-50 border border-stone-200/80 text-center relative overflow-hidden">
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
            <div className="bg-stone-50 rounded-lg p-4 border border-stone-200 shadow-subtle space-y-3">
              {/* Result Header & Audio TTS Button */}
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200 text-2xs font-semibold uppercase tracking-wider">
                    {response.intent.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-semibold text-stone-700">
                    {response.cropName} ({response.quantityKg} kg)
                  </span>
                </div>

                <button
                  onClick={() => (isSpeaking ? stopSpeaking() : speakText(response.spokenText))}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                    isSpeaking
                      ? 'bg-brand-700 text-white animate-pulse'
                      : 'bg-white border border-stone-200 hover:bg-stone-100 text-stone-700'
                  }`}
                  title={isSpeaking ? 'Stop Audio' : 'Listen in Audio'}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
                </button>
              </div>

              {/* Formatted Display Text */}
              <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                {response.displayText}
              </p>

              {/* Metrics Grid */}
              {response.metrics && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  {response.metrics.netRealizationPerKg !== undefined && (
                    <div className="bg-white p-2 rounded-md border border-stone-200">
                      <span className="text-2xs text-stone-400 uppercase font-medium block">
                        Net Payout / kg
                      </span>
                      <span className="text-sm font-bold text-brand-800 tabular-nums">
                        ₹{response.metrics.netRealizationPerKg.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {response.metrics.totalNetPayout !== undefined && (
                    <div className="bg-white p-2 rounded-md border border-stone-200">
                      <span className="text-2xs text-stone-400 uppercase font-medium block">
                        Total In-Hand
                      </span>
                      <span className="text-sm font-bold text-brand-900 tabular-nums">
                        ₹{response.metrics.totalNetPayout.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  {response.metrics.confidenceScore !== undefined && (
                    <div className="bg-white p-2 rounded-md border border-stone-200 col-span-2 sm:col-span-1">
                      <span className="text-2xs text-stone-400 uppercase font-medium block">
                        Confidence
                      </span>
                      <span className="text-sm font-bold text-stone-900 tabular-nums">
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-md text-xs transition shadow-subtle"
                  >
                    <span>{response.actionCta.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
                className="flex-1 bg-white border border-stone-200 rounded-md px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-700 transition"
              />
              <button
                onClick={() => handleSubmitQuery(queryInput)}
                disabled={!queryInput.trim() || isProcessing}
                className="px-3.5 py-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white font-semibold rounded-md text-xs flex items-center gap-1.5 transition"
              >
                <span>{t.sendQuery}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 1-Click Example Queries */}
          <div className="space-y-1.5 pt-1">
            <span className="text-2xs font-semibold text-stone-400 uppercase tracking-wider block">
              {t.exampleQueriesTitle}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {t.examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQueryInput(example);
                    handleSubmitQuery(example);
                  }}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200/80 rounded-md text-xs font-medium text-stone-700 transition text-left"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Disclaimer */}
        <div className="bg-stone-50 border-t border-stone-200 px-5 py-2.5 flex items-center justify-between text-2xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
            <span>AI Agricultural Intelligence Engine</span>
          </div>
          <span>Language: <strong className="uppercase text-stone-700">{langKey}</strong></span>
        </div>
      </div>
    </div>
  );
};
