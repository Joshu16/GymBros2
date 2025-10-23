import React, { useState, useEffect } from 'react';
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
          sets: exercise.sets,
          reps: lastExerciseData?.reps || exercise.reps,
          weight: lastExerciseData?.weight || exercise.weight,
          rir: lastExerciseData?.rir || exercise.rir,
          notes: ''
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
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(exerciseId)) {
      newCompleted.delete(exerciseId);
    } else {
      newCompleted.add(exerciseId);
    }
    setCompletedExercises(newCompleted);
  };

  const resetExercise = (exerciseId) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    if (exercise) {
      updateExerciseData(exerciseId, 'reps', exercise.reps);
      updateExerciseData(exerciseId, 'weight', exercise.weight);
      updateExerciseData(exerciseId, 'rir', exercise.rir);
      updateExerciseData(exerciseId, 'notes', '');
    }
  };

  const handleSaveSession = async () => {
    try {
      setSaving(true);
      
      const sessionExercises = exercises.map(exercise => ({
        exerciseId: exercise.id,
        name: exercise.name,
        sets: sessionData[exercise.id]?.sets || exercise.sets,
        reps: sessionData[exercise.id]?.reps || exercise.reps,
        weight: sessionData[exercise.id]?.weight || exercise.weight,
        rir: sessionData[exercise.id]?.rir || exercise.rir,
        notes: sessionData[exercise.id]?.notes || ''
      }));

      await createSession(user.uid, id, {
        exercises: sessionExercises,
        completedAt: new Date(),
        duration: 0 // Could calculate actual duration
      });

      alert('Session saved successfully!');
      navigate(`/routine/${id}`);
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Error saving session. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-bg-primary/90 backdrop-blur-xl border-b border-border-secondary shadow-lg">
        <div className="px-4 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/routine/${id}`)}
              className="p-2 text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{routine?.name} - Session</h1>
              <p className="text-sm text-text-muted">
                {completedExercises.size} of {exercises.length} exercises completed
              </p>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleSaveSession}
                disabled={saving}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Session'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {exercises.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-600/20 to-primary-700/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Check className="w-10 h-10 text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">No exercises in this routine</h3>
            <p className="text-text-muted mb-8 max-w-md mx-auto leading-relaxed">
              Add some exercises to your routine before starting a session
            </p>
            <button
              onClick={() => navigate(`/routine/${id}`)}
              className="btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Routine
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {exercises.map((exercise, index) => {
              const isCompleted = completedExercises.has(exercise.id);
              const exerciseData = sessionData[exercise.id] || {};
              
              return (
                <div
                  key={exercise.id}
                  className={`card transition-all duration-300 border ${
                    isCompleted 
                      ? 'border-success-500 bg-success-50/10' 
                      : 'border-border-secondary hover:border-border-primary'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleExerciseComplete(exercise.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-success-500 border-success-500 text-text-primary'
                            : 'border-border-primary hover:border-success-500'
                        }`}
                      >
                        {isCompleted && <Check className="w-4 h-4" />}
                      </button>
                      <div>
                        <h3 className={`font-bold text-lg ${
                          isCompleted ? 'text-success-500' : 'text-text-primary'
                        }`}>
                          {exercise.name}
                        </h3>
                        <p className="text-sm text-text-muted">
                          {exercise.sets} sets planned
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => resetExercise(exercise.id)}
                      className="p-2 text-text-muted hover:text-text-primary transition-colors"
                      title="Reset to original values"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">
                        Reps
                      </label>
                      <input
                        type="number"
                        value={exerciseData.reps || ''}
                        onChange={(e) => updateExerciseData(exercise.id, 'reps', parseInt(e.target.value) || 0)}
                        className="input-field w-full"
                        min="0"
                        disabled={isCompleted}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={exerciseData.weight || ''}
                        onChange={(e) => updateExerciseData(exercise.id, 'weight', parseFloat(e.target.value) || 0)}
                        className="input-field w-full"
                        min="0"
                        step="0.5"
                        disabled={isCompleted}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">
                        RIR
                      </label>
                      <input
                        type="number"
                        value={exerciseData.rir || ''}
                        onChange={(e) => updateExerciseData(exercise.id, 'rir', parseInt(e.target.value) || 0)}
                        className="input-field w-full"
                        min="0"
                        disabled={isCompleted}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">
                        Sets Completed
                      </label>
                      <input
                        type="number"
                        value={exerciseData.sets || ''}
                        onChange={(e) => updateExerciseData(exercise.id, 'sets', parseInt(e.target.value) || 0)}
                        className="input-field w-full"
                        min="0"
                        max={exercise.sets}
                        disabled={isCompleted}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                      Notes
                    </label>
                    <textarea
                      value={exerciseData.notes || ''}
                      onChange={(e) => updateExerciseData(exercise.id, 'notes', e.target.value)}
                      className="input-field w-full h-20 resize-none"
                      placeholder="How did it feel? Any adjustments needed?"
                      disabled={isCompleted}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};