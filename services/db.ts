
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { firestore } from "./firebase";
import { Note, Todo } from '../types';

const COLLECTIONS = {
  NOTES: 'notes',
  TODOS: 'todos'
};

export const db = {
  notes: {
    async getAll(): Promise<Note[]> {
      try {
        const q = query(collection(firestore, COLLECTIONS.NOTES), orderBy("updatedAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toMillis?.() || Date.now(),
            updatedAt: data.updatedAt?.toMillis?.() || Date.now(),
          } as Note;
        });
      } catch (e) {
        console.error("Error fetching notes:", e);
        return [];
      }
    },

    async add(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
      const docRef = await addDoc(collection(firestore, COLLECTIONS.NOTES), {
        ...note,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isArchived: note.isArchived || false,
        isTrashed: note.isTrashed || false
      });
      
      return {
        ...note,
        id: docRef.id,
        createdAt: Date.now(),
        updatedAt: Date.now()
      } as Note;
    },

    async update(id: string, updates: Partial<Note>): Promise<Note> {
      const noteDoc = doc(firestore, COLLECTIONS.NOTES, id);
      const firestoreUpdates = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(noteDoc, firestoreUpdates);
      
      return {
        id,
        ...updates,
        updatedAt: Date.now()
      } as Note;
    },

    async delete(id: string): Promise<void> {
      const noteDoc = doc(firestore, COLLECTIONS.NOTES, id);
      await deleteDoc(noteDoc);
    }
  },

  todos: {
    async getAll(): Promise<Todo[]> {
      try {
        const q = query(collection(firestore, COLLECTIONS.TODOS), orderBy("createdAt", "asc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toMillis?.() || Date.now(),
          } as Todo;
        });
      } catch (e) {
        console.error("Error fetching todos:", e);
        return [];
      }
    },

    async add(todo: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo> {
      const docRef = await addDoc(collection(firestore, COLLECTIONS.TODOS), {
        ...todo,
        createdAt: serverTimestamp(),
      });
      
      return {
        ...todo,
        id: docRef.id,
        createdAt: Date.now(),
      } as Todo;
    },

    async update(id: string, updates: Partial<Todo>): Promise<Todo> {
      const todoDoc = doc(firestore, COLLECTIONS.TODOS, id);
      await updateDoc(todoDoc, updates);
      
      return {
        id,
        ...updates,
      } as Todo;
    },

    async delete(id: string): Promise<void> {
      const todoDoc = doc(firestore, COLLECTIONS.TODOS, id);
      await deleteDoc(todoDoc);
    }
  }
};
