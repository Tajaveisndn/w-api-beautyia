const axios = require('axios');
const EventEmitter = require('events');

/**
 * Advanced W-API Service Manager
 * Cloud-ready implementation without local server dependencies
 */
class WapiService extends EventEmitter {
  /**
   * Create a new W-API Service
   * @param {Object} options Configuration options
   * @param {string} options.apiHost API host (default: 'api.w-api.app')
   * @param {string} options.instanceId W-API instance ID
   * @param {string} options.apiToken W-API API token
   * @param {boolean} options.cacheEnabled Enable response caching (default: true)
   * @param {number} options.cacheTTL Cache time-to-live in seconds (default: 60)
   * @param {boolean} options.logEnabled Enable logging (default: false)
   * @param {number} options.rateLimit Max requests per minute (default: 60)
   */
  constructor(options = {}) {
    super();
    
    // Core configuration
    this.apiHost = options.apiHost || process.env.WAPI_HOST || 'api.w-api.app';
    this.instanceId = options.instanceId || process.env.WAPI_INSTANCE_ID;
    this.apiToken = options.apiToken || process.env.WAPI_API_TOKEN;
    
    if (!this.instanceId || !this.apiToken) {
      throw new Error('W-API configuration requires instanceId and apiToken');
    }
    
    // Advanced features
    this.cacheEnabled = options.cacheEnabled !== undefined ? options.cacheEnabled : true;
    this.cacheTTL = options.cacheTTL || 60; // seconds
    this.logEnabled = options.logEnabled || false;
    this.rateLimit = options.rateLimit || 60;
    
    // Internal state
    this.cache = new Map();
    this.requestCount = 0;
    this.requestTimestamps = [];
    this.connectionStatus = 'disconnected';
    this.connected = false;
    this.connectionError = null;
    
    // Health check interval
    this._startHealthCheck(options.healthCheckInterval || 60000);
    
    this.log('W-API Service initialized');
  }
  
  /**
   * Start periodic health checks
   * @private
   */
  _startHealthCheck(interval) {
    this._healthCheckInterval = setInterval(async () => {
      try {
        const status = await this.getStatus();
        const wasConnected = this.connected;
        this.connected = status.connected;
        this.connectionStatus = status.state || 'unknown';
        
        if (!wasConnected && this.connected) {
          this.emit('connected', status);
          this.log('Connection established to WhatsApp');
        } else if (wasConnected && !this.connected) {
          this.emit('disconnected', status);
          this.log('Disconnected from WhatsApp');
        }
        
        this.emit('health_check', status);
      } catch (error) {
        this.connectionError = error;
        this.emit('error', error);
        this.log('Health check failed', 'error');
      }
    }, interval);
  }
  
  /**
   * Stop the service and clean up resources
   */
  shutdown() {
    if (this._healthCheckInterval) {
      clearInterval(this._healthCheckInterval);
    }
    this.cache.clear();
    this.emit('shutdown');
    this.log('Service shutdown complete');
  }
  
  /**
   * Make a request to the W-API
   * @private
   */
  async _makeRequest(endpoint, method, data = {}, skipCache = false) {
    // Check rate limits
    this._checkRateLimit();
    
    // Generate cache key for GET requests if caching is enabled
    const cacheKey = this.cacheEnabled && method.toLowerCase() === 'get' 
      ? `${endpoint}-${JSON.stringify(data)}` 
      : null;
    
    // Check cache for GET requests
    if (cacheKey && !skipCache) {
      const cachedResponse = this._getFromCache(cacheKey);
      if (cachedResponse) {
        this.log(`Cache hit for ${endpoint}`);
        return cachedResponse;
      }
    }
    
    // Track request for rate limiting
    this._trackRequest();
    
    try {
      this.log(`Making ${method.toUpperCase()} request to ${endpoint}`);
      
      const response = await axios({
        method,
        url: `https://${this.apiHost}/v1${endpoint}`,
        params: {
          ...((method.toLowerCase() === 'get' ? data : {})),
          instanceId: this.instanceId
        },
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'W-API-Beauty-Client/2.0'
        },
        data: method.toLowerCase() !== 'get' ? data : undefined
      });
      
      // Cache successful GET responses
      if (cacheKey) {
        this._saveToCache(cacheKey, response.data);
      }
      
      return response.data;
    } catch (error) {
      const errorData = {
        endpoint,
        method,
        timestamp: new Date().toISOString(),
        error: error.response ? error.response.data : error.message
      };
      
      this.emit('request_error', errorData);
      this.log(`Request error: ${error.message}`, 'error');
      
      if (error.response) {
        throw {
          code: error.response.status,
          message: error.response.data.message || 'API error',
          details: error.response.data,
          timestamp: new Date().toISOString()
        };
      }
      
      throw {
        code: 500,
        message: error.message,
        isConnectionError: true,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  /**
   * Check rate limits before making a request
   * @private
   */
  _checkRateLimit() {
    const now = Date.now();
    
    // Remove timestamps older than 1 minute
    this.requestTimestamps = this.requestTimestamps.filter(time => now - time < 60000);
    
    if (this.requestTimestamps.length >= this.rateLimit) {
      const oldestAllowed = now - 60000;
      const resetTime = this.requestTimestamps[0] + 60000 - now;
      
      throw {
        code: 429,
        message: `Rate limit exceeded. Try again in ${Math.ceil(resetTime / 1000)} seconds.`,
        resetAfter: resetTime
      };
    }
  }
  
  /**
   * Track a request for rate limiting
   * @private
   */
  _trackRequest() {
    this.requestCount++;
    this.requestTimestamps.push(Date.now());
    
    // Keep only the most recent minute worth of timestamps
    if (this.requestTimestamps.length > this.rateLimit) {
      this.requestTimestamps.shift();
    }
  }
  
  /**
   * Save response to cache
   * @private
   */
  _saveToCache(key, data) {
    if (!this.cacheEnabled) return;
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expires: Date.now() + (this.cacheTTL * 1000)
    });
    
    this.log(`Cached response for key: ${key.split('-')[0]}`);
  }
  
