import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { storageUtils } from '../utils/storage';
import { generateId } from '../utils/helpers';

const JournalContext = createContext(undefined);

const journalReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ENTRIES':
      return { ...state, entries: action.payload };
    case 'ADD_ENTRY':
      return { ...state, entries: [...state.entries, action.payload] };
    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map(entry =>
          entry.id === action.payload.id
            ? { ...entry, ...action.payload.updates, updatedAt: new Date() }
            : entry
        ),
      };
    case 'DELETE_ENTRY':
      return {
        ...state,
        entries: state.entries.filter(entry => entry.id !== action.payload),
      };
    case 'SET_CURRENT_ENTRY':
      return { ...state, currentEntry: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_TAGS':
      return { ...state, selectedTags: action.payload };
    case 'SET_SELECTED_MOOD':
      return { ...state, selectedMood: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  entries: [],
  currentEntry: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedTags: [],
  selectedMood: null,
};

export const JournalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(journalReducer, initialState);

  useEffect(() => {
    const savedEntries = storageUtils.getEntries();
    dispatch({ type: 'SET_ENTRIES', payload: savedEntries });
  }, []);

  useEffect(() => {
    storageUtils.saveEntries(state.entries);
  }, [state.entries]);

  const createEntry = (entryData) => {
    const newEntry = {
      ...entryData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_ENTRY', payload: newEntry });
  };

  const updateEntry = (id, updates) => {
    dispatch({ type: 'UPDATE_ENTRY', payload: { id, updates } });
  };

  const deleteEntry = (id) => {
    dispatch({ type: 'DELETE_ENTRY', payload: id });
  };

  const setCurrentEntry = (entry) => {
    dispatch({ type: 'SET_CURRENT_ENTRY', payload: entry });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const setSelectedTags = (tags) => {
    dispatch({ type: 'SET_SELECTED_TAGS', payload: tags });
  };

  const setSelectedMood = (mood) => {
    dispatch({ type: 'SET_SELECTED_MOOD', payload: mood });
  };

  const autoSave = (entry) => {
    if (entry.id) {
      storageUtils.saveDraft(entry);
    }
  };

  const getFilteredEntries = () => {
    let filtered = [...state.entries];

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (state.selectedTags.length > 0) {
      filtered = filtered.filter(entry =>
        state.selectedTags.every(tag => entry.tags.includes(tag))
      );
    }

    if (state.selectedMood) {
      filtered = filtered.filter(entry =>
        entry.mood.value === state.selectedMood.value
      );
    }

    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const getAllTags = () => {
    const tags = new Set();
    state.entries.forEach(entry => {
      entry.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  };

  return (
    <JournalContext.Provider value={{
      ...state,
      createEntry,
      updateEntry,
      deleteEntry,
      setCurrentEntry,
      setSearchQuery,
      setSelectedTags,
      setSelectedMood,
      autoSave,
      getFilteredEntries,
      getAllTags,
    }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};