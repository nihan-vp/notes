
import React from 'react';
import { 
  X, 
  Sparkles, 
  Save, 
  Trash2, 
  CheckCircle, 
  Wand2, 
  ListTodo,
  FileText,
  Loader2
} from 'lucide-react';
import { Note, NoteCategory, AIAction } from '../types';
import { processWithAI } from '../services/gemini';

interface NoteModalProps {
  note: Partial<Note> | null;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
  onExtractTodos: (todos: string[]) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({ note, onClose, onSave, onExtractTodos }) => {
  const [formData, setFormData] = React.useState<Partial<Note>>({
    title: '',
    content: '',
    category: 'None',
    color: '#ffffff',
    ...note
  });
  
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [aiMessage, setAiMessage] = React.useState('');

  const handleAI = async (action: AIAction) => {
    if (!formData.content) return;
    setIsProcessing(true);
    setAiMessage(action === AIAction.SUMMARIZE ? 'Summarizing...' : 
                 action === AIAction.IMPROVE ? 'Polishing...' : 
                 action === AIAction.EXTRACT_TODOS ? 'Extracting tasks...' : 'Working...');
    
    try {
      const result = await processWithAI(action, formData.content);
      
      if (action === AIAction.EXTRACT_TODOS && Array.isArray(result)) {
        onExtractTodos(result);
        setAiMessage('Tasks extracted successfully!');
        setTimeout(() => setAiMessage(''), 2000);
      } else if (typeof result === 'string') {
        if (action === AIAction.SUMMARIZE) {
          setFormData(prev => ({ ...prev, title: `Summary: ${prev.title}`, content: result }));
        } else if (action === AIAction.IMPROVE) {
          setFormData(prev => ({ ...prev, content: result }));
        }
        setAiMessage('Completed!');
        setTimeout(() => setAiMessage(''), 2000);
      }
    } catch (err) {
      setAiMessage('Error using AI.');
    } finally {
      setIsProcessing(false);
    }
  };

  const categories: NoteCategory[] = ['Personal', 'Work', 'Ideas', 'Urgent', 'None'];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {note?.id ? 'Edit Note' : 'Create New Note'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6 flex-grow">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title</label>
            <input 
              type="text"
              placeholder="Enter a descriptive title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-2xl font-bold border-none focus:ring-0 placeholder:text-slate-300 p-0 mb-2"
            />
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    formData.category === cat 
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/10' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Content</label>
            <textarea 
              placeholder="Start typing your thoughts..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full min-h-[250px] text-lg text-slate-700 leading-relaxed border-none focus:ring-0 p-0 resize-none placeholder:text-slate-300"
            />
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-indigo-700">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Copilot</span>
              </div>
              {isProcessing && (
                <div className="flex items-center gap-2 text-indigo-600">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="text-[10px] font-bold uppercase">{aiMessage}</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button 
                onClick={() => handleAI(AIAction.IMPROVE)}
                disabled={isProcessing || !formData.content}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-50 transition-all shadow-sm"
              >
                <Wand2 className="w-3.5 h-3.5 text-indigo-500" /> Professional Polish
              </button>
              <button 
                onClick={() => handleAI(AIAction.SUMMARIZE)}
                disabled={isProcessing || !formData.content}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-50 transition-all shadow-sm"
              >
                <FileText className="w-3.5 h-3.5 text-blue-500" /> Smart Summary
              </button>
              <button 
                onClick={() => handleAI(AIAction.EXTRACT_TODOS)}
                disabled={isProcessing || !formData.content}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-50 transition-all shadow-sm"
              >
                <ListTodo className="w-3.5 h-3.5 text-emerald-500" /> Extract To-Dos
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" /> Save Note
          </button>
        </div>
      </div>
    </div>
  );
};
