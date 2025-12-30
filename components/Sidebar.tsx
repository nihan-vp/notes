
import React from 'react';
import { 
  StickyNote, 
  CheckSquare, 
  Archive, 
  Trash2, 
  Settings,
  Sparkles,
  Search,
  LayoutDashboard
} from 'lucide-react';
import { AppState } from '../types';

interface SidebarProps {
  activeView: AppState['activeView'];
  onViewChange: (view: AppState['activeView']) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  stats: { notes: number; todos: number };
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onViewChange, 
  searchQuery, 
  onSearchChange,
  stats
}) => {
  const menuItems = [
    { id: 'notes', icon: StickyNote, label: 'Workspace', count: stats.notes },
    { id: 'todos', icon: CheckSquare, label: 'To-Do List', count: stats.todos },
    { id: 'archive', icon: Archive, label: 'Archived', count: null },
    { id: 'trash', icon: Trash2, label: 'Trash', count: null },
  ] as const;

  return (
    <aside className="w-72 flex-shrink-0 bg-white border-r border-slate-100 h-screen flex flex-col sticky top-0 hidden md:flex">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Lumina</h1>
        </div>

        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <nav className="space-y-2">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-4">Main Menu</div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeView === item.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-1' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </div>
              {item.count !== null && item.count > 0 && (
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                  activeView === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-4">
        <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <LayoutDashboard className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency</span>
          </div>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-slate-900">84%</h4>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-indigo-500 w-[84%] rounded-full"></div>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-5 py-3 text-slate-500 hover:text-slate-900 transition-colors text-sm font-bold">
          <Settings className="w-5 h-5" />
          User Settings
        </button>
      </div>
    </aside>
  );
};
