import React, { createContext, useContext, useState, useCallback } from 'react';

const StatusOverlayContext = createContext();

export function StatusOverlayProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  const showStatus = useCallback((msg, duration = 1200) => {
    setText(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), duration);
  }, []);

  const hideStatus = useCallback(() => setVisible(false), []);

  return (
    <StatusOverlayContext.Provider value={{ visible, text, showStatus, hideStatus }}>
      {children}
    </StatusOverlayContext.Provider>
  );
}

export function useStatusOverlay() {
  return useContext(StatusOverlayContext);
}