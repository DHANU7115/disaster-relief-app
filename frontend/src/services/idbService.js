import Dexie from 'dexie';

class ReliefDB extends Dexie {
  constructor() {
    super('ReliefDB');
    
    this.version(2).stores({ // Changed to version 2 for schema updates
      requests: '++id, localId, serverId, createdAt, updatedAt, status, synced',
      syncQueue: '++id, localId, action, data, attempts, lastAttempt'
    });
  }
}

export const db = new ReliefDB();

export const idbService = {
  // Save request to IndexedDB (for both online and offline)
  async saveRequest(requestData) {
    const request = {
      ...requestData,
      localId: requestData.localId || crypto.randomUUID(),
      createdAt: requestData.createdAt || new Date(),
      updatedAt: new Date(),
      status: requestData.status || 'pending',
      synced: false,
      attempts: 0
    };
    
    await db.requests.put(request);
    return request.localId;
  },

  // Get all requests (for display)
  async getRequests() {
    return await db.requests.orderBy('createdAt').reverse().toArray();
  },

  // Get only unsynced requests (for offline sync)
  async getUnsyncedRequests() {
    return await db.requests.where('synced').equals(false).toArray();
  },

  // Get requests that are still queued for sync
  async getQueuedRequests() {
    return await db.requests.where('synced').equals(false).toArray();
  },

  // Update a request (both local and potentially server)
  async updateRequest(localIdOrServerId, updates) {
    const request = await db.requests.where('localId').equals(localIdOrServerId).or('serverId').equals(localIdOrServerId).first();
    if (request) {
      await db.requests.update(request.id, {
        ...updates,
        updatedAt: new Date()
      });
    }
  },

  // Mark request as synced with server
  async markAsSynced(localId, serverId) {
    await db.requests.where('localId').equals(localId).modify({
      serverId: serverId,
      synced: true,
      syncedAt: new Date(),
      updatedAt: new Date()
    });
  },

  // Remove queued request
  async removeQueuedRequest(localId) {
    await db.requests.where('localId').equals(localId).delete();
  },

  // Sync unsynced requests with backend
  async syncWithBackend(backendRequests = []) {
    try {
      // First, update local database with server data
      for (const serverRequest of backendRequests) {
        // Check if we have a local version of this request
        const existing = await db.requests.where('serverId').equals(serverRequest.id).first();
        
        if (existing) {
          // Update local record with server data
          await db.requests.update(existing.id, {
            ...serverRequest,
            synced: true,
            updatedAt: new Date()
          });
        } else {
          // Add server request to local DB
          await db.requests.add({
            ...serverRequest,
            serverId: serverRequest.id,
            synced: true,
            localId: crypto.randomUUID(),
            createdAt: serverRequest.createdAt || new Date(),
            updatedAt: new Date()
          });
        }
      }

      // Then, push unsynced local requests to server
      const unsyncedRequests = await this.getUnsyncedRequests();
      return unsyncedRequests;
      
    } catch (error) {
      console.error('Sync with backend failed:', error);
      throw error;
    }
  },

  // Schedule sync for when online
  async scheduleSync() {
    const unsyncedRequests = await this.getUnsyncedRequests();
    if (unsyncedRequests.length > 0) {
      // Store in localStorage to trigger sync when online
      localStorage.setItem('pendingSync', 'true');
      console.log(`Scheduled sync for ${unsyncedRequests.length} requests`);
    }
  },

  // Check if there are pending sync operations
  async hasPendingSync() {
    const unsyncedCount = await db.requests.where('synced').equals(false).count();
    return unsyncedCount > 0;
  },

  // Get request by ID (works for both localId and serverId)
  async getRequestById(id) {
    return await db.requests.where('localId').equals(id).or('serverId').equals(id).first();
  },

  // Bulk insert requests (for initial load or offline data)
  async bulkInsertRequests(requests) {
    const requestsWithIds = requests.map(request => ({
      ...request,
      localId: request.localId || crypto.randomUUID(),
      createdAt: request.createdAt || new Date(),
      updatedAt: new Date(),
      synced: request.synced || false
    }));
    
    await db.requests.bulkPut(requestsWithIds);
  }
};