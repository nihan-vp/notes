
import React, { useEffect, useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { NoteCard } from './components/NoteCard';
import { TodoSection } from './components/TodoSection';
import { NoteModal } from './components/NoteModal';
import { NoteView } from './components/NoteView';
import { db } from './services/db';
import { Note, Todo, AppState } from './types';
import { Plus, LayoutGrid, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    notes: [],
    todos: [],
    activeView: 'notes',
    searchQuery: ''
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Partial<Note> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        const [notes, todos] = await Promise.all([
          db.notes.getAll(),
          db.todos.getAll()
        ]);
        setState(prev => ({ ...prev, notes, todos }));
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  const filteredNotes = useMemo(() => {
    let list = state.notes;
    if (state.activeView === 'notes') list = list.filter(n => !n.isArchived && !n.isTrashed);
    else if (state.activeView === 'archive') list = list.filter(n => n.isArchived && !n.isTrashed);
    else if (state.activeView === 'trash') list = list.filter(n => n.isTrashed);

    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(n => 
        n.title.toLowerCase().includes(q) || 
        n.content.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.updatedAt - a.updatedAt);
  }, [state.notes, state.activeView, state.searchQuery]);

  const filteredTodos = useMemo(() => {
    let list = state.todos;
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(t => t.text.toLowerCase().includes(q));
    }
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }, [state.todos, state.searchQuery]);

  const handleSaveNote = async (noteData: Partial<Note>) => {
    if (noteData.id) {
      const updated = await db.notes.update(noteData.id, noteData);
      setState(prev => ({
        ...prev,
        notes: prev.notes.map(n => n.id === updated.id ? updated : n)
      }));
      if (viewingNote?.id === updated.id) setViewingNote(updated);
    } else {
      const added = await db.notes.add({
        title: noteData.title || '',
        content: noteData.content || '',
        category: noteData.category || 'None',
        color: noteData.color || '#ffffff',
        isArchived: false,
        isTrashed: false
      });
      setState(prev => ({ ...prev, notes: [...prev.notes, added] }));
    }
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const handleNoteAction = async (id: string, action: 'archive' | 'trash' | 'delete' | 'restore') => {
    if (action === 'delete') {
      await db.notes.delete(id);
      setState(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== id) }));
      if (viewingNote?.id === id) setViewingNote(null);
      return;
    }

    const updates: Partial<Note> = {};
    if (action === 'archive') updates.isArchived = !state.notes.find(n => n.id === id)?.isArchived;
    if (action === 'trash') {
      updates.isTrashed = true;
      if (viewingNote?.id === id) setViewingNote(null);
    }
    if (action === 'restore') {
      updates.isTrashed = false;
      updates.isArchived = false;
    }

    const updated = await db.notes.update(id, updates);
    setState(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === id ? updated : n)
    }));
  };

  const handleAddTodo = async (text: string, priority: Todo['priority']) => {
    const added = await db.todos.add({ text, completed: false, priority });
    setState(prev => ({ ...prev, todos: [...prev.todos, added] }));
  };

  const handleToggleTodo = async (id: string) => {
    const todo = state.todos.find(t => t.id === id);
    if (!todo) return;
    const updated = await db.todos.update(id, { completed: !todo.completed });
    setState(prev => ({
      ...prev,
      todos: prev.todos.map(t => t.id === id ? updated : t)
    }));
  };

  const handleDeleteTodo = async (id: string) => {
    await db.todos.delete(id);
    setState(prev => ({ ...prev, todos: prev.todos.filter(t => t.id !== id) }));
  };

  const handleClearCompleted = async () => {
    const completedIds = state.todos.filter(t => t.completed).map(t => t.id);
    await Promise.all(completedIds.map(id => db.todos.delete(id)));
    setState(prev => ({ ...prev, todos: prev.todos.filter(t => !t.completed) }));
  };

  const handleExtractTodos = (todoTexts: string[]) => {
    todoTexts.forEach(text => handleAddTodo(text, 'Medium'));
  };

  return (
    <div className="flex min-h-screen bg-[#fcfdfe]">
      <Sidebar 
        activeView={state.activeView}
        onViewChange={(view) => { setState(prev => ({ ...prev, activeView: view })); setViewingNote(null); }}
        searchQuery={state.searchQuery}
        onSearchChange={(q) => setState(prev => ({ ...prev, searchQuery: q }))}
        stats={{
          notes: state.notes.filter(n => !n.isTrashed && !n.isArchived).length,
          todos: state.todos.filter(t => !t.completed).length
        }}
      />

      <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
        {!viewingNote ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 max-w-7xl mx-auto gap-4">
              <div>
                <h2 className="text-4xl font-black text-slate-900 capitalize tracking-tight">
                  {state.activeView === 'notes' ? 'Workspace' : 
                   state.activeView === 'todos' ? 'Task Hub' : 
                   state.activeView}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <p className="text-slate-500 font-semibold text-sm">
                    {state.activeView === 'notes' ? `${filteredNotes.length} active documents` : 
                     state.activeView === 'todos' ? `${state.todos.filter(t => !t.completed).length} items remaining` : 
                     'Management zone'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                {state.activeView === 'notes' && (
                  <button 
                    onClick={() => { setEditingNote(null); setIsModalOpen(true); }}
                    className="flex-grow md:flex-grow-0 flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95 group"
                  >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
                    New Note
                  </button>
                )}
              </div>
            </header>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-[50vh]">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto">
                {state.activeView === 'todos' ? (
                  <TodoSection 
                    todos={filteredTodos} 
                    onAdd={handleAddTodo} 
                    onToggle={handleToggleTodo} 
                    onDelete={handleDeleteTodo}
                    onClearCompleted={handleClearCompleted}
                  />
                ) : filteredNotes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredNotes.map(note => (
                      <NoteCard 
                        key={note.id} 
                        note={note} 
                        onView={() => setViewingNote(note)}
                        onEdit={(n) => { setEditingNote(n); setIsModalOpen(true); }}
                        onArchive={(id) => handleNoteAction(id, 'archive')}
                        onTrash={(id) => handleNoteAction(id, 'trash')}
                        onDelete={(id) => handleNoteAction(id, 'delete')}
                        onRestore={(id) => handleNoteAction(id, 'restore')}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                      <LayoutGrid className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Your collection is empty</h3>
                    <p className="text-slate-500 mt-2 max-w-sm px-6">
                      {state.searchQuery ? `No results for "${state.searchQuery}" in ${state.activeView}.` : "Start building your knowledge base today."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <NoteView 
            note={viewingNote} 
            onClose={() => setViewingNote(null)}
            onEdit={() => { setEditingNote(viewingNote); setIsModalOpen(true); }}
            onArchive={() => handleNoteAction(viewingNote.id, 'archive')}
            onTrash={() => handleNoteAction(viewingNote.id, 'trash')}
          />
        )}
      </main>

      {isModalOpen && (
        <NoteModal 
          note={editingNote}
          onClose={() => { setIsModalOpen(false); setEditingNote(null); }}
          onSave={handleSaveNote}
          onExtractTodos={handleExtractTodos}
        />
      )}
      
      <button 
        className="fixed bottom-10 right-10 w-16 h-16 bg-white rounded-[24px] shadow-2xl flex items-center justify-center text-indigo-600 border border-slate-100 hover:scale-105 transition-all group z-40"
        title="AI Assistant"
      >
        <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};

export default App;
