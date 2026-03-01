import React, { useEffect, useRef } from 'react';
import { Factory, Beam } from 'vexflow';
import './App.css';
import jsonData from './mock-data.json'
import { convertJsonToVexString } from './parser';

function App() {
  const containerRef = useRef(null);




  useEffect(() => {
    if (!containerRef.current || !jsonData) return;

    try {
      containerRef.current.innerHTML = '';

      // If jsonData has an 'exercise' property, use it. 
      // Otherwise, check if jsonData is an array (the format currently used on the hugging face demo).
      const exercise = jsonData.exercise || (Array.isArray(jsonData) ? jsonData : []);
      const metadata = jsonData.metadata || {};

      // Stop if there is no music data
      if (exercise.length === 0) {
        containerRef.current.innerHTML = '<p>No musical data found.</p>';
        return;
      }

      const timeSig = metadata?.timeSignature || "4/4";
      const rawKey = metadata?.key || "C Major"; // e.g., "Bb Major" or "A Minor"

      //Get the first word (e.g., "Bb" or "A")
      let keySig = rawKey.split(' ')[0];

      //add 'm' suffix for minor keys
      if (rawKey.toLowerCase().includes('minor') || rawKey.toLowerCase().includes('Minor')) {
        keySig += 'm';
      }

      const measures = convertJsonToVexString(exercise, timeSig);

      const STAVE_WIDTH = 250;
      const STAVE_HEIGHT = 160;
      const MEASURES_PER_LINE = 3;

      const vf = new Factory({
        renderer: {
          elementId: containerRef.current,
          width: 850,
          height: (Math.ceil(measures.length / MEASURES_PER_LINE) * STAVE_HEIGHT) + 100
        }
      });

      const score = vf.EasyScore();

      for (let i = 0; i < measures.length; i++) {
        const col = i % MEASURES_PER_LINE;
        const row = Math.floor(i / MEASURES_PER_LINE);

        //Calculate X and Y with proper margins
        const xPos = col * STAVE_WIDTH + 40;
        const yPos = row * STAVE_HEIGHT + 40;

        //Create and Draw the Stave lines
        const stave = vf.Stave({ x: xPos, y: yPos, width: STAVE_WIDTH });

        //Add Clef/Time Sig only where they belong
        if (col === 0) stave.addClef('treble').addKeySignature(keySig);
        if (i === 0) stave.addTimeSignature(timeSig);

        //Connect the notes to this specific stave
        const voice = score.voice(score.notes(measures[i]), {time: timeSig});

        vf.Formatter().joinVoices([voice]).formatToStave([voice], stave);

        const notes = voice.getTickables();
        const beams = Beam.generateBeams(notes);

        beams.forEach(b => b.setContext(vf.getContext()).draw());
      }

      //Draw everything at once at the end
      vf.draw();

    } catch (error) {
      console.error("VexFlow Error:", error);
    }
  }, []);







  return (
    <div className="app-container">
      <header className="header">
        <h1>HarmonyHub</h1>
        <p style={{ color: '#666', marginTop: '10px' }}>
          Generative Music Notation Prototype
        </p>
      </header>

      <main className="notation-container">
        <div ref={containerRef}></div>
      </main>

      <footer style={{ marginTop: '50px', textAlign: 'center', fontSize: '0.9rem', color: '#999' }}>
        Evaluation Project
      </footer>
    </div>
  );
}

export default App;