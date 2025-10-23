import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Play, Edit3, Trash2, Dumbbell, History } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getRoutines, getExercises, createExercise, updateExercise, deleteExercise } from '../firebase/database';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const RoutineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [routine, setRoutine] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: 3,
    reps: 10,
    rir: 1,
    weight: 0,
    notes: ''
  });

  useEffect(() => {
    loadRoutineData();
  }, [id]);

  const loadRoutineData = async () => {
    try {
      setLoading(true);
      const routines = await getRoutines(user.uid);
      const currentRoutine = routines.find(r => r.id === id);
      
      if (!currentRoutine) {
        navigate('/');
        return;
      }
      
      setRoutine(currentRoutine);
      const exercisesData = await getExercises(user.uid, id);
      setExercises(exercisesData);
    } catch (error) {
      console.error('Error loading routine data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    if (!newExercise.name.trim()) return;

    try {
      await createExercise(user.uid, id, newExercise);
      setNewExercise({
        name: '',
        sets: 3,
        reps: 10,
        rir: 1,
        weight: 0,
        notes: ''
      });
      setShowAddExercise(false);
      loadRoutineData();
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  const handleEditExercise = async (e) => {
    e.preventDefault();
    if (!editingExercise.name.trim()) return;

    try {
      await updateExercise(user.uid, id, editingExercise.id, editingExercise);
      setEditingExercise(null);
      loadRoutineData();
    } catch (error) {
      console.error('Error updating exercise:', error);
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        await deleteExercise(user.uid, id, exerciseId);
        loadRoutineData();
      } catch (error) {
        console.error('Error deleting exercise:', error);
      }
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
              onClick={() => navigate('/')}
              className="p-2 text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{routine?.name}</h1>
              <p className="text-sm text-text-muted">{exercises.length} exercises</p>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => navigate(`/routine/${id}/history`)}
                className="p-2 text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
                title="View history"
              >
                <History className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate(`/routine/${id}/session`)}
                className="btn-primary flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Session
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
              <Dumbbell className="w-10 h-10 text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">No exercises yet</h3>
            <p className="text-text-muted mb-8 max-w-md mx-auto leading-relaxed">
              Add your first exercise to start building your routine
            </p>
            <button
              onClick={() => setShowAddExercise(true)}
              className="btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Add First Exercise
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="card hover:bg-bg-tertiary/50 hover:shadow-xl transition-all duration-300 border border-border-secondary hover:border-border-primary"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600/20 to-primary-700/20 rounded-2xl flex items-center justify-center shadow-lg">
                      <Dumbbell className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary text-lg">{exercise.name}</h3>
                      <p className="text-sm text-text-muted">
                        {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight}kg (RIR: {exercise.rir})
                      </p>
                      {exercise.notes && (
                        <p className="text-sm text-text-muted mt-1 italic">"{exercise.notes}"</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingExercise(exercise)}
                      className="p-2 text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
                      title="Edit exercise"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteExercise(exercise.id)}
                      className="p-2 text-text-primary hover:bg-error-600 hover:text-text-primary rounded-lg transition-colors"
                      title="Delete exercise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Exercise Button */}
        {exercises.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAddExercise(true)}
              className="btn-secondary flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add Exercise
            </button>
          </div>
        )}
      </main>

      {/* Add Exercise Modal */}
      {showAddExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-md border border-border-secondary shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600/20 to-primary-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">Add Exercise</h3>
              <p className="text-text-muted">Add a new exercise to your routine</p>
            </div>
            <form onSubmit={handleAddExercise}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                    className="input-field w-full"
                    placeholder="e.g., Bench Press, Squats, etc."
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                      Sets
                    </label>
                    <input
                      type="number"
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise({...newExercise, sets: parseInt(e.target.value) || 0})}
                      className="input-field w-full"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                      Reps
                    </label>
                    <input
                      type="number"
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise({...newExercise, reps: parseInt(e.target.value) || 0})}
                      className="input-field w-full"
                      min="1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={newExercise.weight}
                      onChange={(e) => setNewExercise({...newExercise, weight: parseFloat(e.target.value) || 0})}
                      className="input-field w-full"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                      RIR
                    </label>
                    <input
                      type="number"
                      value={newExercise.rir}
                      onChange={(e) => setNewExercise({...newExercise, rir: parseInt(e.target.value) || 0})}
                      className="input-field w-full"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={newExercise.notes}
                    onChange={(e) => setNewExercise({...newExercise, notes: e.target.value})}
                    className="input-field w-full h-20 resize-none"
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddExercise(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newExercise.name.trim()}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Add Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Exercise Modal */}
      {editingExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-md border border-border-secondary shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600/20 to-primary-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Edit3 className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">Edit Exercise</h3>
              <p className="text-text-muted">Update exercise details</p>
            </div>
            <form onSubmit={handleEditExercise}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    value={editingExercise.name}
                    onChange={(e) => setEditingExercise({...editingExercise, name: e.target.value})}
                    className="input-field w-full"
                    placeholder="e.g., Bench Press, Squats, etc."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                      Sets
                    </label>
                    <input
                      type="number"
                      value={editingExercise.sets}
                      onChange={(e) => setEditingExercise({...editingExercise, sets: parseInt(e.target.value) || 0})}
                      className="input-field w-full"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                      Reps
                    </label>
                    <input
                      type="number"
                      value={editingExercise.reps}
                      onChange={(e) => setEditingExercise({...editingExercise, reps: parseInt(e.target.value) || 0})}
                      className="input-field w-full"
                      min="1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={editingExercise.weight}
                      onChange={(e) => setEditingExercise({...editingExercise, weight: parseFloat(e.target.value) || 0})}
                      className="input-field w-full"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                      RIR
                    </label>
                    <input
                      type="number"
                      value={editingExercise.rir}
                      onChange={(e) => setEditingExercise({...editingExercise, rir: parseInt(e.target.value) || 0})}
                      className="input-field w-full"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={editingExercise.notes}
                    onChange={(e) => setEditingExercise({...editingExercise, notes: e.target.value})}
                    className="input-field w-full h-20 resize-none"
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingExercise(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!editingExercise.name.trim()}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit3 className="w-4 h-4" />
                  Update Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};