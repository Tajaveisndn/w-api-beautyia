const axios = require('axios');

/**
 * W-API WhatsApp API Client
 * A wrapper for the W-API WhatsApp API
 */
class WApiClient {
  /**
   * Create a new W-API client
   * @param {string} apiKey - Your W-API API key
   * @param {string} instanceId - Your W-API instance ID
   * @param {string} baseUrl - The base URL for the API (default: https://api.w-api.app/v1)
   */
  constructor(apiKey, instanceId, baseUrl = 'https://api.w-api.app/v1') {
    if (!apiKey) throw new Error('API key is required');
    if (!instanceId) throw new Error('Instance ID is required');

    this.apiKey = apiKey;
    this.instanceId = instanceId;
    this.baseUrl = baseUrl;
    
    this.http = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
  }

  /**
   * Get instance information
   * @returns {Promise} - Instance information
   */
  async getInstance() {
    try {
      const response = await this.http.get(`/instances/${this.instanceId}`);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Initialize an instance
   * @returns {Promise} - Instance initialization result
   */
  async initInstance() {
    try {
      const response = await this.http.post(`/instances/${this.instanceId}/init`);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Get instance QR code
   * @returns {Promise} - QR code data
   */
  async getQrCode() {
    try {
      const response = await this.http.get(`/instances/${this.instanceId}/qrcode`);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Logout from the instance
   * @returns {Promise} - Logout result
   */
  async logout() {
    try {
      const response = await this.http.post(`/instances/${this.instanceId}/logout`);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Send a text message
   * @param {string} to - Phone number in format 5511999999999@c.us
   * @param {string} body - Message text
   * @returns {Promise} - Message send result
   */
  async sendTextMessage(to, body) {
    try {
      const data = { to, body };
      const response = await this.http.post(`/instances/${this.instanceId}/message/text`, data);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Send an image message
   * @param {string} to - Phone number in format 5511999999999@c.us
   * @param {string} caption - Image caption
   * @param {string} url - Image URL
   * @returns {Promise} - Message send result
   */
  async sendImageMessage(to, caption, url) {
    try {
      const data = { to, caption, url };
      const response = await this.http.post(`/instances/${this.instanceId}/message/image`, data);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Send a file message
   * @param {string} to - Phone number in format 5511999999999@c.us
   * @param {string} caption - File caption
   * @param {string} url - File URL
   * @returns {Promise} - Message send result
   */
  async sendFileMessage(to, caption, url) {
    try {
      const data = { to, caption, url };
      const response = await this.http.post(`/instances/${this.instanceId}/message/file`, data);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Send a button message
   * @param {string} to - Phone number in format 5511999999999@c.us
   * @param {string} title - Message title
   * @param {string} description - Message description
   * @param {Array} buttons - Array of button objects with id and text
   * @param {string} footer - Message footer
   * @returns {Promise} - Message send result
   */
  async sendButtonMessage(to, title, description, buttons, footer = '') {
    try {
      const data = { to, title, description, buttons, footer };
      const response = await this.http.post(`/instances/${this.instanceId}/message/button`, data);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Create a group
   * @param {string} name - Group name
   * @param {Array} participants - Array of phone numbers
   * @returns {Promise} - Group creation result
   */
  async createGroup(name, participants) {
    try {
      const data = { name, participants };
      const response = await this.http.post(`/instances/${this.instanceId}/groups/create`, data);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Add participants to a group
   * @param {string} groupId - Group ID
   * @param {Array} participants - Array of phone numbers
   * @returns {Promise} - Add participants result
   */
  async addGroupParticipants(groupId, participants) {
    try {
      const data = { participants };
      const response = await this.http.post(`/instances/${this.instanceId}/groups/${groupId}/participants/add`, data);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Remove participants from a group
   * @param {string} groupId - Group ID
   * @param {Array} participants - Array of phone numbers
   * @returns {Promise} - Remove participants result
   */
  async removeGroupParticipants(groupId, participants) {
    try {
      const data = { participants };
      const response = await this.http.post(`/instances/${this.instanceId}/groups/${groupId}/participants/remove`, data);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Get contacts
   * @returns {Promise} - List of contacts
   */
  async getContacts() {
    try {
      const response = await this.http.get(`/instances/${this.instanceId}/contacts`);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Get chats
   * @returns {Promise} - List of chats
   */
  async getChats() {
    try {
      const response = await this.http.get(`/instances/${this.instanceId}/chats`);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Error handler
   * @param {Error} error - Error object
   */
  _handleError(error) {
    if (error.response) {
      // Server responded with non-2xx status
      throw new Error(`W-API Error: ${error.response.status} - ${error.response.data?.message || JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // Request was made but no response
      throw new Error('W-API Error: No response received from server');
    } else {
      // Error in setting up the request
      throw new Error(`W-API Error: ${error.message}`);
    }
  }
}

module.exports = WApiClient; 