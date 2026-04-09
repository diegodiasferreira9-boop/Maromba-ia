import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function WorkoutTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
      <div>
        <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Tempo de Treino</div>
        <div className="text-3xl font-mono font-bold text-orange-500">{formatTime(seconds)}</div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => setIsActive(!isActive)}
          className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
        >
          {isActive ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
        </button>
        <button 
          onClick={() => { setSeconds(0); setIsActive(false); }}
          className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
}
