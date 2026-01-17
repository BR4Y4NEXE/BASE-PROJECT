import { useContext } from 'react';
import { StorageContext } from '../context/StorageContext';
import type { AppContextType } from '../types';

export const useData = (): AppContextType => {
    const context = useContext(StorageContext);
    if (context === undefined) {
        throw new Error('useData must be used within a StorageProvider');
    }
    return context;
};
