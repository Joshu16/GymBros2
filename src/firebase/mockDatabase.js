// Mock database for development without Firebase billing
// This simulates Firebase behavior using localStorage

export const mockDatabase = {
  // Mock routines
  createRoutine: async (userId, routineData) => {
    const routines = JSON.parse(localStorage.getItem('routines') || '[]');
    const newRoutine = {
      id: Date.now().toString(),
      ...routineData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    routines.push(newRoutine);
    localStorage.setItem('routines', JSON.stringify(routines));
    return newRoutine.id;
  },

  getRoutines: async (userId) => {
    const routines = JSON.parse(localStorage.getItem('routines') || '[]');
    return routines.filter(r => r.userId === userId);
  },

  updateRoutine: async (userId, routineId, routineData) => {
    const routines = JSON.parse(localStorage.getItem('routines') || '[]');
    const index = routines.findIndex(r => r.id === routineId && r.userId === userId);
    if (index !== -1) {
      routines[index] = { ...routines[index], ...routineData, updatedAt: new Date().toISOString() };
      localStorage.setItem('routines', JSON.stringify(routines));
    }
  },

  deleteRoutine: async (userId, routineId) => {
    const routines = JSON.parse(localStorage.getItem('routines') || '[]');
    const filtered = routines.filter(r => !(r.id === routineId && r.userId === userId));
    localStorage.setItem('routines', JSON.stringify(filtered));
  },

  // Mock exercises
  createExercise: async (userId, routineId, exerciseData) => {
    const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
    const newExercise = {
      id: Date.now().toString(),
      routineId,
      userId,
      ...exerciseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    exercises.push(newExercise);
    localStorage.setItem('exercises', JSON.stringify(exercises));
    return newExercise.id;
  },

  getExercises: async (userId, routineId) => {
    const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
    return exercises.filter(e => e.userId === userId && e.routineId === routineId);
  },

  updateExercise: async (userId, routineId, exerciseId, exerciseData) => {
    const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
    const index = exercises.findIndex(e => e.id === exerciseId && e.userId === userId && e.routineId === routineId);
    if (index !== -1) {
      exercises[index] = { ...exercises[index], ...exerciseData, updatedAt: new Date().toISOString() };
      localStorage.setItem('exercises', JSON.stringify(exercises));
    }
  },

  deleteExercise: async (userId, routineId, exerciseId) => {
    const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
    const filtered = exercises.filter(e => !(e.id === exerciseId && e.userId === userId && e.routineId === routineId));
    localStorage.setItem('exercises', JSON.stringify(filtered));
  },

  // Mock sessions
  createSession: async (userId, routineId, sessionData) => {
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const newSession = {
      id: Date.now().toString(),
      routineId,
      userId,
      ...sessionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    sessions.push(newSession);
    localStorage.setItem('sessions', JSON.stringify(sessions));
    return newSession.id;
  },

  getSessions: async (userId, routineId) => {
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    return sessions.filter(s => s.userId === userId && s.routineId === routineId);
  },

  getLastSession: async (userId, routineId) => {
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const userSessions = sessions.filter(s => s.userId === userId && s.routineId === routineId);
    return userSessions.length > 0 ? userSessions[userSessions.length - 1] : null;
  }
};
