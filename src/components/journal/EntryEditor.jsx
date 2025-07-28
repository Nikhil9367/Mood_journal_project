import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import { Calendar, Save, Trash2, Brain, Loader2 } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { generateId } from '../../utils/helpers';
import { analyzeJournalEntry } from '../../services/aiAnalysis';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import 'react-quill/dist/quill.snow.css';

const EntryEditor = ({ isOpen, onClose, entry = null }) => {
  const { createEntry, updateEntry, deleteEntry, autoSave } = useJournal();
  const [formData, setFormData] = useState({
    id: '',
    content: '',
    date: new Date(),
    isDraft: true,
    analysis: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const autoSaveTimeoutRef = useRef(null);

  useEffect(() => {
    if (entry) {
      setFormData({
        ...entry,
        date: new Date(entry.date),
      });
      setShowAnalysis(!!entry.analysis);
    } else {
      setFormData({
        id: generateId(),
        content: '',
        date: new Date(),
        isDraft: true,
        analysis: null,
      });
      setShowAnalysis(false);
    }
  }, [entry, isOpen]);

  // Auto-save functionality
  useEffect(() => {
    if (formData.content.trim()) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        autoSave(formData);
      }, 2000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData.content, autoSave]);

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleAnalyze = async () => {
    if (!formData.content.trim()) return;

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeJournalEntry(formData.content);
      setFormData(prev => ({ ...prev, analysis }));
      setShowAnalysis(true);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (isDraft = false) => {
    if (!formData.content.trim()) return;

    setIsSubmitting(true);
    
    try {
      const entryData = {
        ...formData,
        title: formData.content.substring(0, 50).replace(/<[^>]*>/g, '') + '...',
        mood: formData.analysis?.mood || { value: 3, emoji: '😐', label: 'Neutral', color: '#eab308' },
        tags: formData.analysis?.tags || [],
        isDraft,
      };

      if (entry) {
        updateEntry(entry.id, entryData);
      } else {
        createEntry(entryData);
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to save entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (entry && window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(entry.id);
      onClose();
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block', 'link'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title={entry ? 'Edit Entry' : 'New Entry'}>
      <div className="space-y-6">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="date"
              value={formData.date.toISOString().split('T')[0]}
              onChange={(e) => setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What's on your mind?
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <ReactQuill
              value={formData.content}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
              placeholder="Write about your day, thoughts, feelings..."
              style={{ minHeight: '300px' }}
            />
          </div>
        </div>

        {/* AI Analysis Button */}
        {formData.content.trim() && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleAnalyze}
              isLoading={isAnalyzing}
              leftIcon={isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
              className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-blue-100"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
            </Button>
          </div>
        )}

        {/* AI Analysis Results */}
        {showAnalysis && formData.analysis && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center mb-4">
              <Brain className="text-purple-600 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-purple-900">AI Analysis</h3>
            </div>
            
            <div className="space-y-4">
              {/* Detected Mood */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Detected Mood</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{formData.analysis.mood.emoji}</span>
                  <span className="text-gray-700">{formData.analysis.mood.label}</span>
                  <span className="text-sm text-gray-500">({formData.analysis.confidence}% confidence)</span>
                </div>
              </div>

              {/* Key Emotions */}
              {formData.analysis.emotions && formData.analysis.emotions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Emotions</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.analysis.emotions.map((emotion, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              {formData.analysis.summary && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {formData.analysis.summary}
                  </p>
                </div>
              )}

              {/* Suggestions */}
              {formData.analysis.suggestions && formData.analysis.suggestions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Suggestions</h4>
                  <ul className="space-y-1">
                    {formData.analysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-gray-700 text-sm flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Auto-generated Tags */}
              {formData.analysis.tags && formData.analysis.tags.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Suggested Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.analysis.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <div>
            {entry && (
              <Button
                variant="danger"
                onClick={handleDelete}
                leftIcon={<Trash2 size={16} />}
              >
                Delete
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
              isLoading={isSubmitting}
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSubmit(false)}
              isLoading={isSubmitting}
              leftIcon={<Save size={16} />}
            >
              {entry ? 'Update Entry' : 'Save Entry'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EntryEditor;