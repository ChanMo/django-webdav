import React, { useState } from 'react'

export const DirectoryContext = React.createContext({
  refreshCount: 0,
  current: '/',
  setDir: () => {},
  forceRefresh: () => {}
})

export default function DirectoryProvider({ initial='/', children }) {
  const [current, setCurrent] = useState(initial);
  const [refreshCount, setRefreshCount] = useState(0)
  const setDir = (newValue) => {
    setCurrent(newValue)
    //window.location.search = '?dir=' + newValue
    //FIXME 返回键无效果
    window.history.pushState({}, '', window.location.pathname + '?dir=' + newValue)
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
