import React from 'react';
import { useJournal } from '../../context/JournalContext';
import { MOODS } from '../../constants/moods';

const MoodStats = () => {
  const { entries } = useJournal();

  const calculateStats = () => {
    if (entries.length === 0) {
      return {
        averageMood: 0,
        totalEntries: 0,
        moodDistribution: {},
        streak: 0,
      };
    }

    const moodValues = entries.map(entry => entry.mood.value);
    const averageMood = moodValues.reduce((sum, mood) => sum + mood, 0) / moodValues.length;
    
    const moodDistribution = {};
    MOODS.forEach(mood => {
      moodDistribution[mood.value] = entries.filter(entry => entry.mood.value === mood.value).length;
    });

    // Calculate streak (simplified - consecutive days with entries)
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const hasEntry = entries.some(entry => 
        entry.date.toDateString() === checkDate.toDateString()
      );
      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      averageMood: Math.round(averageMood * 10) / 10,
      totalEntries: entries.length,
      moodDistribution,
      streak,
    };
  };

  const stats = calculateStats();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Mood Overview</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.totalEntries}</div>
          <div className="text-sm text-gray-600">Total Entries</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.streak}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Average Mood</span>
          <span className="text-sm text-gray-600">{stats.averageMood}/5</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(stats.averageMood / 5) * 100}%` }}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Mood Distribution</h4>
        <div className="space-y-2">
          {MOODS.map(mood => (
            <div key={mood.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{mood.emoji}</span>
                <span className="text-sm text-gray-600">{mood.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-1">
                  <div
                    className="h-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: mood.color,
                      width: `${stats.totalEntries > 0 ? (stats.moodDistribution[mood.value] / stats.totalEntries) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-6 text-right">
                  {stats.moodDistribution[mood.value] || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodStats;