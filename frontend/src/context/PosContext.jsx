// context/PosContext.jsx
import { createContext, useContext, useState } from 'react';

const PosContext = createContext();

export function PosProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  return (
    <PosContext.Provider value={{ cart, setCart, user, setUser }}>
      {children}
    </PosContext.Provider>
  );
}

export const usePOS = () => useContext(PosContext);
