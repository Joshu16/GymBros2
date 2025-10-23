import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Dumbbell, Calendar, Download, LogOut, User, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getRoutines, createRoutine, deleteRoutine } from '../firebase/database';
import { logout } from '../firebase/auth';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ExportModal } from '../components/ExportModal';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [isCreatingRoutine, setIsCreatingRoutine] = useState(false);

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    try {
      setLoading(true);
      if (user?.uid) {
        console.log('Loading routines for user:', user.uid);
        const routinesData = await getRoutines(user.uid);
        console.log('Loaded routines:', routinesData);
        setRoutines(routinesData);
      } else {
        console.log('No user UID available');
      }
    } catch (error) {
      console.error('Error loading routines:', error);
      console.error('Error details:', error.message, error.code);
      // Show user-friendly error message
      alert(`Error loading routines: ${error.message}. Please check your internet connection and try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoutine = async (e) => {
    e.preventDefault();
    if (!newRoutineName.trim() || isCreatingRoutine) return;

    try {
      setIsCreatingRoutine(true);
      if (user?.uid) {
        console.log('Creating routine for user:', user.uid);
        const routineId = await createRoutine(user.uid, {
          name: newRoutineName.trim(),
          description: '',
          exercises: []
        });
        console.log('Routine created with ID:', routineId);
        
        setNewRoutineName('');
        setShowCreateModal(false);
        await loadRoutines(); // Wait for load to complete
        alert('Routine created successfully!');
      } else {
        alert('Please log in to create routines.');
      }
    } catch (error) {
      console.error('Error creating routine:', error);
      console.error('Error details:', error.message, error.code);
      alert(`Error creating routine: ${error.message}. Please check your internet connection and try again.`);
    } finally {
      setIsCreatingRoutine(false);
    }
  };

  const handleDeleteRoutine = async (routineId) => {
    if (window.confirm('Are you sure you want to delete this routine?')) {
      try {
        await deleteRoutine(user.uid, routineId);
        loadRoutines();
      } catch (error) {
        console.error('Error deleting routine:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Dumbbell className="w-7 h-7 text-text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">GymBros</h1>
                <p className="text-sm text-text-muted font-medium">Welcome back, {user?.displayName || 'Champion'}!</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowExportModal(true)}
                className="p-2.5 text-text-primary bg-bg-secondary hover:bg-bg-tertiary rounded-lg transition-all duration-200 border border-border-primary hover:border-border-primary shadow-lg"
                title="Export data"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2.5 text-text-primary bg-bg-secondary hover:bg-error-600 hover:text-text-primary rounded-lg transition-all duration-200 border border-border-primary hover:border-error-600 shadow-lg"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="card hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 border border-border-secondary hover:border-primary-500/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600/20 to-primary-500/30 rounded-2xl flex items-center justify-center shadow-lg">
                <Dumbbell className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-text-primary">{routines.length}</p>
                <p className="text-sm text-text-muted font-medium">Active Routines</p>
              </div>
            </div>
          </div>
          <div className="card hover:shadow-xl hover:shadow-success-500/10 transition-all duration-300 border border-border-secondary hover:border-success-500/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-success-600/20 to-success-500/30 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-success-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-text-primary">0</p>
                <p className="text-sm text-text-muted font-medium">Sessions Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Routines Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">Your Routines</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Routine
            </button>
          </div>

          {routines.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-600/20 to-primary-700/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Dumbbell className="w-10 h-10 text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">Ready to get started?</h3>
              <p className="text-text-muted mb-8 max-w-md mx-auto leading-relaxed">
                Create your first workout routine and start tracking your fitness journey with GymBros
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Create Your First Routine
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {routines.map((routine, index) => (
                <div
                  key={routine.id}
                  className="card cursor-pointer group hover:bg-bg-tertiary/50 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 border border-border-secondary hover:border-border-primary"
                  onClick={() => navigate(`/routine/${routine.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-600/20 to-primary-700/20 rounded-2xl flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-primary-600/30 transition-all duration-300 shadow-lg">
                        <Dumbbell className="w-7 h-7 text-primary-400 group-hover:text-primary-300 transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary group-hover:text-text-secondary transition-colors text-lg">
                          {routine.name}
                        </h3>
                        <p className="text-sm text-text-muted group-hover:text-text-secondary transition-colors">
                          {routine.exercises?.length || 0} exercises • Created {routine.createdAt ? new Date(routine.createdAt.seconds * 1000).toLocaleDateString() : 'recently'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/routine/${routine.id}/session`);
                        }}
                        className="px-4 py-2 bg-text-primary text-text-inverse rounded-lg text-sm font-semibold hover:bg-secondary-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Start Session
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRoutine(routine.id);
                        }}
                        className="p-2.5 text-text-primary bg-bg-secondary hover:bg-error-600 hover:text-text-primary rounded-lg transition-all duration-200 border border-border-primary hover:border-error-600 shadow-lg"
                        title="Delete routine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Routine Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-md border border-border-secondary shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600/20 to-primary-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">Create New Routine</h3>
              <p className="text-text-muted">Give your workout routine a name</p>
            </div>
            <form onSubmit={handleCreateRoutine}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-text-secondary mb-3">
                  Routine Name
                </label>
                <input
                  type="text"
                  value={newRoutineName}
                  onChange={(e) => setNewRoutineName(e.target.value)}
                  className="input-field w-full text-lg"
                  placeholder="e.g., Upper A, Push Day, etc."
                  autoFocus
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary flex-1 text-lg py-3"
                  disabled={isCreatingRoutine}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingRoutine || !newRoutineName.trim()}
                  className="btn-primary flex-1 text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingRoutine ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-text-inverse border-t-transparent rounded-full"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create Routine
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          routines={routines}
        />
      )}
    </div>
  );
};