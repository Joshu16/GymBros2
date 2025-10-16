import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      
      // Load routine info
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
    
    let date;
    if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCompletionRate = (session) => {
    if (!session.totalExercises || session.totalExercises === 0) return 0;
    return Math.round((session.completedExercises / session.totalExercises) * 100);
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
        className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur-xl border-b border-gray-700/50 shadow-lg"
      >
        <div className="px-4 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/routine/${id}`)}
              className="p-2.5 text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 border border-gray-600 hover:border-gray-500 shadow-lg"
              title="Back to Routine"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{routine.name}</h1>
              <p className="text-sm text-gray-400 font-medium">Session History</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Calendar className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No sessions yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              Start your first workout session to see your progress history here
            </p>
            <button
              onClick={() => navigate(`/routine/${id}/session`)}
              className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start First Session
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="card hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl flex items-center justify-center shadow-lg">
                      <Calendar className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">
                        Session #{sessions.length - index}
                      </h3>
                      <p className="text-sm text-gray-400 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatDate(session.completedAt || session.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      {getCompletionRate(session) === 100 ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-orange-400" />
                      )}
                      <span className={`text-sm font-semibold ${
                        getCompletionRate(session) === 100 ? 'text-green-400' : 'text-orange-400'
                      }`}>
                        {getCompletionRate(session)}% Complete
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {session.completedExercises || 0} of {session.totalExercises || 0} exercises
                    </p>
                  </div>
                </div>

                {/* Exercises in this session */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Exercises performed:</h4>
                  {session.exercises && session.exercises.length > 0 ? (
                    <div className="grid gap-2">
                      {session.exercises.map((exercise, exIndex) => (
                        <div
                          key={exIndex}
                          className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-white text-sm">
                                {exercise.exerciseName}
                              </h5>
                              <p className="text-xs text-gray-400">
                                {exercise.sets} sets × {exercise.reps} reps @ RIR {exercise.rir}
                                {exercise.weight > 0 && ` • ${exercise.weight}kg`}
                              </p>
                              {exercise.notes && (
                                <p className="text-xs text-gray-500 mt-1 italic">
                                  "{exercise.notes}"
                                </p>
                              )}
                            </div>
                            <div className="ml-3">
                              {exercise.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No exercise data available</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
