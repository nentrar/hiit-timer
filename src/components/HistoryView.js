import React from 'react';
import { ChevronLeft, Play } from 'lucide-react';

const HistoryView = ({ workouts, onBack, onRun }) => {
  const groupByDate = (workouts) => {
    const groups = {};
    workouts.forEach(workout => {
      const date = new Date(workout.date).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(workout);
    });
    return groups;
  };

  const grouped = groupByDate(workouts);
  const today = new Date().toLocaleDateString();

  return (
    <div className="min-h-[calc(100vh-64px)] p-6 bg-white">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      {workouts.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p>No workout history yet.</p>
          <p className="text-sm mt-2">Complete your first workout!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, dayWorkouts]) => (
            <div key={date}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-gray-500">{date === today ? 'Today' : date}</h3>
                {/* <span className="text-2xl font-bold">{dayWorkouts.reduce((sum, w) => sum + w.totalTime, 0)}s</span> */}
              </div>
              {dayWorkouts.map((workout, idx) => (
                <div key={`${date}-${idx}`} className="border-2 border-black rounded-2xl p-5 mb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="grid grid-cols-4 gap-4 text-center flex-1">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Work</div>
                        <div className="text-xl font-bold">{workout.workTime}s</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Rest</div>
                        <div className="text-xl font-bold">{workout.restTime}s</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Exercises</div>
                        <div className="text-xl font-bold">{workout.exercises}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Rounds</div>
                        <div className="text-xl font-bold">{workout.rounds}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => onRun(workout)}
                      className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Run this workout"
                    >
                      <Play className="w-6 h-6" fill="black" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;