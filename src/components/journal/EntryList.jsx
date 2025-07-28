import React from 'react';
import { Calendar, Tag, Edit3, Clock } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { formatDate, truncateText, extractTextFromHtml } from '../../utils/helpers';

const EntryList = ({ onEditEntry }) => {
  const { getFilteredEntries } = useJournal();
  const entries = getFilteredEntries();

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No entries found</h3>
        <p className="text-gray-500">
          Start writing your first journal entry to track your mood journey.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map(entry => (
        <div
          key={entry.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onEditEntry(entry)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{entry.mood.emoji}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(entry.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {entry.mood.label}
                    </div>
                    {entry.isDraft && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Preview */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {truncateText(extractTextFromHtml(entry.content), 200)}
                </p>
              </div>

              {/* Tags */}
              {entry.tags.length > 0 && (
                <div className="flex items-center space-x-2 mb-3">
                  <Tag size={16} className="text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Edit Icon */}
            <div className="ml-4">
              <Edit3 size={18} className="text-gray-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EntryList;