  /**
   * Get response from cache
   * @private
   */
  _getFromCache(key) {
    if (!this.cacheEnabled) return null;
    
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    // Check if cache is still valid
    if (Date.now() > cached.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  /**
   * Log messages if logging is enabled
   * @private
   */
  log(message, level = 'info') {
    if (!this.logEnabled) return;
    
    const timestamp = new Date().toISOString();
    
    switch (level) {
      case 'error':
        console.error(`[${timestamp}] [ERROR] ${message}`);
        break;
      case 'warn':
        console.warn(`[${timestamp}] [WARN] ${message}`);
        break;
      case 'debug':
        console.debug(`[${timestamp}] [DEBUG] ${message}`);
        break;
      case 'info':
      default:
        console.log(`[${timestamp}] [INFO] ${message}`);
    }
    
    this.emit('log', { timestamp, level, message });
  }
  
  /**
   * Clear the response cache
   */
  clearCache() {
    this.cache.clear();
    this.log('Cache cleared');
  }
  
  /**
   * Get current service stats
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      requestCount: this.requestCount,
      currentRatePerMinute: this.requestTimestamps.length,
      rateLimit: this.rateLimit,
      connected: this.connected,
      connectionStatus: this.connectionStatus,
      uptime: process.uptime()
    };
  }
  
  // ====================
  // API ENDPOINTS 
  // ====================
  
  // === INSTANCE METHODS ===
  
  /**
   * Get the current status of the WhatsApp instance
   */
  async getStatus() {
    return this._makeRequest('/instance/device', 'get');
  }
  
  /**
   * Get QR code for connection
   */
  async getQR() {
    return this._makeRequest('/instance/qr-code', 'get', {}, true); // Skip cache for QR
  }
  
  /**
   * Connect the instance
   */
  async connect() {
    return this._makeRequest('/instance/connect', 'post');
  }
  
  /**
   * Disconnect the instance
   */
  async disconnect() {
    return this._makeRequest('/instance/disconnect', 'post');
  }
  
  /**
   * Restart the instance
   */
  async restart() {
    return this._makeRequest('/instance/restart', 'post');
  }
  
  /**
   * Logout from WhatsApp
   */
  async logout() {
    return this._makeRequest('/instance/logout', 'post');
  }
  
  // === MESSAGE METHODS ===
  
  /**
   * Send a text message
   */
  async sendText(phone, message, options = {}) {
    return this._makeRequest('/message/send-text', 'post', {
      phone,
      message,
      options
    });
  }
  
  /**
   * Send an image message
   */
  async sendImage(phone, image, caption = '', options = {}) {
    return this._makeRequest('/message/send-image', 'post', {
      phone,
      image,
      caption,
      options
    });
  }
  
  /**
   * Send a document
   */
  async sendDocument(phone, document, filename, caption = '', options = {}) {
    return this._makeRequest('/message/send-document', 'post', {
      phone,
      document,
      filename,
      caption,
      options
    });
  }
  
  /**
   * Send an audio message
   */
  async sendAudio(phone, audio, options = {}) {
    return this._makeRequest('/message/send-audio', 'post', {
      phone,
      audio,
      options
    });
  }
  
  /**
   * Send a video message
   */
  async sendVideo(phone, video, caption = '', options = {}) {
    return this._makeRequest('/message/send-video', 'post', {
      phone,
      video,
      caption,
      options
    });
  }
  
  /**
   * Send a location
   */
  async sendLocation(phone, latitude, longitude, name = '', address = '', options = {}) {
    return this._makeRequest('/message/send-location', 'post', {
      phone,
      latitude,
      longitude,
      name,
      address,
      options
    });
  }
  
  /**
   * Send a contact card
   */
  async sendContact(phone, contact, options = {}) {
    return this._makeRequest('/message/send-contact', 'post', {
      phone,
      contact,
      options
    });
  }
  
  /**
   * Send a button message
   */
  async sendButtons(phone, message, buttons, options = {}) {
    return this._makeRequest('/message/send-button', 'post', {
      phone,
      message,
      buttons,
      options
    });
  }
  
  /**
   * Send a list message
   */
  async sendList(phone, message, list, options = {}) {
    return this._makeRequest('/message/send-list', 'post', {
      phone,
      message,
      list,
      options
    });
  }
  
  /**
   * Reply to a message
   */
  async reply(messageId, message, options = {}) {
    return this._makeRequest('/message/reply', 'post', {
      messageId,
      message,
      options
    });
  }
  
  // === CONTACTS METHODS ===
  
  /**
   * Get contact info
   */
  async getContact(phone) {
    return this._makeRequest('/contacts/get', 'get', { phone });
  }
  
  /**
   * Get all contacts
   */
  async getContacts() {
    return this._makeRequest('/contacts/get-all', 'get');
  }
  
  /**
   * Check if phone is a valid WhatsApp user
   */
  async checkContact(phone) {
    return this._makeRequest('/contacts/check', 'get', { phone });
  }
  
  /**
   * Save a contact
   */
  async saveContact(phone, name) {
    return this._makeRequest('/contacts/save', 'post', { phone, name });
  }
  
  /**
   * Get contact about/status
   */
  async getAbout(phone) {
    return this._makeRequest('/contacts/get-about', 'get', { phone });
  }
  
  // === CHATS METHODS ===
  
  /**
   * Get chat info
   */
  async getChat(phone) {
    return this._makeRequest('/chats/get', 'get', { phone });
  }
  
  /**
   * Get all chats
   */
  async getChats() {
    return this._makeRequest('/chats/get-all', 'get');
  }
  
  /**
   * Archive a chat
   */
  async archiveChat(phone) {
    return this._makeRequest('/chats/archive', 'post', { phone });
  }
  
  /**
   * Unarchive a chat
   */
  async unarchiveChat(phone) {
    return this._makeRequest('/chats/unarchive', 'post', { phone });
  }
  
  /**
   * Clear chat history
   */
  async clearChat(phone) {
    return this._makeRequest('/chats/clear', 'post', { phone });
  }
  
  /**
   * Delete a chat
   */
  async deleteChat(phone) {
    return this._makeRequest('/chats/delete', 'post', { phone });
  }
  
  /**
   * Pin a chat
   */
  async pinChat(phone) {
    return this._makeRequest('/chats/pin', 'post', { phone });
  }
  
  /**
   * Unpin a chat
   */
  async unpinChat(phone) {
    return this._makeRequest('/chats/unpin', 'post', { phone });
  }
  
  // === GROUPS METHODS ===
  
  /**
   * Create a group
   */
  async createGroup(name, participants) {
    return this._makeRequest('/groups/create', 'post', { name, participants });
  }
  
  /**
   * Get group info
   */
  async getGroup(groupId) {
    return this._makeRequest('/groups/get', 'get', { groupId });
  }
  
  /**
   * Update group participants
   */
  async updateGroupParticipants(groupId, participants, action) {
    return this._makeRequest('/groups/update-participants', 'post', {
      groupId,
      participants,
      action
    });
  }
  
  /**
   * Update group settings
   */
  async updateGroupSettings(groupId, settings) {
    return this._makeRequest('/groups/update-settings', 'post', {
      groupId,
      settings
    });
  }
  
  /**
   * Leave a group
   */
  async leaveGroup(groupId) {
    return this._makeRequest('/groups/leave', 'post', { groupId });
  }
  
  /**
   * Get group invite code
   */
  async getGroupInviteCode(groupId) {
    return this._makeRequest('/groups/invite-code', 'get', { groupId });
  }
}

/**
 * Create a new W-API Service instance
 * @param {Object} options Configuration options
 * @returns {WapiService} A new WapiService instance
 */
function createService(options = {}) {
  return new WapiService(options);
}

/**
 * Legacy compatibility for starting a service (no local server needed)
 * @param {Object} options Configuration options
 * @returns {Promise<WapiService>} A promise that resolves to a new WapiService instance
 */
function start(options = {}) {
  return new Promise((resolve, reject) => {
    try {
      const service = createService(options);
      
      // Check connection status before resolving
      service.getStatus()
        .then(status => {
          console.log('W-API Service initialized successfully');
          console.log(`Status: ${status.state || 'unknown'}`);
          resolve(service);
        })
        .catch(error => {
          console.warn('W-API Service initialized with connection warning:', error.message);
          // Still resolve the service even if there's an initial connection issue
          resolve(service);
        });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Legacy compatibility for stopping a service
 * @param {WapiService} service The service to stop
 * @returns {Promise<void>}
 */
function stop(service) {
  return new Promise((resolve) => {
    if (service && typeof service.shutdown === 'function') {
      service.shutdown();
    }
    resolve();
  });
}

module.exports = {
  WapiService,
  createService,
  start,
  stop
}; 
