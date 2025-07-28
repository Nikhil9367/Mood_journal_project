import React, { useState } from 'react';
import { useJournal } from '../../context/JournalContext';
import Header from '../layout/Header';
import MoodStats from './MoodStats';
import RecentEntries from './RecentEntries';
import CalendarView from './CalendarView';
import SearchAndFilter from './SearchAndFilter';
import EntryList from '../journal/EntryList';
import EntryEditor from '../journal/EntryEditor';

const Dashboard = () => {
  const { setCurrentEntry } = useJournal();
  const [showEntryEditor, setShowEntryEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [activeView, setActiveView] = useState('overview');

  const handleNewEntry = () => {
    setEditingEntry(null);
    setShowEntryEditor(true);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setCurrentEntry(entry);
    setShowEntryEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEntryEditor(false);
    setEditingEntry(null);
    setCurrentEntry(null);
  };

  const handleDateSelect = (date) => {
    // Could be used to filter entries by selected date
    console.log('Selected date:', date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewEntry={handleNewEntry} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveView('overview')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeView === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('entries')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeView === 'entries'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Entries
            </button>
          </nav>
        </div>

        {activeView === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <RecentEntries onEditEntry={handleEditEntry} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MoodStats />
                <CalendarView onDateSelect={handleDateSelect} />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <SearchAndFilter />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <SearchAndFilter />
            </div>
            <div className="lg:col-span-3">
              <EntryList onEditEntry={handleEditEntry} />
            </div>
          </div>
        )}
      </main>

      {/* Entry Editor Modal */}
      <EntryEditor
        isOpen={showEntryEditor}
        onClose={handleCloseEditor}
        entry={editingEntry}
      />
    </div>
  );
};

export default Dashboard;