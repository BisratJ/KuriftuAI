"use client";

// ─── Speech-to-Text (Web Speech API) ─────────────────────────────────────

let recognitionInstance = null;

export function isSTTSupported() {
  if (typeof window === "undefined") return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function startListening({ language = "en-US", onResult, onError, onEnd, interimResults = true }) {
  if (!isSTTSupported()) {
    onError?.("Speech recognition is not supported in this browser.");
    return null;
  }

  stopListening(); // Stop any existing instance

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognitionInstance = new SpeechRecognition();
  recognitionInstance.lang = language;
  recognitionInstance.interimResults = interimResults;
  recognitionInstance.continuous = false;
  recognitionInstance.maxAlternatives = 1;

  recognitionInstance.onresult = (event) => {
    let finalTranscript = "";
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    onResult?.({ final: finalTranscript, interim: interimTranscript });
  };

  recognitionInstance.onerror = (event) => {
    if (event.error === "no-speech") {
      onError?.("No speech detected. Please try again.");
    } else if (event.error === "not-allowed") {
      onError?.("Microphone access denied. Please allow microphone access in your browser settings.");
    } else {
      onError?.(`Speech recognition error: ${event.error}`);
    }
  };

  recognitionInstance.onend = () => {
    onEnd?.();
  };

  try {
    recognitionInstance.start();
  } catch (err) {
    onError?.(`Failed to start speech recognition: ${err.message}`);
  }

  return recognitionInstance;
}

export function stopListening() {
  if (recognitionInstance) {
    try {
      recognitionInstance.stop();
    } catch {}
    recognitionInstance = null;
  }
}

// ─── Text-to-Speech (Web Speech Synthesis) ───────────────────────────────

export function isTTSSupported() {
  if (typeof window === "undefined") return false;
  return !!window.speechSynthesis;
}

export function speak(text, { voice = null, rate = 1.0, pitch = 1.0, language = "en-US", onEnd, onError } = {}) {
  if (!isTTSSupported()) {
    onError?.("Speech synthesis is not supported in this browser.");
    return null;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  utterance.rate = rate;
  utterance.pitch = pitch;

  // Try to find the specified voice
  if (voice && voice !== "default") {
    const voices = window.speechSynthesis.getVoices();
    const found = voices.find((v) => v.name === voice || v.voiceURI === voice);
    if (found) utterance.voice = found;
  }

  utterance.onend = () => onEnd?.();
  utterance.onerror = (e) => onError?.(`Speech synthesis error: ${e.error}`);

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  if (isTTSSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function getAvailableVoices() {
  if (!isTTSSupported()) return [];
  return window.speechSynthesis.getVoices();
}

// ─── Language mapping for STT ────────────────────────────────────────────

export const LANGUAGE_MAP = {
  en: "en-US",
  am: "am-ET",
  om: "om-ET",
  fr: "fr-FR",
  zh: "zh-CN",
};
