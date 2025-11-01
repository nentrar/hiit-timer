import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import Layout from './components/Layout';
import TimerSetup from './components/TimerSetup';
import ActiveWorkout from './components/ActiveWorkout';
import WorkoutComplete from './components/WorkoutComplete';
import HistoryView from './components/HistoryView';
import WorkoutsView from './components/WorkoutsView';
import WorkoutEditor from './components/WorkoutEditor';
import AuthScreen from './components/AuthScreen';
import StorageService from './services/StorageService';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('setup');
  const [settings, setSettings] = useState(StorageService.getSettings());
  const [completedWorkout, setCompletedWorkout] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [workoutPresets, setWorkoutPresets] = useState([]);
  const [editingPreset, setEditingPreset] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        loadWorkouts(currentUser.uid);
        loadWorkoutPresets(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadWorkouts = async (userId) => {
    console.log('Loading workouts for user:', userId);
    const userWorkouts = await StorageService.getWorkouts(userId);
    console.log('Loaded workouts:', userWorkouts);
    setWorkouts(userWorkouts);
  };

  const loadWorkoutPresets = async (userId) => {
    const presets = await StorageService.getWorkoutPresets(userId);
    setWorkoutPresets(presets);
  };

  const handleStart = () => {
    setView('workout');
  };

  const handleComplete = async (workout) => {
    if (user) {
      await StorageService.saveWorkout(user.uid, workout);
      await loadWorkouts(user.uid);
    }
    setCompletedWorkout(workout);
    setView('complete');
  };

  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  const handleRunWorkout = (workoutData) => {
    // Set settings from workout data and start
    const workoutSettings = {
      workTime: workoutData.workTime,
      restTime: workoutData.restTime,
      exercises: workoutData.exercises,
      rounds: workoutData.rounds,
      roundReset: workoutData.roundReset || 10,
      warmUpTime: workoutData.warmUpTime || 10
    };
    setSettings(workoutSettings);
    handleUpdateSettings(workoutSettings);
    setView('workout');
  };

  const handleSavePreset = async (preset) => {
    if (user) {
      if (editingPreset && editingPreset.id) {
        await StorageService.updateWorkoutPreset(editingPreset.id, preset);
      } else {
        await StorageService.saveWorkoutPreset(user.uid, preset);
      }
      await loadWorkoutPresets(user.uid);
    }
    setEditingPreset(null);
    setView('workouts');
  };

  const handleDeletePreset = async (presetId) => {
  if (window.confirm('Are you sure you want to delete this workout?')) {
    await StorageService.deleteWorkoutPreset(presetId);
    await loadWorkoutPresets(user.uid);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setView('setup');
      setWorkouts([]);
      setWorkoutPresets([]);
      setShowMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'setup': return 'Timer';
      case 'workout': return 'Workout';
      case 'complete': return 'Complete';
      case 'history': return 'History';
      case 'workouts': return 'Workouts';
      case 'workoutEditor': return editingPreset ? 'Edit Workout' : 'New Workout';
      default: return 'HIIT Timer';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <>
      {view === 'workout' ? (
        <ActiveWorkout 
          settings={settings}
          onComplete={handleComplete}
          onStop={() => setView('setup')}
        />
      ) : view === 'workoutEditor' ? (
        <WorkoutEditor
          preset={editingPreset}
          onBack={() => {
            setEditingPreset(null);
            setView('workouts');
          }}
          onSave={handleSavePreset}
        />
      ) : (
        <Layout 
          title={getTitle()} 
          onMenuClick={() => setShowMenu(!showMenu)}
          showMenu={view === 'setup'}
        >
          {view === 'setup' && (
            <TimerSetup 
              onStart={handleStart}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}
          {view === 'complete' && completedWorkout && (
            <WorkoutComplete 
              workout={completedWorkout}
              totalWorkouts={workouts.length}
              onDone={() => setView('setup')}
              onHistory={() => {
                loadWorkouts(user.uid);
                setView('history');
              }}
            />
          )}
          {view === 'history' && (
            <HistoryView 
              workouts={workouts}
              onBack={() => setView('setup')}
              onRun={handleRunWorkout}
            />
          )}
          {view === 'workouts' && (
            <WorkoutsView
              presets={workoutPresets}
              onBack={() => setView('setup')}
              onCreateNew={() => {
                setEditingPreset(null);
                setView('workoutEditor');
              }}
              onEdit={(preset) => {
                setEditingPreset(preset);
                setView('workoutEditor');
              }}
              onDelete={handleDeletePreset}
              onRun={handleRunWorkout}
            />
          )}
        </Layout>
      )}

      {showMenu && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center">
            <button 
              onClick={() => setShowMenu(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-8">
              <div className="text-sm text-gray-500 mb-2">Logged in as</div>
              <div className="font-medium">{user.email}</div>
            </div>

            <nav className="space-y-4">
              <button 
                onClick={() => {
                  setView('setup');
                  setShowMenu(false);
                }}
                className="block w-full text-2xl font-bold hover:text-gray-600 transition-colors py-3"
              >
                Timer
              </button>
              <button 
                onClick={() => {
                  setView('workouts');
                  setShowMenu(false);
                }}
                className="block w-full text-2xl font-bold hover:text-gray-600 transition-colors py-3"
              >
                Workouts
              </button>
              <button 
                onClick={() => {
                  loadWorkouts(user.uid);
                  setView('history');
                  setShowMenu(false);
                }}
                className="block w-full text-2xl font-bold hover:text-gray-600 transition-colors py-3"
              >
                History
              </button>
              <button 
                onClick={handleSignOut}
                className="block w-full text-2xl font-bold text-red-600 hover:text-red-700 transition-colors py-3 mt-8"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default App;