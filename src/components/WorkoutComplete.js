import React from 'react';
import { Share2, Check } from 'lucide-react';

const WorkoutComplete = ({ workout, totalWorkouts, onDone, onHistory }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    const text = `Just completed a HIIT workout! 💪\n${workout.exercises} exercises × ${workout.rounds} rounds\nTotal time: ${formatTime(workout.totalTime)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Workout details copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 bg-[#264653]">
      <div className="text-center mb-12">
        <div className="w-32 h-32 rounded-full border-4 border-white mx-auto mb-6 flex items-center justify-center">
          <Check className="w-16 h-16 text-white" strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-white">Congratulations!</h2>
        <p className="text-white/70">Workout Complete</p>
      </div>

      <div className="w-full max-w-md grid grid-cols-3 gap-4 mb-12">
        <div className="border-2 border-white rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold mb-1 text-white">1</div>
          <div className="text-xs text-white/70">Workout<br/>streak</div>
        </div>
        <div className="border-2 border-white rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold mb-1 text-white">{totalWorkouts}</div>
          <div className="text-xs text-white/70">Total<br/>workouts</div>
        </div>
        <div className="border-2 border-white rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold mb-1 text-white">{formatTime(workout.totalTime)}</div>
          <div className="text-xs text-white/70">Total<br/>time</div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-3">
        <button 
          onClick={handleShare}
          className="w-full border-2 border-white text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          Share Workout
        </button>
        <button 
          onClick={onHistory}
          className="w-full border-2 border-white text-white py-4 rounded-2xl font-medium hover:bg-white/10 transition-colors"
        >
          Show History
        </button>
        <button 
          onClick={onDone}
          className="w-full bg-white text-[#264653] py-4 rounded-2xl font-bold hover:scale-105 transition-transform"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default WorkoutComplete;