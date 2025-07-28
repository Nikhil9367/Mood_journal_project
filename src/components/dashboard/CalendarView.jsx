import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useJournal } from '../../context/JournalContext';
import { formatDate } from '../../utils/helpers';

const CalendarView = ({ onDateSelect }) => {
  const { entries } = useJournal();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getEntriesForDate = (date) => {
    return entries.filter(entry => 
      entry.date.toDateString() === date.toDateString()
    );
  };

  const getTileContent = ({ date }) => {
    const dayEntries = getEntriesForDate(date);
    if (dayEntries.length === 0) return null;

    return (
      <div className="flex justify-center mt-1">
        <div className="flex space-x-1">
          {dayEntries.slice(0, 3).map((entry, index) => (
            <div
              key={entry.id}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: entry.mood.color }}
            />
          ))}
          {dayEntries.length > 3 && (
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          )}
        </div>
      </div>
    );
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendar</h3>
      
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={getTileContent}
          className="mx-auto"
          maxDate={new Date()}
        />
      </div>

      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">
            {formatDate(selectedDate)}
          </h4>
          
          {getEntriesForDate(selectedDate).length > 0 ? (
            <div className="space-y-2">
              {getEntriesForDate(selectedDate).map(entry => (
                <div key={entry.id} className="flex items-center space-x-2 text-sm">
                  <span className="text-lg">{entry.mood.emoji}</span>
                  <span className="text-gray-700 truncate">{entry.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No entries for this date</p>
          )}
        </div>
      )}

      <style jsx>{`
        .calendar-container :global(.react-calendar) {
          width: 100%;
          border: none;
          font-family: inherit;
        }
        
        .calendar-container :global(.react-calendar__tile) {
          position: relative;
          height: 40px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          padding: 4px;
          border-radius: 6px;
          border: none;
          background: none;
          transition: all 0.2s;
        }
        
        .calendar-container :global(.react-calendar__tile:hover) {
          background-color: #f3f4f6;
        }
        
        .calendar-container :global(.react-calendar__tile--active) {
          background-color: #3b82f6 !important;
          color: white;
        }
        
        .calendar-container :global(.react-calendar__tile--now) {
          background-color: #dbeafe;
          font-weight: 600;
        }
        
        .calendar-container :global(.react-calendar__navigation button) {
          color: #374151;
          font-weight: 500;
          font-size: 14px;
          border: none;
          background: none;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.2s;
        }
        
        .calendar-container :global(.react-calendar__navigation button:hover) {
          background-color: #f3f4f6;
        }
        
        .calendar-container :global(.react-calendar__month-view__weekdays) {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;