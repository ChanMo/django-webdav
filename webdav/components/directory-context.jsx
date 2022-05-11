import React, { useState } from 'react'

export const DirectoryContext = React.createContext({
  refreshCount: 0,
  current: '/',
  setDir: () => {},
  forceRefresh: () => {}
})

export default function DirectoryProvider({ children }) {
  const [current, setCurrent] = useState('/');
  const [refreshCount, setRefreshCount] = useState(0)
  const setDir = (newValue) => {
    setCurrent(newValue)
  }
  const forceRefresh = () => {
    setRefreshCount(refreshCount + 1)
  }
  const contextValue = {
    refreshCount,
    current,
    setDir,
    forceRefresh
  };

  return (
    <DirectoryContext.Provider value={contextValue}>
      {children}
    </DirectoryContext.Provider>
  );
}
