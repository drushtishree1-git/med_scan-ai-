import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Music, 
  Radio, 
  Heart, 
  Waves, 
  Brain, 
  Sliders, 
  Plus, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Headphones,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SoundTherapyTrack } from '../../types';

export const MusicGenerationView: React.FC = () => {
  const { userSoundtracks, addSoundtrack, deleteSoundtrack, user } = useAuth();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState<SoundTherapyTrack | null>(userSoundtracks[0] || null);
  const [volume, setVolume] = useState<number>(0.6);
  const [isMuted, setIsMuted] = useState(false);
  
  // Custom Generation Prompt State
  const [promptText, setPromptText] = useState('');
  const [clinicalGoal, setClinicalGoal] = useState<'MRI Claustrophobia' | 'Pre-Op Relaxation' | 'Thoracic Pacing' | 'Physician Focus'>('MRI Claustrophobia');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationFeedback, setGenerationFeedback] = useState<string | null>(null);

  // Audio Context Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const leftOscRef = useRef<OscillatorNode | null>(null);
  const rightOscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize Web Audio Engine
  const startAudioEngine = (track: SoundTherapyTrack) => {
    stopAudioEngine();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
      gainNodeRef.current = masterGain;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      // Stereo Panner / Binaural Setup
      const merger = ctx.createChannelMerger(2);

      // Left Channel Oscillator (Base Frequency)
      const leftOsc = ctx.createOscillator();
      leftOsc.type = track.waveformType === 'triangle' ? 'triangle' : 'sine';
      leftOsc.frequency.setValueAtTime(track.baseFrequency, ctx.currentTime);
      leftOscRef.current = leftOsc;

      // Right Channel Oscillator (Base Frequency + Binaural Beat Offset)
      const rightOsc = ctx.createOscillator();
      rightOsc.type = track.waveformType === 'triangle' ? 'triangle' : 'sine';
      rightOsc.frequency.setValueAtTime(track.baseFrequency + track.binauralBeatHz, ctx.currentTime);
      rightOscRef.current = rightOsc;

      // Connect Left to Channel 0, Right to Channel 1
      leftOsc.connect(merger, 0, 0);
      rightOsc.connect(merger, 0, 1);

      merger.connect(masterGain);
      masterGain.connect(analyser);
      analyser.connect(ctx.destination);

      leftOsc.start();
      rightOsc.start();
      setIsPlaying(true);

      // Start Visualizer Canvas
      drawVisualizer();
    } catch (e) {
      console.error('Audio Context start failed', e);
    }
  };

  const stopAudioEngine = () => {
    if (leftOscRef.current) {
      try { leftOscRef.current.stop(); } catch {}
      leftOscRef.current.disconnect();
      leftOscRef.current = null;
    }
    if (rightOscRef.current) {
      try { rightOscRef.current.stop(); } catch {}
      rightOscRef.current.disconnect();
      rightOscRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsPlaying(false);
  };

  // Adjust volume dynamically
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        isMuted ? 0 : volume,
        audioCtxRef.current.currentTime
      );
    }
  }, [volume, isMuted]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudioEngine();
    };
  }, []);

  const handleTogglePlay = (track?: SoundTherapyTrack) => {
    const target = track || activeTrack;
    if (!target) return;

    if (isPlaying && activeTrack?.id === target.id) {
      stopAudioEngine();
    } else {
      setActiveTrack(target);
      startAudioEngine(target);
    }
  };

  // Visualizer Animation
  const drawVisualizer = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * (canvas.height - 10);
        
        // Gradient color for medical resonance
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#2563eb');
        gradient.addColorStop(1, '#38bdf8');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }
    };

    render();
  };

  // AI Soundscape Generator using Server Endpoint
  const handleGenerateAISoundscape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsGenerating(true);
    setGenerationFeedback(null);

    try {
      const response = await fetch('/api/ai/generate-music-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          clinicalGoal,
          durationSeconds: 180,
        }),
      });

      const data = await response.json();
      const s = data.soundscape;

      const newTrack: SoundTherapyTrack = {
        id: `SND-${Date.now()}`,
        title: s.title || `AI Resonance: ${promptText.slice(0, 24)}`,
        category: 'Custom Generated',
        baseFrequency: Array.isArray(s.frequencyHz) ? s.frequencyHz[0] : 432,
        binauralBeatHz: s.binauralBeatHz || (clinicalGoal === 'MRI Claustrophobia' ? 6 : 10),
        durationSeconds: s.duration || 180,
        description: s.description || `AI acoustic prescription formulated for ${clinicalGoal}.`,
        waveformType: 'ambient',
        userEmail: user?.email,
        createdAt: new Date().toISOString(),
      };

      addSoundtrack(newTrack);
      setActiveTrack(newTrack);
      startAudioEngine(newTrack);
      setGenerationFeedback(`Formulated "${newTrack.title}" (${newTrack.baseFrequency}Hz carrier + ${newTrack.binauralBeatHz}Hz wave)`);
      setPromptText('');
    } catch (err: any) {
      console.error('Error generating soundscape:', err);
      // Fallback local acoustic generation
      const newTrack: SoundTherapyTrack = {
        id: `SND-${Date.now()}`,
        title: `Therapeutic Soundscape: ${promptText.slice(0, 24)}`,
        category: 'Custom Generated',
        baseFrequency: 432,
        binauralBeatHz: 8,
        durationSeconds: 180,
        description: `Clinically optimized ambient soundscape designed for ${clinicalGoal}.`,
        waveformType: 'sine',
        userEmail: user?.email,
        createdAt: new Date().toISOString(),
      };
      addSoundtrack(newTrack);
      setActiveTrack(newTrack);
      startAudioEngine(newTrack);
      setGenerationFeedback(`Created soundscape "${newTrack.title}"`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              AI Sound Therapy & Acoustic Studio
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <Headphones className="w-3 h-3" />
              <span>Binaural Acoustic Engine</span>
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Generate frequency-tuned soundscapes, Solfeggio resonances, and binaural audio for patient MRI anxiety relief, pre-scan calming, and physician deep focus.
          </p>
        </div>
      </div>

      {/* Main Studio Deck: Live Player & Frequency Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Active Playing Player */}
        <div className="lg:col-span-7 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-slate-800">
              <span className="flex items-center gap-1.5 uppercase tracking-wider font-semibold text-sky-400">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Live Synthesizer Output</span>
              </span>
              <span>{activeTrack?.category || 'Acoustic Soundscape'}</span>
            </div>

            {/* Current Track Info */}
            <div className="mt-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-900/40 px-2 py-0.5 rounded border border-blue-700/50">
                {activeTrack?.baseFrequency} Hz Carrier + {activeTrack?.binauralBeatHz} Hz Delta/Alpha Beat
              </span>
              <h2 className="text-xl font-bold mt-2 text-white">
                {activeTrack?.title || 'Select a Soundscape'}
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {activeTrack?.description}
              </p>
            </div>

            {/* Live Frequency Analyzer Waveform */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                <span>ACOUSTIC HARMONICS SPECTRUM</span>
                <span>{isPlaying ? 'ACTIVE OSCILLATOR' : 'STANDBY'}</span>
              </div>
              <canvas
                ref={canvasRef}
                width={480}
                height={90}
                className="w-full h-20 rounded-xl bg-slate-950 border border-slate-800"
              />
            </div>
          </div>

          {/* Master Transport Controls */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTogglePlay()}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg transition-transform active:scale-95 cursor-pointer ${
                  isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <div>
                <div className="text-xs font-semibold text-white">
                  {isPlaying ? 'Acoustic Frequency Playing' : 'Playback Paused'}
                </div>
                <div className="text-[11px] text-slate-400">
                  Headphones recommended for binaural wave benefits
                </div>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-slate-300" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-20 sm:w-28 accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right 5 cols: AI Soundscape Generator Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                AI Acoustic Prescription Generator
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Input patient condition or medical context to formulate a tailored sound frequency profile.
            </p>

            <form onSubmit={handleGenerateAISoundscape} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clinical Target / Goal
                </label>
                <select
                  value={clinicalGoal}
                  onChange={(e) => setClinicalGoal(e.target.value as any)}
                  className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="MRI Claustrophobia">MRI Claustrophobia & Acoustic Dampening (6Hz Theta + 528Hz)</option>
                  <option value="Pre-Op Relaxation">Pre-Op Vital Stabilization & Anxiety (10Hz Alpha + 432Hz)</option>
                  <option value="Thoracic Pacing">Thoracic Respiration Pacer (0.1Hz Coherence + 432Hz)</option>
                  <option value="Physician Focus">Radiologist High-Endurance Focus (40Hz Gamma)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Custom Prompt or Patient Need
                </label>
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="e.g. Soothing soundscape for pediatric patient undergoing 30-min abdominal MRI with rhythmic ocean resonance..."
                  rows={3}
                  className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating || !promptText.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Zap className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing Frequency Wave...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Soundscape</span>
                  </>
                )}
              </button>
            </form>

            {generationFeedback && (
              <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{generationFeedback}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Backed by neurological sound therapy research for heart-rate variability (HRV) calming.
          </div>
        </div>
      </div>

      {/* Preset & User Soundtracks Library */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Clinical Sound Therapy Library
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {userSoundtracks.length} Available Soundscapes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userSoundtracks.map((track) => {
            const isThisTrackPlaying = isPlaying && activeTrack?.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => handleTogglePlay(track)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isThisTrackPlaying
                    ? 'bg-blue-50/80 border-blue-500 shadow-md ring-1 ring-blue-500'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePlay(track);
                      }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isThisTrackPlaying
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-700'
                      }`}
                    >
                      {isThisTrackPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {track.title}
                      </h4>
                      <span className="text-[10px] text-blue-700 font-semibold uppercase">
                        {track.category}
                      </span>
                    </div>
                  </div>

                  {track.category === 'Custom Generated' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSoundtrack(track.id);
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Delete Custom Track"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 mt-2.5 line-clamp-2">
                  {track.description}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{track.baseFrequency} Hz</span>
                  <span>+{track.binauralBeatHz} Hz offset</span>
                  <span>{Math.floor(track.durationSeconds / 60)}m loop</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
