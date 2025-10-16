import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

// Routines collection
export const createRoutine = async (userId, routineData) => {
  try {
    const routineRef = await addDoc(collection(db, 'users', userId, 'routines'), {
      ...routineData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return routineRef.id;
  } catch (error) {
    console.error('Error creating routine:', error);
    throw error;
  }
};

export const getRoutines = async (userId) => {
  try {
    const routinesRef = collection(db, 'users', userId, 'routines');
    const q = query(routinesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting routines:', error);
    throw error;
  }
};

export const updateRoutine = async (userId, routineId, routineData) => {
  try {
    const routineRef = doc(db, 'users', userId, 'routines', routineId);
    await updateDoc(routineRef, {
      ...routineData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating routine:', error);
    throw error;
  }
};

export const deleteRoutine = async (userId, routineId) => {
  try {
    const routineRef = doc(db, 'users', userId, 'routines', routineId);
    await deleteDoc(routineRef);
  } catch (error) {
    console.error('Error deleting routine:', error);
    throw error;
  }
};

// Exercises collection
export const createExercise = async (userId, routineId, exerciseData) => {
  try {
    const exerciseRef = await addDoc(collection(db, 'users', userId, 'routines', routineId, 'exercises'), {
      ...exerciseData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return exerciseRef.id;
  } catch (error) {
    console.error('Error creating exercise:', error);
    throw error;
  }
};

export const getExercises = async (userId, routineId) => {
  try {
    const exercisesRef = collection(db, 'users', userId, 'routines', routineId, 'exercises');
    const q = query(exercisesRef, orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting exercises:', error);
    throw error;
  }
};

export const updateExercise = async (userId, routineId, exerciseId, exerciseData) => {
  try {
    const exerciseRef = doc(db, 'users', userId, 'routines', routineId, 'exercises', exerciseId);
    await updateDoc(exerciseRef, {
      ...exerciseData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating exercise:', error);
    throw error;
  }
};

export const deleteExercise = async (userId, routineId, exerciseId) => {
  try {
    const exerciseRef = doc(db, 'users', userId, 'routines', routineId, 'exercises', exerciseId);
    await deleteDoc(exerciseRef);
  } catch (error) {
    console.error('Error deleting exercise:', error);
    throw error;
  }
};

// Sessions collection
export const createSession = async (userId, routineId, sessionData) => {
  try {
    const sessionRef = await addDoc(collection(db, 'users', userId, 'routines', routineId, 'sessions'), {
      ...sessionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return sessionRef.id;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

export const getSessions = async (userId, routineId) => {
  try {
    const sessionsRef = collection(db, 'users', userId, 'routines', routineId, 'sessions');
    const q = query(sessionsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting sessions:', error);
    throw error;
  }
};

export const getLastSession = async (userId, routineId) => {
  try {
    const sessionsRef = collection(db, 'users', userId, 'routines', routineId, 'sessions');
    const q = query(sessionsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data()
    };
  } catch (error) {
    console.error('Error getting last session:', error);
    throw error;
  }
};
