import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthGuard } from './components/AuthGuard';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { RoutineDetail } from './pages/RoutineDetail';
import { ExerciseSession } from './pages/ExerciseSession';
import { SessionHistory } from './pages/SessionHistory';
import { LoadingSpinner } from './components/LoadingSpinner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/" 
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/routine/:id" 
              element={
                <AuthGuard>
                  <RoutineDetail />
                </AuthGuard>
              } 
            />
            <Route 
              path="/routine/:id/session" 
              element={
                <AuthGuard>
                  <ExerciseSession />
                </AuthGuard>
              } 
            />
            <Route 
              path="/routine/:id/history" 
              element={
                <AuthGuard>
                  <SessionHistory />
                </AuthGuard>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
