import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';

const ActiveWorkout = ({ settings, onComplete, onStop }) => {
  const [timeRemaining, setTimeRemaining] = useState(settings.warmUpTime);
  const [currentExercise, setCurrentExercise] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState('warmup');
  const [isPaused, setIsPaused] = useState(false);
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0);
  
  const timerRef = useRef(null);
  const workoutTimerRef = useRef(null);
  const startTimeRef = useRef(null);
  const pauseTimeRef = useRef(null);
  const workoutStartTimeRef = useRef(null);
  const wakeLockRef = useRef(null); // NEW: Wake Lock reference

  // NEW: Wake Lock Effect
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          console.log('Wake Lock activated');
        }
      } catch (err) {
        console.error('Wake Lock error:', err);
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
          console.log('Wake Lock released');
        } catch (err) {
          console.error('Wake Lock release error:', err);
        }
      }
    };

    // Request wake lock when component mounts
    requestWakeLock();

    // Re-request wake lock if page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !wakeLockRef.current) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Release wake lock when component unmounts
    return () => {
      releaseWakeLock();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handlePhaseComplete = useCallback(() => {
  if (phase === 'warmup') {
    setPhase('work');
    setTimeRemaining(settings.workTime);
    startTimeRef.current = Date.now();
  } else if (phase === 'work') {
    // Check if this is the last exercise of the last round
    if (currentExercise === settings.exercises && currentRound === settings.rounds) {
      // Last exercise of last round - go straight to completion
      clearInterval(workoutTimerRef.current);
      clearInterval(timerRef.current);
      onComplete({
        workTime: settings.workTime,
        restTime: settings.restTime,
        exercises: settings.exercises,
        rounds: settings.rounds,
        totalTime: totalWorkoutTime
      });
    } 
    // Check if this is the last exercise of a round (but not the last round)
    else if (currentExercise === settings.exercises && currentRound < settings.rounds) {
      // Last exercise of round - go to round reset (skip rest)
      setPhase('roundReset');
      setTimeRemaining(settings.roundReset);
      startTimeRef.current = Date.now();
    } 
    // Normal case - not last exercise, go to rest
    else {
      setPhase('rest');
      setTimeRemaining(settings.restTime);
      startTimeRef.current = Date.now();
    }
  } else if (phase === 'rest') {
    // After rest, move to next exercise
    setCurrentExercise(prev => prev + 1);
    setPhase('work');
    setTimeRemaining(settings.workTime);
    startTimeRef.current = Date.now();
  } else if (phase === 'roundReset') {
    // After round reset, start new round
    setCurrentRound(prev => prev + 1);
    setCurrentExercise(1);
    setPhase('work');
    setTimeRemaining(settings.workTime);
    startTimeRef.current = Date.now();
  }
}, [phase, currentExercise, currentRound, settings, totalWorkoutTime, onComplete]);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (phase !== 'warmup' && !workoutStartTimeRef.current) {
      workoutStartTimeRef.current = Date.now();
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'warmup' && !isPaused) {
      workoutTimerRef.current = setInterval(() => {
        if (workoutStartTimeRef.current) {
          const elapsed = Math.floor((Date.now() - workoutStartTimeRef.current) / 1000);
          setTotalWorkoutTime(elapsed);
        }
      }, 100);
    }

    return () => clearInterval(workoutTimerRef.current);
  }, [phase, isPaused]);

  useEffect(() => {
    if (!isPaused) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
      
      if (pauseTimeRef.current) {
        const pauseDuration = Date.now() - pauseTimeRef.current;
        startTimeRef.current += pauseDuration;
        pauseTimeRef.current = null;
      }

      const phaseDuration = phase === 'warmup' ? settings.warmUpTime
        : phase === 'work' ? settings.workTime
        : phase === 'rest' ? settings.restTime
        : settings.roundReset;

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = phaseDuration - elapsed;

        if (remaining <= 0) {
          setTimeRemaining(0);
          clearInterval(timerRef.current);
          handlePhaseComplete();
        } else {
          setTimeRemaining(remaining);
        }
      }, 100);
    } else {
      if (!pauseTimeRef.current) {
        pauseTimeRef.current = Date.now();
      }
    }

    return () => clearInterval(timerRef.current);
  }, [isPaused, phase, handlePhaseComplete, settings]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = phase === 'warmup'
    ? (timeRemaining / settings.warmUpTime) * 100
    : phase === 'work' 
    ? (timeRemaining / settings.workTime) * 100
    : phase === 'rest'
    ? (timeRemaining / settings.restTime) * 100
    : (timeRemaining / settings.roundReset) * 100;

  const getPhaseColors = () => {
    switch (phase) {
      case 'warmup':
        return {
          bg: 'bg-white',
          text: 'text-black',
          label: 'text-gray-500',
          button: 'border-black text-black hover:bg-gray-100',
          circle: 'black'
        };
      case 'work':
        return {
          bg: 'bg-[#2A9D8F]',
          text: 'text-white',
          label: 'text-white/70',
          button: 'border-white text-white hover:bg-white/10',
          circle: 'white'
        };
      case 'rest':
        return {
          bg: 'bg-[#E9C46A]',
          text: 'text-black',
          label: 'text-black/70',
          button: 'border-black text-black hover:bg-black/10',
          circle: 'black'
        };
      case 'roundReset':
        return {
          bg: 'bg-[#F4A261]',
          text: 'text-white',
          label: 'text-white/70',
          button: 'border-white text-white hover:bg-white/10',
          circle: 'white'
        };
      default:
        return {
          bg: 'bg-white',
          text: 'text-black',
          label: 'text-gray-500',
          button: 'border-black text-black hover:bg-gray-100',
          circle: 'black'
        };
    }
  };

  const colors = getPhaseColors();

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-6 ${colors.bg} transition-colors duration-500`}>
      <div className="text-center mb-12">
        <div className={`text-3xl font-bold mb-4 ${colors.text}`}>
          {phase === 'warmup' ? 'Warm-up' : phase === 'work' ? 'Work' : phase === 'rest' ? 'Rest' : 'Round Rest'}
        </div>
        {phase !== 'warmup' && (
          <div className={`text-3xl ${colors.label} space-y-2`}>
            <div>
              <span className={`${colors.text} font-medium`}>Exercise </span>
              {currentExercise}/{settings.exercises}
            </div>
            <div>
              <span className={`${colors.text} font-medium`}>Round </span>
              {currentRound}/{settings.rounds}
            </div>
          </div>
        )}
      </div>

      <div className="relative w-80 h-80 mb-12">
        <svg className="transform -rotate-90 w-80 h-80">
          <circle 
            cx="160" 
            cy="160" 
            r="140" 
            stroke={phase === 'warmup' || phase === 'rest' ? '#e5e7eb' : 'rgba(255,255,255,0.2)'} 
            strokeWidth="8" 
            fill="none"
          />
          <circle 
            cx="160" 
            cy="160" 
            r="140" 
            stroke={colors.circle}
            strokeWidth="8" 
            fill="none"
            strokeDasharray={`${2 * Math.PI * 140}`}
            strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-7xl font-bold mb-2 ${colors.text}`}>{formatTime(timeRemaining)}</div>
          <div className={`text-sm uppercase tracking-wider ${colors.label}`}>
            {phase === 'warmup' ? 'GET READY' : phase === 'work' ? 'WORK' : phase === 'rest' ? 'REST' : 'ROUND BREAK'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-colors ${colors.button}`}
        >
          {isPaused ? <Play className="w-6 h-6 ml-1" /> : <Pause className="w-6 h-6" />}
        </button>
      </div>

      {phase !== 'warmup' && (
        <div className={`text-center text-xl font-medium ${colors.text} mb-4`}>
          Time Remaining: {formatTime(
            timeRemaining + 
            (settings.exercises - currentExercise) * (settings.workTime + settings.restTime) +
            (settings.rounds - currentRound) * (settings.exercises * (settings.workTime + settings.restTime) + settings.roundReset)
          )}
        </div>
      )}

      <button 
        onClick={onStop}
        className={`px-8 py-3 transition-colors text-lg ${colors.label} hover:${colors.text}`}
      >
        Stop Workout
      </button>
    </div>
  );
};

export default ActiveWorkout;