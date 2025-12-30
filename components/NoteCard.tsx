
import React from 'react';
import { 
  MoreVertical, 
  Archive, 
  Trash2, 
  Sparkles, 
  RotateCcw,
  Clock,
  Eye
} from 'lucide-react';
import { Note } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onArchive: (id: string) => void;
  onTrash: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  onView,
  onEdit, 
  onArchive, 
  onTrash, 
  onDelete, 
  onRestore 
}) => {
  const [showOptions, setShowOptions] = React.useState(false);

  return (
    <div 
      className="group bg-white rounded-[32px] border border-slate-100 p-6 hover:shadow-2xl hover:shadow-slate-200/40 hover:-translate-y-1 transition-all cursor-pointer relative flex flex-col h-full"
      onClick={() => onView(note)}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
          note.category === 'Work' ? 'bg-blue-50 text-blue-600' :
          note.category === 'Urgent' ? 'bg-rose-50 text-rose-600' :
          note.category === 'Ideas' ? 'bg-amber-50 text-amber-600' :
          note.category === 'Personal' ? 'bg-emerald-50 text-emerald-600' :
          'bg-slate-50 text-slate-500'
        }`}>
          {note.category}
        </span>
        
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-20 py-2 overflow-hidden animate-in zoom-in-95 duration-200">
              {!note.isTrashed ? (
                <>
                  <button 
                    onClick={() => { onEdit(note); setShowOptions(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    <Eye className="w-4 h-4" /> Edit Details
                  </button>
                  <button 
                    onClick={() => { onArchive(note.id); setShowOptions(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    <Archive className="w-4 h-4" /> {note.isArchived ? 'Move to active' : 'Archive note'}
                  </button>
                  <div className="h-px bg-slate-50 my-1"></div>
                  <button 
                    onClick={() => { onTrash(note.id); setShowOptions(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" /> Move to Trash
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => { onRestore(note.id); setShowOptions(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
                  >
                    <RotateCcw className="w-4 h-4" /> Restore Note
                  </button>
                  <button 
                    onClick={() => { onDelete(note.id); setShowOptions(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Forever
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <h3 className="text-xl font-black text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
        {note.title || 'Untitled Session'}
      </h3>
      
      <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">
        {note.content || 'Click to add content...'}
      </p>

      <div className="flex items-center justify-between pt-5 border-t border-slate-50 mt-auto">
        <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
          <Clock className="w-3.5 h-3.5" />
          {formatDistanceToNow(note.updatedAt)} ago
        </div>
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center border-2 border-white">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
