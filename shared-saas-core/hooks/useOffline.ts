'use client'

import { useState, useCallback, useEffect } from 'react';

// Web-compatible network info (using browser APIs instead of React Native NetInfo)
type NetInfoState = {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string;
};

const getNetInfo = (): Promise<NetInfoState> => {
  if (typeof window === 'undefined' || !navigator.onLine) {
    return Promise.resolve({
      isConnected: false,
      isInternetReachable: false,
      type: 'none',
    });
  }
  return Promise.resolve({
    isConnected: navigator.onLine,
    isInternetReachable: navigator.onLine,
    type: navigator.onLine ? 'wifi' : 'none',
  });
};

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window === 'undefined') return true;
    return navigator.onLine;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export function useNetworkType(): string {
  const [networkType, setNetworkType] = useState(() => {
    if (typeof window === 'undefined') return 'unknown';
    // Try to detect connection type using Network Information API if available
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      return connection.effectiveType || connection.type || 'unknown';
    }
    return navigator.onLine ? 'wifi' : 'none';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const updateConnection = () => {
        setNetworkType(connection.effectiveType || connection.type || 'unknown');
      };
      connection.addEventListener('change', updateConnection);
      return () => connection.removeEventListener('change', updateConnection);
    } else {
      // Fallback to online/offline events
      const handleOnline = () => setNetworkType('wifi');
      const handleOffline = () => setNetworkType('none');
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return networkType;
}

export function useSyncStatus() {
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const sync = useCallback(async () => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSync(new Date());
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return {
    lastSync,
    isSyncing,
    syncError,
    sync
  };
}

export function useOfflineData<T>(key: string, defaultValue: T) {
  const [data, setData] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  const saveData = useCallback(async (newData: T) => {
    try {
      setData(newData);
      await AsyncStorage.setItem(key, JSON.stringify(newData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save data');
    }
  }, [key]);

  const clearData = useCallback(async () => {
    try {
      setData(defaultValue);
      await AsyncStorage.removeItem(key);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear data');
    }
  }, [key, defaultValue]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    setData: saveData,
    updateData: (updater: (current: T) => T) => {
      saveData(updater(data));
    },
    clearData,
    isLoading,
    error,
    refresh: loadData
  };
}

// Web-compatible storage (using localStorage instead of AsyncStorage)
const AsyncStorage = {
  getItem: (key: string): Promise<string | null> => {
    if (typeof window === 'undefined') return Promise.resolve(null);
    try {
      return Promise.resolve(localStorage.getItem(key));
    } catch {
      return Promise.resolve(null);
    }
  },
  setItem: (key: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') return Promise.resolve();
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },
  removeItem: (key: string): Promise<void> => {
    if (typeof window === 'undefined') return Promise.resolve();
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },
};
