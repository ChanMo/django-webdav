import React, { useEffect, useState } from 'react'
export const BatchContext = React.createContext({
  list: [],
  changeList: () => null,
})

export default function BatchProvider({ children }) {
  const [list, setList] = useState([])
  const changeList = (newList) => {
    setList(newList)
  }
  const contextValue = {
    list,
    changeList,
  };

  return (
    <BatchContext.Provider value={contextValue}>
      {children}
    </BatchContext.Provider>
  );
}
