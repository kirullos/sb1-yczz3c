import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface ProgressContextType {
  completedWorkouts: Set<string>;
  toggleWorkout: (workoutId: string) => void;
  moduleProgress: number;
  workoutCounter: number;
  totalTrainingTime: number;
  isLoading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const USER_ID = 'default-user'; // In a real app, this would come from authentication

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedWorkouts, setCompletedWorkouts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Firestore
  useEffect(() => {
    async function loadProgress() {
      try {
        const docRef = doc(db, 'progress', USER_ID);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCompletedWorkouts(new Set(data.completedWorkouts));
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProgress();
  }, []);

  // Save to Firestore whenever completedWorkouts changes
  const toggleWorkout = async (workoutId: string) => {
    const next = new Set(completedWorkouts);
    if (next.has(workoutId)) {
      next.delete(workoutId);
    } else {
      next.add(workoutId);
    }
    
    setCompletedWorkouts(next);

    try {
      await setDoc(doc(db, 'progress', USER_ID), {
        completedWorkouts: Array.from(next),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      // Revert on error
      setCompletedWorkouts(completedWorkouts);
    }
  };

  // Calculate metrics
  const moduleProgress = Math.floor((completedWorkouts.size / 11) * 4);
  const workoutCounter = completedWorkouts.size;
  const totalTrainingTime = workoutCounter * 35;

  return (
    <ProgressContext.Provider value={{
      completedWorkouts,
      toggleWorkout,
      moduleProgress,
      workoutCounter,
      totalTrainingTime,
      isLoading
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}