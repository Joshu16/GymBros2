import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getRoutines, getSessions } from '../firebase/database';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const SessionHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [routine, setRoutine] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessionHistory();
  }, [id]);

  const loadSessionHistory = async () => {
    try {
      setLoading(true);
      
      // Load routine
      const routines = await getRoutines(user.uid);
      const currentRoutine = routines.find(r => r.id === id);
      
      if (!currentRoutine) {
        navigate('/');
        return;
      }
      
      setRoutine(currentRoutine);
      
      // Load sessions
      const sessionsData = await getSessions(user.uid, id);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading session history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalExercises = (session) => {
    return session.exercises ? session.exercises.length : 0;
  };

  const getCompletedExercises = (session) => {
    if (!session.exercises) return 0;
    return session.exercises.filter(ex => ex.sets > 0).length;
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
              <h1 className="text-2xl font-bold text-text-primary">{routine?.name} - History</h1>
              <p className="text-sm text-text-muted">{sessions.length} sessions completed</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-600/20 to-primary-700/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Calendar className="w-10 h-10 text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">No sessions yet</h3>
            <p className="text-text-muted mb-8 max-w-md mx-auto leading-relaxed">
              Complete your first workout session to see your progress here
            </p>
            <button
              onClick={() => navigate(`/routine/${id}/session`)}
              className="btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              <CheckCircle className="w-5 h-5" />
              Start First Session
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <div
                key={session.id}
                className="card hover:bg-bg-tertiary/50 hover:shadow-xl transition-all duration-300 border border-border-secondary hover:border-border-primary"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-success-600/20 to-success-500/30 rounded-2xl flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-6 h-6 text-success-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary text-lg">
                        Session #{sessions.length - index}
                      </h3>
                      <p className="text-sm text-text-muted">
                        {formatDate(session.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary">
                      {getCompletedExercises(session)} / {getTotalExercises(session)} exercises
                    </p>
                    <p className="text-xs text-text-muted">
                      {session.duration ? `${session.duration} min` : 'Duration not recorded'}
                    </p>
                  </div>
                </div>

                {/* Session Details */}
                <div className="mt-4 pt-4 border-t border-border-secondary">
                  <h4 className="text-sm font-semibold text-text-secondary mb-3">Exercises Completed:</h4>
                  <div className="space-y-2">
                    {session.exercises?.map((exercise, exIndex) => (
                      <div
                        key={exIndex}
                        className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-text-primary">{exercise.name}</p>
                          <p className="text-sm text-text-muted">
                            {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight}kg
                            {exercise.rir && ` (RIR: ${exercise.rir})`}
                          </p>
                          {exercise.notes && (
                            <p className="text-sm text-text-muted italic mt-1">"{exercise.notes}"</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success-500" />
                        </div>
                      </div>
                    )) || (
                      <p className="text-text-muted text-sm">No exercise details available</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};