
export type NoteCategory = 'Personal' | 'Work' | 'Ideas' | 'Urgent' | 'None';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  color: string;
  updatedAt: number;
  createdAt: number;
  isArchived: boolean;
  isTrashed: boolean;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority: 'Low' | 'Medium' | 'High';
}

export interface AppState {
  notes: Note[];
  todos: Todo[];
  activeView: 'notes' | 'todos' | 'archive' | 'trash';
  searchQuery: string;
}

export enum AIAction {
  SUMMARIZE = 'SUMMARIZE',
  EXTRACT_TODOS = 'EXTRACT_TODOS',
  IMPROVE = 'IMPROVE',
  SUGGEST_TAGS = 'SUGGEST_TAGS'
}
