import { createContext, useContext } from 'react';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  return (
    <SessionContext.Provider value={null}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
