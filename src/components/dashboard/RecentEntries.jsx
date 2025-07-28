import React from 'react';
import { Calendar, Tag, Edit3 } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { formatDate, truncateText, extractTextFromHtml } from '../../utils/helpers';

const RecentEntries = ({ onEditEntry }) => {
  const { entries } = useJournal();

  const recentEntries = entries
    .slice()
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  if (recentEntries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Entries</h3>
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">No entries yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Start your mood journey by creating your first entry.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Entries</h3>
      
      <div className="space-y-4">
        {recentEntries.map(entry => (
          <div
            key={entry.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onEditEntry(entry)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{entry.mood.emoji}</span>
                  <h4 className="font-medium text-gray-900 truncate">{entry.title}</h4>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {truncateText(extractTextFromHtml(entry.content), 100)}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar size={12} className="mr-1" />
                      {formatDate(entry.date)}
                    </div>
                    
                    {entry.tags.length > 0 && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Tag size={12} className="mr-1" />
                        {entry.tags.slice(0, 2).join(', ')}
                        {entry.tags.length > 2 && ` +${entry.tags.length - 2}`}
                      </div>
                    )}
                  </div>
                  
                  <Edit3 size={14} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentEntries;