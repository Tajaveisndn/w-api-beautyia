const WapiClient = require('./client');
const server = require('./server');

/**
 * Create a new W-API client
 * @param {Object} config Configuration options
 * @param {string} config.apiHost The API host (default: 'api.w-api.app')
 * @param {string} config.instanceId Your W-API instance ID
 * @param {string} config.apiToken Your W-API API token
 * @param {string} config.baseUrl Base URL for local API server (when using the included server)
 * @param {boolean} config.directMode Whether to send requests directly to W-API or through local server
 * @returns {WapiClient} A new WapiClient instance
 */
function createClient(config) {
  return new WapiClient(config);
}

/**
 * Start the API server
 * @param {Object} options Server options
 * @param {number} options.port Port to run server on (default: 3000)
 * @param {string} options.apiHost API host (default: 'api.w-api.app')
 * @param {string} options.instanceId W-API instance ID
 * @param {string} options.apiToken W-API API token
 * @returns {Promise<Express>} The Express server instance
 */
function startServer(options = {}) {
  return server.start(options);
}

/**
 * Stop the API server
 * @returns {Promise<void>}
 */
function stopServer() {
  return server.stop();
}

// Short aliases for common WhatsApp operations
const wa = {
  // Instance methods
  status: (client) => client.status(),
  qr: (client) => client.qr(),
  connect: (client) => client.connect(),
  disconnect: (client) => client.disconnect(),
  restart: (client) => client.restart(),
  
  // Message methods
  text: (client, phone, message, options) => client.sendText(phone, message, options),
  image: (client, phone, image, caption, options) => client.sendImage(phone, image, caption, options),
  doc: (client, phone, document, filename, caption, options) => client.sendDoc(phone, document, filename, caption, options),
  audio: (client, phone, audio, options) => client.sendAudio(phone, audio, options),
  video: (client, phone, video, caption, options) => client.sendVideo(phone, video, caption, options),
  location: (client, phone, lat, lng, name, address, options) => client.sendLocation(phone, lat, lng, name, address, options),
  contact: (client, phone, contact, options) => client.sendContact(phone, contact, options),
  buttons: (client, phone, message, buttons, options) => client.sendButtons(phone, message, buttons, options),
  list: (client, phone, message, list, options) => client.sendList(phone, message, list, options),
  reply: (client, messageId, message, options) => client.reply(messageId, message, options),
  
  // Contacts methods
  getContact: (client, phone) => client.getContact(phone),
  getContacts: (client) => client.getContacts(),
  checkContact: (client, phone) => client.checkContact(phone),
  saveContact: (client, phone, name) => client.saveContact(phone, name),
  
  // Chats methods
  getChat: (client, phone) => client.getChat(phone),
  getChats: (client) => client.getChats(),
  archiveChat: (client, phone) => client.archiveChat(phone),
  unarchiveChat: (client, phone) => client.unarchiveChat(phone),
  clearChat: (client, phone) => client.clearChat(phone),
  deleteChat: (client, phone) => client.deleteChat(phone),
  
  // Groups methods
  createGroup: (client, name, participants) => client.createGroup(name, participants),
  getGroup: (client, groupId) => client.getGroup(groupId),
  updateGroupParticipants: (client, groupId, participants, action) => 
    client.updateGroupParticipants(groupId, participants, action),
  leaveGroup: (client, groupId) => client.leaveGroup(groupId)
};

module.exports = {
  createClient,
  startServer,
  stopServer,
  WapiClient,
  wa
}; 