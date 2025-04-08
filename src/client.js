const axios = require('axios');

/**
 * W-API Client for WhatsApp
 * Provides simplified access to W-API endpoints
 */
class WapiClient {
  /**
   * Create a new W-API client
   * @param {Object} config Configuration options
   * @param {string} config.apiHost The API host (default: 'api.w-api.app')
   * @param {string} config.instanceId Your W-API instance ID
   * @param {string} config.apiToken Your W-API API token
   * @param {string} config.baseUrl Base URL for local API server (when using the included server)
   */
  constructor(config) {
    this.apiHost = config.apiHost || 'api.w-api.app';
    this.instanceId = config.instanceId;
    this.apiToken = config.apiToken;
    this.baseUrl = config.baseUrl || 'http://localhost:3000';
    this.directMode = config.directMode || false;
  }

  /**
   * Make a request to the API
   * @private
   */
  async _makeRequest(endpoint, method, data = {}) {
    try {
      if (this.directMode) {
        // Direct mode: send requests directly to W-API
        const response = await axios({
          method,
          url: `https://${this.apiHost}/v1${endpoint}?instanceId=${this.instanceId}`,
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          data
        });
        return response.data;
      } else {
        // Local mode: send requests to our local server
        const url = `${this.baseUrl}/v1${endpoint}`;
        const response = await axios({
          method,
          url,
          data: method === 'get' ? {} : data,
          params: method === 'get' ? data : {}
        });
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        console.error('Erro da API:', error.response.data);
        throw error.response.data;
      }
      console.error('Erro de conexão:', error.message);
      throw error;
    }
  }

  // ====================
  // INSTANCE METHODS
  // ====================

  /**
   * Get instance status
   */
  async status() {
    return this._makeRequest('/instance/device', 'get');
  }

  /**
   * Get QR code for connection
   */
  async qr() {
    return this._makeRequest('/instance/qr-code', 'get');
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

  // ====================
  // MESSAGE METHODS
  // ====================

  /**
   * Send a text message
   * @param {string} phone Recipient phone number
   * @param {string} message Text message to send
   * @param {Object} options Additional options
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
   * @param {string} phone Recipient phone number
   * @param {string} image Image URL or base64
   * @param {string} caption Optional image caption
   * @param {Object} options Additional options
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
   * @param {string} phone Recipient phone number
   * @param {string} document Document URL or base64
   * @param {string} filename Document filename
   * @param {string} caption Optional document caption
   * @param {Object} options Additional options
   */
  async sendDoc(phone, document, filename, caption = '', options = {}) {
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
   * @param {string} phone Recipient phone number
   * @param {string} audio Audio URL or base64
   * @param {Object} options Additional options
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
   * @param {string} phone Recipient phone number
   * @param {string} video Video URL or base64
   * @param {string} caption Optional video caption
   * @param {Object} options Additional options
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
   * @param {string} phone Recipient phone number
   * @param {number} latitude Latitude
   * @param {number} longitude Longitude
   * @param {string} name Optional location name
   * @param {string} address Optional location address
   * @param {Object} options Additional options
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
   * @param {string} phone Recipient phone number
   * @param {Object} contact Contact object
   * @param {Object} options Additional options
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
   * @param {string} phone Recipient phone number
   * @param {string} message Text message
   * @param {Array} buttons Array of button objects
   * @param {Object} options Additional options
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
   * @param {string} phone Recipient phone number
   * @param {string} message Text message
   * @param {Object} list List object
   * @param {Object} options Additional options
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
   * @param {string} messageId ID of message to reply to
   * @param {string} message Reply text
   * @param {Object} options Additional options
   */
  async reply(messageId, message, options = {}) {
    return this._makeRequest('/message/reply', 'post', {
      messageId,
      message,
      options
    });
  }

  // ====================
  // CONTACTS METHODS
  // ====================

  /**
   * Get contact info
   * @param {string} phone Phone number
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
   * @param {string} phone Phone number to check
   */
  async checkContact(phone) {
    return this._makeRequest('/contacts/check', 'get', { phone });
  }

  /**
   * Save a contact
   * @param {string} phone Phone number
   * @param {string} name Contact name
   */
  async saveContact(phone, name) {
    return this._makeRequest('/contacts/save', 'post', { phone, name });
  }

  /**
   * Get contact about/status
   * @param {string} phone Phone number
   */
  async getAbout(phone) {
    return this._makeRequest('/contacts/get-about', 'get', { phone });
  }

  // ====================
  // CHATS METHODS
  // ====================

  /**
   * Get chat info
   * @param {string} phone Phone number
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
   * @param {string} phone Phone number
   */
  async archiveChat(phone) {
    return this._makeRequest('/chats/archive', 'post', { phone });
  }

  /**
   * Unarchive a chat
   * @param {string} phone Phone number
   */
  async unarchiveChat(phone) {
    return this._makeRequest('/chats/unarchive', 'post', { phone });
  }

  /**
   * Clear chat history
   * @param {string} phone Phone number
   */
  async clearChat(phone) {
    return this._makeRequest('/chats/clear', 'post', { phone });
  }

  /**
   * Delete a chat
   * @param {string} phone Phone number
   */
  async deleteChat(phone) {
    return this._makeRequest('/chats/delete', 'post', { phone });
  }

  /**
   * Pin a chat
   * @param {string} phone Phone number
   */
  async pinChat(phone) {
    return this._makeRequest('/chats/pin', 'post', { phone });
  }

  /**
   * Unpin a chat
   * @param {string} phone Phone number
   */
  async unpinChat(phone) {
    return this._makeRequest('/chats/unpin', 'post', { phone });
  }

  // ====================
  // GROUPS METHODS
  // ====================

  /**
   * Create a group
   * @param {string} name Group name
   * @param {Array} participants Array of participant phone numbers
   */
  async createGroup(name, participants) {
    return this._makeRequest('/groups/create', 'post', { name, participants });
  }

  /**
   * Get group info
   * @param {string} groupId Group ID
   */
  async getGroup(groupId) {
    return this._makeRequest('/groups/get', 'get', { groupId });
  }

  /**
   * Update group participants
   * @param {string} groupId Group ID
   * @param {Array} participants Array of participant phone numbers
   * @param {string} action Action to perform ('add' or 'remove')
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
   * @param {string} groupId Group ID
   * @param {Object} settings Group settings object
   */
  async updateGroupSettings(groupId, settings) {
    return this._makeRequest('/groups/update-settings', 'post', {
      groupId,
      settings
    });
  }

  /**
   * Leave a group
   * @param {string} groupId Group ID
   */
  async leaveGroup(groupId) {
    return this._makeRequest('/groups/leave', 'post', { groupId });
  }

  /**
   * Get group invite code
   * @param {string} groupId Group ID
   */
  async getGroupInviteCode(groupId) {
    return this._makeRequest('/groups/invite-code', 'get', { groupId });
  }
}

module.exports = WapiClient; 
