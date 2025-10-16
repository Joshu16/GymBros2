// Local database implementation using localStorage
// Use this when Firebase billing is not enabled

import { mockDatabase } from './mockDatabase.js';

// Mock authentication
export const mockAuth = {
  currentUser: null,
  
  signInWithGoogle: async () => {
    // Simulate Google sign in
    const user = {
      uid: 'mock-user-' + Date.now(),
      displayName: 'Usuario Demo',
      email: 'demo@gymbros.com',
      photoURL: null
    };
    mockAuth.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  signInWithEmail: async (email, password) => {
    // Simulate email sign in
    const user = {
      uid: 'mock-user-' + Date.now(),
      displayName: email.split('@')[0],
      email: email,
      photoURL: null
    };
    mockAuth.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  signUpWithEmail: async (email, password) => {
    // Simulate email sign up
    const user = {
      uid: 'mock-user-' + Date.now(),
      displayName: email.split('@')[0],
      email: email,
      photoURL: null
    };
    mockAuth.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  logout: async () => {
    mockAuth.currentUser = null;
    localStorage.removeItem('currentUser');
  },

  onAuthStateChanged: (callback) => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      mockAuth.currentUser = JSON.parse(savedUser);
    }
    callback(mockAuth.currentUser);
    return () => {}; // unsubscribe function
  }
};

// Export database functions with userId injection
export const createRoutine = async (userId, routineData) => {
  return await mockDatabase.createRoutine(userId, routineData);
};

export const getRoutines = async (userId) => {
  return await mockDatabase.getRoutines(userId);
};

export const updateRoutine = async (userId, routineId, routineData) => {
  return await mockDatabase.updateRoutine(userId, routineId, routineData);
};

export const deleteRoutine = async (userId, routineId) => {
  return await mockDatabase.deleteRoutine(userId, routineId);
};

export const createExercise = async (userId, routineId, exerciseData) => {
  return await mockDatabase.createExercise(userId, routineId, exerciseData);
};

export const getExercises = async (userId, routineId) => {
  return await mockDatabase.getExercises(userId, routineId);
};

export const updateExercise = async (userId, routineId, exerciseId, exerciseData) => {
  return await mockDatabase.updateExercise(userId, routineId, exerciseId, exerciseData);
};

export const deleteExercise = async (userId, routineId, exerciseId) => {
  return await mockDatabase.deleteExercise(userId, routineId, exerciseId);
};

export const createSession = async (userId, routineId, sessionData) => {
  return await mockDatabase.createSession(userId, routineId, sessionData);
};

export const getSessions = async (userId, routineId) => {
  return await mockDatabase.getSessions(userId, routineId);
};

export const getLastSession = async (userId, routineId) => {
  return await mockDatabase.getLastSession(userId, routineId);
};
