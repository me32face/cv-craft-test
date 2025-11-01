import React, { createContext, useContext, useState, useCallback } from 'react';

const UndoRedoContext = createContext();

export const useUndoRedo = () => {
  const context = useContext(UndoRedoContext);
  if (!context) {
    throw new Error('useUndoRedo must be used within UndoRedoProvider');
  }
  return context;
};

export const UndoRedoProvider = ({ children }) => {
  const [state, setState] = useState({
    history: [],
    currentIndex: -1
  });

  const saveState = useCallback((newState) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.currentIndex + 1);
      newHistory.push(newState);
      return {
        history: newHistory.slice(-50), // Keep only last 50 states
        currentIndex: Math.min(prev.currentIndex + 1, 49)
      };
    });
  }, []);

  const undo = useCallback(() => {
    let restoredState = null;
    setState(prev => {
      const newIndex = prev.currentIndex > 0 ? prev.currentIndex - 1 : prev.currentIndex;
      restoredState = prev.history[newIndex];
      return {
        ...prev,
        currentIndex: newIndex
      };
    });
    return restoredState;
  }, []);

  const redo = useCallback(() => {
    let restoredState = null;
    setState(prev => {
      const newIndex = prev.currentIndex < prev.history.length - 1 ? prev.currentIndex + 1 : prev.currentIndex;
      restoredState = prev.history[newIndex];
      return {
        ...prev,
        currentIndex: newIndex
      };
    });
    return restoredState;
  }, []);

  const canUndo = state.currentIndex > 0;
  const canRedo = state.currentIndex < state.history.length - 1;

  return (
    <UndoRedoContext.Provider value={{
      saveState,
      undo,
      redo,
      canUndo,
      canRedo,
      currentState: state.history[state.currentIndex] || null
    }}>
      {children}
    </UndoRedoContext.Provider>
  );
};