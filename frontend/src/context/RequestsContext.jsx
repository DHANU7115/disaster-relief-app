import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { idbService } from '../services/idbService';
import { apiService } from '../services/apiService';

const RequestsContext = createContext();

const requestsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_REQUESTS':
      return { ...state, requests: action.payload, loading: false };
    case 'ADD_REQUEST':
      return {
        ...state,
        requests: [action.payload, ...state.requests],
        queuedRequests: !action.payload.synced
          ? [action.payload, ...state.queuedRequests]
          : state.queuedRequests
      };
    case 'UPDATE_REQUEST':
      return {
        ...state,
        requests: state.requests.map(req =>
          req.id === action.payload.id || req.localId === action.payload.localId
            ? { ...req, ...action.payload.updates }
            : req
        ),
        queuedRequests: state.queuedRequests.map(req =>
          req.localId === action.payload.localId
            ? { ...req, ...action.payload.updates }
            : req
        )
      };
    case 'SET_SYNC_STATUS':
      return { ...state, syncing: action.payload };
    case 'SET_QUEUED_REQUESTS':
      return { ...state, queuedRequests: action.payload };
    default:
      return state;
  }
};

const initialState = {
  isOnline: navigator.onLine,
  loading: true,
  syncing: false,
  requests: [],
  queuedRequests: [], // Added queuedRequests
  error: null
};

export const RequestsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(requestsReducer, initialState);

  // Load all requests (backend when online, IDB when offline)
  const loadRequests = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      if (state.isOnline) {
        try {
          const backendRequests = await apiService.getRequests();
          dispatch({ type: 'SET_REQUESTS', payload: backendRequests });

          // Sync with IndexedDB
          await idbService.syncWithBackend(backendRequests);
        } catch (backendError) {
          console.warn('Backend unavailable, loading from IndexedDB:', backendError);
          const offlineRequests = await idbService.getRequests();
          dispatch({ type: 'SET_REQUESTS', payload: offlineRequests });
        }
      } else {
        const offlineRequests = await idbService.getRequests();
        dispatch({ type: 'SET_REQUESTS', payload: offlineRequests });
      }

      // Load queued (unsynced) requests separately
      const queued = await idbService.getUnsyncedRequests();
      dispatch({ type: 'SET_QUEUED_REQUESTS', payload: queued });
    } catch (error) {
      console.error('Error loading requests:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Add new request
  const addRequest = async (requestData) => {
    try {
      let savedRequest;

      if (state.isOnline) {
        try {
          savedRequest = await apiService.createRequest(requestData);
          await idbService.saveRequest(savedRequest);
        } catch (apiError) {
          console.warn('Backend failed, saving to IndexedDB:', apiError);
          savedRequest = await saveRequestOffline(requestData);
        }
      } else {
        savedRequest = await saveRequestOffline(requestData);
      }

      dispatch({ type: 'ADD_REQUEST', payload: savedRequest });
      return savedRequest;
    } catch (error) {
      console.error('Error adding request:', error);
      throw error;
    }
  };

  const saveRequestOffline = async (requestData) => {
    const localId = await idbService.saveRequest(requestData);
    return {
      ...requestData,
      localId,
      status: 'pending',
      synced: false,
      createdAt: new Date().toISOString()
    };
  };

  // Update request status
  const updateRequestStatus = async (requestId, updates) => {
    try {
      if (state.isOnline) {
        await apiService.updateRequest(requestId, updates);
      }

      await idbService.updateRequest(requestId, updates);
      dispatch({ type: 'UPDATE_REQUEST', payload: { id: requestId, updates } });
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  };

  // Sync offline requests
  const syncOfflineRequests = async () => {
    if (!state.isOnline || state.syncing) return;

    dispatch({ type: 'SET_SYNC_STATUS', payload: true });

    try {
      const unsyncedRequests = await idbService.getUnsyncedRequests();
      if (unsyncedRequests.length === 0) {
        dispatch({ type: 'SET_SYNC_STATUS', payload: false });
        return;
      }

      console.log(`Syncing ${unsyncedRequests.length} offline requests...`);

      const results = await apiService.createRequestsBulk(unsyncedRequests);

      for (const result of results.results || []) {
        if (result.status === 'created' && result.serverId) {
          await idbService.markAsSynced(result.localId, result.serverId);
          dispatch({
            type: 'UPDATE_REQUEST',
            payload: {
              localId: result.localId,
              updates: {
                id: result.serverId,
                serverId: result.serverId,
                synced: true,
                syncedAt: new Date().toISOString()
              }
            }
          });
        }
      }

      // Refresh queued requests after sync
      const queued = await idbService.getUnsyncedRequests();
      dispatch({ type: 'SET_QUEUED_REQUESTS', payload: queued });

      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      dispatch({ type: 'SET_SYNC_STATUS', payload: false });
    }
  };

  useEffect(() => {
    const handleOnline = async () => {
      dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
      console.log('Online - syncing data...');
      await syncOfflineRequests();
      await loadRequests();
    };

    const handleOffline = () => {
      dispatch({ type: 'SET_ONLINE_STATUS', payload: false });
      console.log('Offline - using local data');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load
    loadRequests();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const value = {
    ...state,
    addRequest,
    addQueuedRequest: addRequest,
    updateRequestStatus,
    loadRequests,
    syncOfflineRequests
  };

  return (
    <RequestsContext.Provider value={value}>
      {children}
    </RequestsContext.Provider>
  );
};

export const useRequests = () => {
  const context = useContext(RequestsContext);
  if (!context) {
    throw new Error('useRequests must be used within a RequestsProvider');
  }
  return context;
};
