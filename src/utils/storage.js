const STORAGE_KEYS = {
  USER: 'mood_journal_user',
  ENTRIES: 'mood_journal_entries',
  DRAFTS: 'mood_journal_drafts',
};

export const storageUtils = {
  // User management
  saveUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getUser: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  },

  clearUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Journal entries
  saveEntries: (entries) => {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  },

  getEntries: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    if (!stored) return [];
    
    return JSON.parse(stored).map((entry) => ({
      ...entry,
      date: new Date(entry.date),
      createdAt: new Date(entry.createdAt),
      updatedAt: new Date(entry.updatedAt),
    }));
  },

  // Auto-save drafts
  saveDraft: (entry) => {
    const drafts = storageUtils.getDrafts();
    const existingIndex = drafts.findIndex(d => d.id === entry.id);
    
    if (existingIndex >= 0) {
      drafts[existingIndex] = { ...drafts[existingIndex], ...entry };
    } else {
      drafts.push(entry);
    }
    
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
  },

  getDrafts: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    return stored ? JSON.parse(stored) : [];
  },

  clearDrafts: () => {
    localStorage.removeItem(STORAGE_KEYS.DRAFTS);
  },
};