import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      await createExercise(user.uid, id, {
        ...newExercise,
        name: newExercise.name.trim()
      });
      
      setNewExercise({ name: '', sets: 3, reps: 10, rir: 1, weight: 0, notes: '' });
      setShowAddExercise(false);
      loadRoutineData();
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  const handleUpdateExercise = async (exerciseId, updatedData) => {
    try {
      await updateExercise(user.uid, id, exerciseId, updatedData);
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

  const startSession = () => {
    navigate(`/routine/${id}/session`);
  };

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
              onClick={() => navigate('/')}
              className="p-2.5 text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 border border-gray-600 hover:border-gray-500 shadow-lg"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">{routine.name}</h1>
              <p className="text-sm text-gray-400">{exercises.length} exercises</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/routine/${id}/history`)}
                className="p-2.5 text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 border border-gray-600 hover:border-gray-500 shadow-lg"
                title="View Session History"
              >
                <History className="w-5 h-5" />
              </button>
              <button
                onClick={startSession}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Session
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Exercises List */}
        <div className="space-y-4">
          {exercises.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No exercises yet</h3>
              <p className="text-gray-400 mb-6">Add exercises to start building your routine</p>
              <button
                onClick={() => setShowAddExercise(true)}
                className="btn-primary"
              >
                Add Exercise
              </button>
            </div>
          ) : (
            exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{exercise.name}</h3>
                      <p className="text-sm text-gray-400">
                        {exercise.sets} sets × {exercise.reps} reps @ RIR {exercise.rir}
                        {exercise.weight > 0 && ` • ${exercise.weight}kg`}
                      </p>
                      {exercise.notes && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                          "{exercise.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingExercise(exercise)}
                      className="p-2.5 text-white bg-gray-800 hover:bg-blue-600 hover:text-white rounded-lg transition-all duration-200 border border-gray-600 hover:border-blue-500 shadow-lg"
                      title="Edit exercise"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteExercise(exercise.id)}
                      className="p-2.5 text-white bg-gray-800 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 border border-gray-600 hover:border-red-500 shadow-lg"
                      title="Delete exercise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Add Exercise Button */}
        {exercises.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <button
              onClick={() => setShowAddExercise(true)}
              className="bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 w-full flex items-center justify-center gap-2 border border-gray-600 hover:border-gray-500"
            >
              <Plus className="w-5 h-5" />
              Add Exercise
            </button>
          </motion.div>
        )}
      </main>

      {/* Add Exercise Modal */}
      {showAddExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Add Exercise</h3>
            <form onSubmit={handleAddExercise} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Exercise Name
                </label>
                <input
                  type="text"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  className="input-field w-full"
                  placeholder="e.g., Bench Press, Squats, etc."
                  autoFocus
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sets
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) || 1 })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Reps
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) || 1 })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    RIR
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newExercise.rir}
                    onChange={(e) => setNewExercise({ ...newExercise, rir: parseInt(e.target.value) || 0 })}
                    className="input-field w-full"
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
                    value={newExercise.weight}
                    onChange={(e) => setNewExercise({ ...newExercise, weight: parseFloat(e.target.value) || 0 })}
                    className="input-field w-full"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={newExercise.notes}
                    onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
                    className="input-field w-full"
                    placeholder="Optional notes..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddExercise(false)}
                  className="bg-gray-700 text-white px-4 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-200 flex-1 border border-gray-600 hover:border-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-white text-gray-900 px-4 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 flex-1 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Add Exercise
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Exercise Modal */}
      {editingExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Edit Exercise</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateExercise(editingExercise.id, editingExercise);
              setEditingExercise(null);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Exercise Name
                </label>
                <input
                  type="text"
                  value={editingExercise.name}
                  onChange={(e) => setEditingExercise({ ...editingExercise, name: e.target.value })}
                  className="input-field w-full"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sets
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingExercise.sets}
                    onChange={(e) => setEditingExercise({ ...editingExercise, sets: parseInt(e.target.value) || 1 })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Reps
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingExercise.reps}
                    onChange={(e) => setEditingExercise({ ...editingExercise, reps: parseInt(e.target.value) || 1 })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    RIR
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingExercise.rir}
                    onChange={(e) => setEditingExercise({ ...editingExercise, rir: parseInt(e.target.value) || 0 })}
                    className="input-field w-full"
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
                    value={editingExercise.weight || 0}
                    onChange={(e) => setEditingExercise({ ...editingExercise, weight: parseFloat(e.target.value) || 0 })}
                    className="input-field w-full"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={editingExercise.notes || ''}
                    onChange={(e) => setEditingExercise({ ...editingExercise, notes: e.target.value })}
                    className="input-field w-full"
                    placeholder="Optional notes..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setEditingExercise(null)}
                  className="bg-gray-700 text-white px-4 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-200 flex-1 border border-gray-600 hover:border-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-white text-gray-900 px-4 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 flex-1 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
