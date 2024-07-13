import { ReactNode, createContext, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any 
const DataContext = createContext<any>({});

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [isRunning, setIsRunning] = useState(false); // 游戏是否进行中

  const context = {
    isRunning,
    setIsRunning,
  };

  return (
    <DataContext.Provider value={context}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;