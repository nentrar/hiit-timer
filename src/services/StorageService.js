import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const StorageService = {
  // Save workout to Firestore
  saveWorkout: async (userId, workout) => {
    try {
      const workoutData = {
        userId,
        workTime: workout.workTime,
        restTime: workout.restTime,
        exercises: workout.exercises,
        rounds: workout.rounds,
        totalTime: workout.totalTime,
        date: new Date().toISOString(),
        createdAt: Timestamp.now()
      };
      console.log('Saving workout:', workoutData);
      await addDoc(collection(db, 'workouts'), workoutData);
      console.log('Workout saved successfully');
    } catch (error) {
      console.error('Error saving workout:', error);
      throw error;
    }
  },
  
  // Get workouts for specific user
  getWorkouts: async (userId) => {
    try {
      const q = query(
        collection(db, 'workouts'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const workouts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Loaded workouts:', workouts);
      return workouts;
    } catch (error) {
      console.error('Error getting workouts:', error);
      return [];
    }
  },

  // NEW: Save named workout preset
  saveWorkoutPreset: async (userId, preset) => {
    try {
      const presetData = {
        userId,
        name: preset.name,
        workTime: preset.workTime,
        restTime: preset.restTime,
        exercises: preset.exercises,
        rounds: preset.rounds,
        roundReset: preset.roundReset,
        warmUpTime: preset.warmUpTime,
        createdAt: Timestamp.now()
      };
      await addDoc(collection(db, 'workoutPresets'), presetData);
      console.log('Preset saved successfully');
    } catch (error) {
      console.error('Error saving preset:', error);
      throw error;
    }
  },

  // NEW: Get workout presets
  getWorkoutPresets: async (userId) => {
    try {
      const q = query(
        collection(db, 'workoutPresets'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting presets:', error);
      return [];
    }
  },

  // NEW: Delete workout preset
  deleteWorkoutPreset: async (presetId) => {
    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'workoutPresets', presetId));
    } catch (error) {
      console.error('Error deleting preset:', error);
      throw error;
    }
  },

  // NEW: Update workout preset
  updateWorkoutPreset: async (presetId, preset) => {
    try {
      const { updateDoc, doc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'workoutPresets', presetId), {
        name: preset.name,
        workTime: preset.workTime,
        restTime: preset.restTime,
        exercises: preset.exercises,
        rounds: preset.rounds,
        roundReset: preset.roundReset,
        warmUpTime: preset.warmUpTime
      });
    } catch (error) {
      console.error('Error updating preset:', error);
      throw error;
    }
  },
  
  // Settings are still stored locally
  saveSettings: (settings) => {
    localStorage.setItem('timerSettings', JSON.stringify(settings));
  },
  
  getSettings: () => {
    const data = localStorage.getItem('timerSettings');
    return data ? JSON.parse(data) : {
      workTime: 20,
      restTime: 10,
      exercises: 5,
      rounds: 2,
      roundReset: 10,
      warmUpTime: 10
    };
  }
};

export default StorageService;