import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, X, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getRoutines, getSessions } from '../firebase/database';

export const ExportModal = ({ onClose, routines }) => {
  const [exporting, setExporting] = useState(false);
  const { user } = useAuth();

  const exportToCSV = async () => {
    try {
      setExporting(true);
      
      // Fetch all session data for all routines
      const allSessionData = [];
      
      for (const routine of routines) {
        try {
          const sessions = await getSessions(user.uid, routine.id);
          
          for (const session of sessions) {
            if (session.exercises && session.exercises.length > 0) {
              for (const exercise of session.exercises) {
                allSessionData.push({
                  routine: routine.name,
                  exercise: exercise.exerciseName,
                  sets: exercise.sets || 0,
                  reps: exercise.reps || 0,
                  rir: exercise.rir || 0,
                  weight: exercise.weight || 0,
                  notes: exercise.notes || '',
                  completed: exercise.completed ? 'Yes' : 'No',
                  date: session.completedAt ? 
                    new Date(session.completedAt.seconds ? session.completedAt.seconds * 1000 : session.completedAt).toISOString().split('T')[0] :
                    new Date(session.createdAt.seconds ? session.createdAt.seconds * 1000 : session.createdAt).toISOString().split('T')[0]
                });
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching sessions for routine ${routine.name}:`, error);
        }
      }
      
      // Create CSV content
      const headers = ['Routine', 'Exercise', 'Sets', 'Reps', 'RIR', 'Weight (kg)', 'Notes', 'Completed', 'Date'];
      const csvRows = [
        headers.join(','),
        ...allSessionData.map(row => [
          `"${row.routine}"`,
          `"${row.exercise}"`,
          row.sets,
          row.reps,
          row.rir,
          row.weight,
          `"${row.notes}"`,
          row.completed,
          row.date
        ].join(','))
      ];
      
      const csvContent = csvRows.join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gymbros-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      onClose();
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Export Data</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            Export your routines and workout data to CSV format for backup or analysis.
          </p>

          <div className="bg-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-white">CSV Export</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Download all your routines and session data in a spreadsheet format.
            </p>
            <button
              onClick={exportToCSV}
              disabled={exporting}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {exporting ? (
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download CSV
                </>
              )}
            </button>
          </div>

          <div className="bg-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-green-400" />
              <span className="font-medium text-white">Google Drive</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Save your data directly to Google Drive (coming soon).
            </p>
            <button
              disabled
              className="btn-secondary w-full flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Save to Drive
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="btn-secondary w-full"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
