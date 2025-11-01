import React, { useState } from 'react';
import { Play } from 'lucide-react';
import IOSPicker from './IOSPicker';

const TimerSetup = ({ onStart, settings, onUpdateSettings }) => {
  const [showPicker, setShowPicker] = useState(null);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    onUpdateSettings(newSettings);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = (settings.workTime + settings.restTime) * settings.exercises * settings.rounds + settings.roundReset * (settings.rounds - 1);

  const settingsConfig = [
    { key: 'workTime', label: 'Work', color: '#2A9D8F', min: 5, max: 300, unit: 's' },
    { key: 'restTime', label: 'Rest', color: '#E9C46A', min: 5, max: 300, unit: 's' },
    { key: 'exercises', label: 'Exercises', color: '#000000', min: 1, max: 50, unit: '' },
    { key: 'rounds', label: 'Rounds', color: '#000000', min: 1, max: 20, unit: 'X' },
    { key: 'roundReset', label: 'Round Reset', color: '#F4A261', min: 0, max: 300, unit: 's' }
  ];

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <div className="text-center mb-12">
          <div className="text-7xl font-bold mb-2">{formatTime(totalTime)}</div>
          <div className="text-gray-500 text-sm">Total Workout Time</div>
        </div>

        <div className="w-full max-w-md space-y-3 mb-12">
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
                {config.key === 'rounds' ? `${settings[config.key]}X` : 
                 config.key === 'exercises' ? settings[config.key] :
                 `${settings[config.key]}s`}
              </span>
            </button>
          ))}
        </div>

        <button 
          onClick={onStart}
          className="w-32 h-32 rounded-full bg-black text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
        >
          <Play className="w-12 h-12 ml-1" fill="white" />
        </button>
      </div>

      {showPicker && (
        <IOSPicker
          label={showPicker.label}
          value={settings[showPicker.key]}
          min={showPicker.min}
          max={showPicker.max}
          unit={showPicker.unit}
          color={showPicker.color}
          onClose={() => setShowPicker(null)}
          onSave={(value) => {
            updateSetting(showPicker.key, value);
            setShowPicker(null);
          }}
        />
      )}
    </>
  );
};

export default TimerSetup;