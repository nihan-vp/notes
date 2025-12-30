
import React from 'react';
import { 
  ArrowLeft, 
  Edit3, 
  Archive, 
  Trash2, 
  Share2, 
  Clock, 
  Type,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Note } from '../types';
import { format } from 'date-fns';

interface NoteViewProps {
  note: Note;
  onClose: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onTrash: () => void;
}

export const NoteView: React.FC<NoteViewProps> = ({ 
  note, 
  onClose, 
  onEdit, 
  onArchive, 
  onTrash 
}) => {
  const [isFullWidth, setIsFullWidth] = React.useState(false);
  
  // Simple reading time calculation
  const wordCount = note.content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-5xl mx-auto h-full flex flex-col">
      <nav className="flex items-center justify-between mb-12">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to list
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsFullWidth(!isFullWidth)}
            className="p-3 rounded-2xl hover:bg-slate-100 text-slate-400 transition-colors"
            title="Toggle Width"
          >
            {isFullWidth ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button 
            onClick={onArchive}
            className="p-3 rounded-2xl hover:bg-slate-100 text-slate-400 transition-colors"
            title="Archive"
          >
            <Archive className="w-5 h-5" />
          </button>
          <button 
            onClick={onTrash}
            className="p-3 rounded-2xl hover:bg-rose-50 text-rose-400 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-2"></div>
          <button 
            onClick={onEdit}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Edit3 className="w-4 h-4" /> Edit Note
          </button>
        </div>
      </nav>

      <div className={`flex-grow bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-all duration-500 ${isFullWidth ? 'max-w-none' : 'max-w-4xl mx-auto w-full'}`}>
        <div className="p-12 lg:p-20 overflow-y-auto">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${
              note.category === 'Work' ? 'bg-blue-50 text-blue-600' :
              note.category === 'Urgent' ? 'bg-rose-50 text-rose-600' :
              note.category === 'Ideas' ? 'bg-amber-50 text-amber-600' :
              note.category === 'Personal' ? 'bg-emerald-50 text-emerald-600' :
              'bg-slate-50 text-slate-500'
            }`}>
              {note.category}
            </span>
            <div className="flex items-center gap-4 text-slate-400 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {readingTime} min read
              </span>
              <span className="flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" />
                {wordCount} words
              </span>
            </div>
          </div>

          <h1 className="text-5xl font-black text-slate-900 mb-10 leading-tight">
            {note.title || 'Untitled Knowledge Item'}
          </h1>

          <div className="prose prose-slate prose-lg max-w-none">
            <p className="text-slate-600 text-xl leading-relaxed font-medium whitespace-pre-wrap">
              {note.content || 'This note has no content yet. Start writing by clicking the edit button.'}
            </p>
          </div>
        </div>

        <div className="mt-auto p-12 lg:px-20 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest">
            Last Updated {format(note.updatedAt, 'MMMM do, yyyy • HH:mm')}
          </div>
          <button className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:underline">
            <Share2 className="w-4 h-4" /> Share Document
          </button>
        </div>
      </div>
    </div>
  );
};
