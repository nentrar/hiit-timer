import React, { useState } from 'react';
import { ChevronLeft, Plus, Play, Pencil, Trash2 } from 'lucide-react';

const WorkoutsView = ({ presets, onBack, onCreateNew, onEdit, onDelete, onRun }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[calc(100vh-64px)] p-6 bg-white">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <button
        onClick={onCreateNew}
        className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform mb-6"
      >
        <Plus className="w-5 h-5" />
        New Workout
      </button>

      {presets.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p>No saved workouts yet.</p>
          <p className="text-sm mt-2">Create your first workout routine!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {presets.map(preset => (
            <div key={preset.id} className="border-2 border-black rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold">{preset.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => onRun(preset)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Play className="w-5 h-5" fill="black" />
                  </button>
                  <button
                    onClick={() => onEdit(preset)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(preset.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Work: {formatTime(preset.workTime)}</div>
                <div>Rest: {formatTime(preset.restTime)}</div>
                <div>Exercises: {preset.exercises}</div>
                <div>Rounds: {preset.rounds}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutsView;