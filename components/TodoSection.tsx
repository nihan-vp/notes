
import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Clock,
  LayoutGrid,
  CheckCircle,
  Eraser,
  Target
} from 'lucide-react';
import { Todo } from '../types';

interface TodoSectionProps {
  todos: Todo[];
  onAdd: (text: string, priority: Todo['priority']) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClearCompleted: () => void;
}

export const TodoSection: React.FC<TodoSectionProps> = ({ 
  todos, 
  onAdd, 
  onToggle, 
  onDelete,
  onClearCompleted
}) => {
  const [newTodo, setNewTodo] = React.useState('');
  const [priority, setPriority] = React.useState<Todo['priority']>('Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    onAdd(newTodo.trim(), priority);
    setNewTodo('');
  };

  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);
  
  const totalCount = todos.length;
  const completedCount = completedTodos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Progress Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-[32px] border border-slate-100 p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <Target className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</p>
            <h4 className="text-xl font-black text-slate-900">{progressPercent}% Done</h4>
          </div>
        </div>
        <div className="bg-white rounded-[32px] border border-slate-100 p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Finished</p>
            <h4 className="text-xl font-black text-slate-900">{completedCount} Tasks</h4>
          </div>
        </div>
        <div className="bg-white rounded-[32px] border border-slate-100 p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
            <h4 className="text-xl font-black text-slate-900">{activeTodos.length} Items</h4>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 p-8 lg:p-12 shadow-sm relative">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <CheckCircle className="text-indigo-600 w-7 h-7" /> Quick List
          </h2>
          {completedCount > 0 && (
            <button 
              onClick={onClearCompleted}
              className="flex items-center gap-2 text-rose-500 font-bold text-sm hover:bg-rose-50 px-4 py-2 rounded-xl transition-all"
            >
              <Eraser className="w-4 h-4" /> Clear Completed
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-12">
          <input 
            type="text"
            placeholder="Plan your next move..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-grow bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
          />
          <div className="flex gap-2">
            <select 
              value={priority}
              onChange={(e) => setPriority(e.target.value as Todo['priority'])}
              className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-black text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button 
              type="submit"
              className="bg-indigo-600 text-white p-5 rounded-2xl hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-100 active:scale-95"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </form>

        <div className="space-y-10">
          {activeTodos.length > 0 && (
            <div className="animate-in fade-in duration-500">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 ml-4">Current Focus</h3>
              <div className="space-y-3">
                {activeTodos.map(todo => (
                  <div 
                    key={todo.id} 
                    className="group flex items-center gap-5 bg-white border border-slate-50 p-6 rounded-[24px] hover:bg-slate-50/50 hover:border-indigo-100 hover:shadow-xl hover:shadow-slate-200/20 transition-all"
                  >
                    <button 
                      onClick={() => onToggle(todo.id)} 
                      className="text-slate-200 hover:text-indigo-600 transition-all transform hover:scale-110"
                    >
                      <Circle className="w-7 h-7" />
                    </button>
                    <div className="flex-grow">
                      <p className="text-slate-900 font-bold text-lg">{todo.text}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg ${
                          todo.priority === 'High' ? 'bg-rose-100 text-rose-600' :
                          todo.priority === 'Medium' ? 'bg-amber-100 text-amber-600' :
                          'bg-indigo-100 text-indigo-600'
                        }`}>
                          {todo.priority} Priority
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Just now
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDelete(todo.id)}
                      className="opacity-0 group-hover:opacity-100 p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {completedTodos.length > 0 && (
            <div className="animate-in fade-in duration-500">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 ml-4">Accomplishments</h3>
              <div className="space-y-2">
                {completedTodos.map(todo => (
                  <div 
                    key={todo.id} 
                    className="group flex items-center gap-5 bg-slate-50/20 border border-transparent p-5 rounded-[24px] opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                  >
                    <button onClick={() => onToggle(todo.id)} className="text-emerald-500">
                      <CheckCircle2 className="w-7 h-7" />
                    </button>
                    <p className="flex-grow line-through text-slate-400 font-bold italic text-lg">{todo.text}</p>
                    <button 
                      onClick={() => onDelete(todo.id)} 
                      className="opacity-0 group-hover:opacity-100 p-3 text-slate-300 hover:text-rose-500 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {todos.length === 0 && (
            <div className="text-center py-24 flex flex-col items-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-8 shadow-inner">
                <LayoutGrid className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Zero friction detected</h3>
              <p className="text-slate-400 text-sm mt-3 max-w-xs font-bold leading-relaxed">Everything is captured. Relax or add a new ambition to your list above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
