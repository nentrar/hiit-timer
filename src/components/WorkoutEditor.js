import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import IOSPicker from './IOSPicker';

const WorkoutEditor = ({ preset, onBack, onSave }) => {
  const [formData, setFormData] = useState(preset || {
    name: '',
    workTime: 20,
    restTime: 10,
    exercises: 5,
    rounds: 2,
    roundReset: 10,
    warmUpTime: 10
  });
  const [showPicker, setShowPicker] = useState(null);

  const updateField = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter a workout name');
      return;
    }
    onSave(formData);
  };

  const settingsConfig = [
    { key: 'workTime', label: 'Work', color: '#2A9D8F', min: 5, max: 300, unit: 's' },
    { key: 'restTime', label: 'Rest', color: '#E9C46A', min: 5, max: 300, unit: 's' },
    { key: 'exercises', label: 'Exercises', color: '#000000', min: 1, max: 50, unit: '' },
    { key: 'rounds', label: 'Rounds', color: '#000000', min: 1, max: 20, unit: 'X' },
    { key: 'roundReset', label: 'Round Reset', color: '#F4A261', min: 0, max: 300, unit: 's' },
    { key: 'warmUpTime', label: 'Warm-up', color: '#000000', min: 0, max: 300, unit: 's' }
  ];

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] p-6 bg-white">
        <button 
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {preset ? 'Edit Workout' : 'New Workout'}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Workout Name (e.g., Monday Routine)"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-4 py-3 border-2 border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-black"
          />

          <div className="space-y-3 mt-6">
            {settingsConfig.map(config => (
              <button
                key={config.key}
                onClick={() => setShowPicker(config)}
                className="w-full border-2 border-black rounded-2xl p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="font-medium">{config.label}</span>
                </div>
                <span className="text-2xl font-bold">
                  {config.key === 'rounds' ? `${formData[config.key]}X` : 
                   config.key === 'exercises' ? formData[config.key] :
                   `${formData[config.key]}s`}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:scale-105 transition-transform mt-6"
          >
            Save Workout
          </button>
        </div>
      </div>

      {showPicker && (
        <IOSPicker
          label={showPicker.label}
          value={formData[showPicker.key]}
          min={showPicker.min}
          max={showPicker.max}
          unit={showPicker.unit}
          color={showPicker.color}
          onClose={() => setShowPicker(null)}
          onSave={(value) => {
            updateField(showPicker.key, value);
            setShowPicker(null);
          }}
        />
      )}
    </>
  );
};

export default WorkoutEditor;