import { useContext } from 'react';
import { PosContext } from '../context/PosContext';

export const usePos = () => {
  const context = useContext(PosContext);
  if (!context) {
    throw new Error('usePos must be used within a PosProvider');
  }
  return context;
};
