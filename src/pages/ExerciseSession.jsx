import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, RotateCcw, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getRoutines, getExercises, getLastSession, createSession } from '../firebase/database';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const ExerciseSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [routine, setRoutine] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [lastSession, setLastSession] = useState(null);
  const [sessionData, setSessionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completedExercises, setCompletedExercises] = useState(new Set());

  useEffect(() => {
    loadSessionData();
  }, [id]);

  const loadSessionData = async () => {
    try {
      setLoading(true);
      
      // Load routine and exercises
      const routines = await getRoutines(user.uid);
      const currentRoutine = routines.find(r => r.id === id);
      
      if (!currentRoutine) {
        navigate('/');
        return;
      }
      
      setRoutine(currentRoutine);
      const exercisesData = await getExercises(user.uid, id);
      setExercises(exercisesData);
      
      // Load last session for placeholders
      const lastSessionData = await getLastSession(user.uid, id);
      setLastSession(lastSessionData);
      
      // Initialize session data with placeholders
      const initialSessionData = {};
      exercisesData.forEach(exercise => {
        const lastExerciseData = lastSessionData?.exercises?.find(e => e.exerciseId === exercise.id);
        initialSessionData[exercise.id] = {
          sets: lastExerciseData?.sets || exercise.sets,
          reps: lastExerciseData?.reps || exercise.reps,
          rir: lastExerciseData?.rir || exercise.rir,
          weight: lastExerciseData?.weight || exercise.weight || 0,
          notes: lastExerciseData?.notes || exercise.notes || '',
          completed: false
        };
      });
      setSessionData(initialSessionData);
      
    } catch (error) {
      console.error('Error loading session data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateExerciseData = (exerciseId, field, value) => {
    setSessionData(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value
      }
    }));
  };

  const toggleExerciseComplete = (exerciseId) => {
    const isCompleted = completedExercises.has(exerciseId);
    if (isCompleted) {
      setCompletedExercises(prev => {
        const newSet = new Set(prev);
        newSet.delete(exerciseId);
        return newSet;
      });
    } else {
      setCompletedExercises(prev => new Set([...prev, exerciseId]));
    }
  };

  const repeatLastSession = () => {
    if (!lastSession) return;
    
    const newSessionData = {};
    exercises.forEach(exercise => {
      const lastExerciseData = lastSession.exercises?.find(e => e.exerciseId === exercise.id);
      if (lastExerciseData) {
        newSessionData[exercise.id] = {
          sets: lastExerciseData.sets,
          reps: lastExerciseData.reps,
          rir: lastExerciseData.rir,
          weight: lastExerciseData.weight || 0,
          notes: lastExerciseData.notes || '',
          completed: false
        };
      }
    });
    setSessionData(newSessionData);
    setCompletedExercises(new Set());
  };

  const saveSession = async () => {
    try {
      setSaving(true);
      
      const sessionPayload = {
        routineId: id,
        routineName: routine.name,
        exercises: Object.entries(sessionData).map(([exerciseId, data]) => {
          const exercise = exercises.find(e => e.id === exerciseId);
          return {
            exerciseId,
            exerciseName: exercise.name,
            sets: data.sets,
            reps: data.reps,
            rir: data.rir,
            weight: data.weight || 0,
            notes: data.notes || '',
            completed: data.completed
          };
        }),
        completedAt: new Date(),
        totalExercises: exercises.length,
        completedExercises: completedExercises.size
      };
      
      await createSession(user.uid, id, sessionPayload);
      
      // Navigate back to routine detail
      navigate(`/routine/${id}`);
      
    } catch (error) {
      console.error('Error saving session:', error);
    } finally {
      setSaving(false);
    }
  };

  const allExercisesCompleted = completedExercises.size === exercises.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Routine not found</h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800"
      >
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/routine/${id}`)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">{routine.name}</h1>
              <p className="text-sm text-gray-400">
                {completedExercises.size} of {exercises.length} exercises completed
              </p>
            </div>
            {lastSession && (
              <button
                onClick={repeatLastSession}
                className="p-2.5 text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 border border-gray-600 hover:border-gray-500 shadow-lg"
                title="Repeat last session"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{completedExercises.size}/{exercises.length}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <motion.div
              className="bg-white h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedExercises.size / exercises.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          {exercises.map((exercise, index) => {
            const isCompleted = completedExercises.has(exercise.id);
            const exerciseData = sessionData[exercise.id] || {};
            
            return (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`card ${isCompleted ? 'bg-green-900/20 border-green-800' : ''}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleExerciseComplete(exercise.id)}
                      className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-200 shadow-lg ${
                        isCompleted
                          ? 'bg-green-600 border-green-600 text-white hover:bg-green-500 hover:border-green-500'
                          : 'border-gray-500 hover:border-green-400 hover:bg-green-500/10'
                      }`}
                    >
                      {isCompleted && <Check className="w-5 h-5" />}
                    </button>
                    <h3 className="font-semibold text-white">{exercise.name}</h3>
                  </div>
                  {isCompleted && (
                    <span className="text-green-400 text-sm font-medium">Completed</span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sets
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={exerciseData.sets || ''}
                      onChange={(e) => updateExerciseData(exercise.id, 'sets', parseInt(e.target.value) || 1)}
                      className="input-field w-full"
                      disabled={isCompleted}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Reps
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={exerciseData.reps || ''}
                      onChange={(e) => updateExerciseData(exercise.id, 'reps', parseInt(e.target.value) || 1)}
                      className="input-field w-full"
                      disabled={isCompleted}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      RIR
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={exerciseData.rir || ''}
                      onChange={(e) => updateExerciseData(exercise.id, 'rir', parseInt(e.target.value) || 0)}
                      className="input-field w-full"
                      disabled={isCompleted}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={exerciseData.weight || ''}
                      onChange={(e) => updateExerciseData(exercise.id, 'weight', parseFloat(e.target.value) || 0)}
                      className="input-field w-full"
                      disabled={isCompleted}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={exerciseData.notes || ''}
                      onChange={(e) => updateExerciseData(exercise.id, 'notes', e.target.value)}
                      className="input-field w-full"
                      disabled={isCompleted}
                      placeholder="Optional notes..."
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Save Session Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <button
            onClick={saveSession}
            disabled={saving || !allExercisesCompleted}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg ${
              allExercisesCompleted
                ? 'bg-white text-gray-900 hover:bg-gray-100 active:scale-95 hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
            }`}
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                {allExercisesCompleted ? 'Save Session' : `Complete ${exercises.length - completedExercises.size} more exercises`}
              </>
            )}
          </button>
        </motion.div>
      </main>
    </div>
  );
};
