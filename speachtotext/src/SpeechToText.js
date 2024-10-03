import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SpeechToText.css'; // Import the CSS for styling

const SpeechToText = () => {
  const [transcript, setTranscript] = useState('');
  const [recording, setRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [language, setLanguage] = useState('hi-IN'); // Default to Hindi

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = language; // Set the language
      recog.interimResults = false;

      recog.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
      };

      recog.onerror = (event) => {
        console.error("Error occurred in recognition: " + event.error);
      };

      setRecognition(recog);
    } else {
      console.error('Speech Recognition not supported in this browser.');
    }
  }, [language]);

  const startRecording = async () => {
    if (recognition) {
      try {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setRecording(true);
        recognition.start();
      } catch (error) {
        console.error("Microphone access denied:", error);
        alert("Please allow microphone access in your browser settings.");
      }
    }
  };
  

  const stopRecording = () => {
    if (recognition) {
      setRecording(false);
      recognition.stop();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Speech to Text Converter</h1>
        <label htmlFor="language">Select Language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="hi-IN">Hindi</option>
          <option value="en-US">English</option>
        </select>
        <div className="buttons">
          <button onClick={startRecording} disabled={recording}>
            Start Recording
          </button>
          <button onClick={stopRecording} disabled={!recording}>
            Stop Recording
          </button>
        </div>
        <div className="transcript-box">
          <h2>Transcript:</h2>
          <p>{transcript}</p>
        </div>
        <div className="action-buttons">
          <button onClick={copyToClipboard}>Copy Text</button>
          <button onClick={resetTranscript}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default SpeechToText;
