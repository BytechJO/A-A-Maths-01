import { useEffect, useRef, useState } from 'react';
import { audioUrl } from './data';
export type Track = { file: string; title: string };
export function useAudio() {
  const [audio] = useState(() => new Audio());
  const [track, setTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [error, setError] = useState('');
  const queue = useRef<Track[]>([]);
  function start(next: Track) {
    setError(''); setTrack(next); setTime(0); setDuration(0);
    audio.src = audioUrl(next.file);
    void audio.play().catch(e => { if (e.name !== 'AbortError') setError('Le son n’a pas pu démarrer. Réessaie avec le bouton lecture.'); });
  }
  useEffect(() => {
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setTime(audio.currentTime);
    const onMetadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onError = () => { setError('Ce son est indisponible. Réessaie.'); setPlaying(false); queue.current = []; };
    const onEnd = () => { const next = queue.current.shift(); if (next) start(next); else setPlaying(false); };
    audio.addEventListener('play', onPlay); audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTime); audio.addEventListener('loadedmetadata', onMetadata);
    audio.addEventListener('ended', onEnd); audio.addEventListener('error', onError);
    return () => {
      audio.pause(); audio.removeEventListener('play', onPlay); audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('loadedmetadata', onMetadata);
      audio.removeEventListener('ended', onEnd); audio.removeEventListener('error', onError);
    };
  }, [audio]);
  useEffect(() => { audio.volume = volume; }, [audio, volume]);
  function play(tracks: Track[]) { if (tracks.length) { queue.current = tracks.slice(1); start(tracks[0]); } }
  function stop() { audio.pause(); queue.current = []; audio.currentTime = 0; setTime(0); setDuration(0); setTrack(null); setError(''); }
  function toggle() {
    if (!track) return;
    if (!audio.paused) audio.pause();
    else { setError(''); void audio.play().catch(() => setError('Lecture impossible. Réessaie.')); }
  }
  function seek(value: number) { if (duration > 0) { audio.currentTime = value; setTime(value); } }
  function replay() { if (track) { audio.currentTime = 0; void audio.play().catch(() => setError('Lecture impossible.')); } }
  return { track, playing, time, duration, volume, error, play, stop, toggle, seek, replay, setVolume };
}
export type AudioController = ReturnType<typeof useAudio>;
