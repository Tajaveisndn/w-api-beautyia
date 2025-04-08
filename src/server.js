const express = require('express');
const axios = require('axios');

let server = null;

/**
 * Start the API server
 * @param {Object} options Server options
 * @param {number} options.port Port to run server on (default: 3000)
 * @param {string} options.apiHost API host (default: 'api.w-api.app')
 * @param {string} options.instanceId W-API instance ID
 * @param {string} options.apiToken W-API API token
 * @returns {Promise<Express>} The Express server instance
 */
function start(options = {}) {
  return new Promise((resolve, reject) => {
    try {
      const app = express();
      const port = options.port || 3000;
      const apiHost = options.apiHost || 'api.w-api.app';
      const instanceId = options.instanceId;
      const apiToken = options.apiToken;

      if (!instanceId || !apiToken) {
        throw new Error('instanceId and apiToken are required to start the server');
      }

      // Setup Express middleware
      app.use(express.json({ limit: '50mb' }));
      app.use(express.urlencoded({ extended: true, limit: '50mb' }));

      // Add CORS support
      app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        if (req.method === 'OPTIONS') {
          return res.status(200).end();
        }
        next();
      });

      // Helper function for making API requests
      const makeApiRequest = async (endpoint, method, data = {}) => {
        try {
          const response = await axios({
            method,
            url: `https://${apiHost}${endpoint}?instanceId=${instanceId}`,
            headers: {
              'Authorization': `Bearer ${apiToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            data
          });
          return response.data;
        } catch (error) {
          throw error.response ? error.response.data : error.message;
        }
      };

      // API documentation endpoint
      app.get('/', (req, res) => {
        res.json({
          api: 'W-API WhatsApp Gateway',
          version: '1.0.0',
          endpoints: {
            instance: ['/instance/connect', '/instance/disconnect', '/instance/restart', '/instance/status', '/instance/qr-code'],
            message: ['/message/send-text', '/message/send-image', '/message/send-document', '/message/send-audio', '/message/send-video', '/message/send-location', '/message/send-contact', '/message/send-button', '/message/send-list', '/message/reply'],
            contacts: ['/contacts/get', '/contacts/get-all', '/contacts/check', '/contacts/save', '/contacts/get-about'],
            chats: ['/chats/get', '/chats/get-all', '/chats/archive', '/chats/unarchive', '/chats/clear', '/chats/delete', '/chats/pin', '/chats/unpin'],
            groups: ['/groups/create', '/groups/get', '/groups/update-participants', '/groups/update-settings', '/groups/leave', '/groups/invite-code']
          }
        });
      });

      // ==================
      // INSTANCE ENDPOINTS
      // ==================

      // Get instance status (GET)
      app.get('/instance/status', async (req, res) => {
        try {
          const response = await makeApiRequest('/v1/instance/device', 'get');
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Get QR Code (GET)
      app.get('/instance/qr-code', async (req, res) => {
        try {
          const response = await makeApiRequest('/v1/instance/qr-code', 'get');
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Connect instance (POST)
      app.post('/instance/connect', async (req, res) => {
        try {
          const response = await makeApiRequest('/v1/instance/connect', 'post');
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Disconnect instance (POST)
      app.post('/instance/disconnect', async (req, res) => {
        try {
          const response = await makeApiRequest('/v1/instance/disconnect', 'post');
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Restart instance (POST)
      app.post('/instance/restart', async (req, res) => {
        try {
          const response = await makeApiRequest('/v1/instance/restart', 'post');
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Logout instance (POST)
      app.post('/instance/logout', async (req, res) => {
        try {
          const response = await makeApiRequest('/v1/instance/logout', 'post');
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // ==================
      // MESSAGE ENDPOINTS
      // ==================

      // Send text message (POST)
      app.post('/message/send-text', async (req, res) => {
        try {
          const { phone, message, options } = req.body;
          const response = await makeApiRequest('/v1/message/send-text', 'post', {
            phone,
            message,
            options
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Send image message (POST)
      app.post('/message/send-image', async (req, res) => {
        try {
          const { phone, image, caption, options } = req.body;
          const response = await makeApiRequest('/v1/message/send-image', 'post', {
            phone,
            image,
            caption,
            options
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Send document message (POST)
      app.post('/message/send-document', async (req, res) => {
        try {
          const { phone, document, filename, caption, options } = req.body;
          const response = await makeApiRequest('/v1/message/send-document', 'post', {
            phone,
            document,
            filename,
            caption,
            options
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Send audio message (POST)
      app.post('/message/send-audio', async (req, res) => {
        try {
          const { phone, audio, options } = req.body;
          const response = await makeApiRequest('/v1/message/send-audio', 'post', {
            phone,
            audio,
            options
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Send video message (POST)
      app.post('/message/send-video', async (req, res) => {
        try {
          const { phone, video, caption, options } = req.body;
          const response = await makeApiRequest('/v1/message/send-video', 'post', {
            phone,
            video,
            caption,
            options
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Send location message (POST)
      app.post('/message/send-location', async (req, res) => {
        try {
          const { phone, latitude, longitude, name, address, options } = req.body;
          const response = await makeApiRequest('/v1/message/send-location', 'post', {
            phone,
            latitude,
            longitude,
            name,
            address,
            options
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Send contact message (POST)
      app.post('/message/send-contact', async (req, res) => {
        try {
          const { phone, contact, options } = req.body;
          const response = await makeApiRequest('/v1/message/send-contact', 'post', {
            phone,
            contact,
            options
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Send button message (POST)
      app.post('/message/send-button', async (req, res) => {
        try {
          const { phone, message, buttons, options } = req.body;
          const response = await makeApiRequest('/v1/message/send-button', 'post', {
            phone,
            message,
            buttons,
            options
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Send list message (POST)
      app.post('/message/send-list', async (req, res) => {
        try {
          const { phone, message, list, options } = req.body;
          const response = await makeApiRequest('/v1/message/send-list', 'post', {
            phone,
            message,
            list,
            options
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Reply to message (POST)
      app.post('/message/reply', async (req, res) => {
        try {
          const { messageId, message, options } = req.body;
          const response = await makeApiRequest('/v1/message/reply', 'post', {
            messageId,
            message,
            options
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // ==================
      // CONTACTS ENDPOINTS
      // ==================

      // Get contact (GET)
      app.get('/contacts/get', async (req, res) => {
        try {
          const { phone } = req.query;
          const response = await makeApiRequest(`/v1/contacts/get?phone=${phone}`, 'get');
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Get all contacts (GET)
      app.get('/contacts/get-all', async (req, res) => {
        try {
          const response = await makeApiRequest('/v1/contacts/get-all', 'get');
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Check contact (GET)
      app.get('/contacts/check', async (req, res) => {
        try {
          const { phone } = req.query;
          const response = await makeApiRequest(`/v1/contacts/check?phone=${phone}`, 'get');
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Save contact (POST)
      app.post('/contacts/save', async (req, res) => {
        try {
          const { phone, name } = req.body;
          const response = await makeApiRequest('/v1/contacts/save', 'post', {
            phone,
            name
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Get contact about (GET)
      app.get('/contacts/get-about', async (req, res) => {
        try {
          const { phone } = req.query;
          const response = await makeApiRequest(`/v1/contacts/get-about?phone=${phone}`, 'get');
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // ==================
      // CHATS ENDPOINTS
      // ==================

      // Get chat (GET)
      app.get('/chats/get', async (req, res) => {
        try {
          const { phone } = req.query;
          const response = await makeApiRequest(`/v1/chats/get?phone=${phone}`, 'get');
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Get all chats (GET)
      app.get('/chats/get-all', async (req, res) => {
        try {
          const response = await makeApiRequest('/v1/chats/get-all', 'get');
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Archive chat (POST)
      app.post('/chats/archive', async (req, res) => {
        try {
          const { phone } = req.body;
          const response = await makeApiRequest('/v1/chats/archive', 'post', {
            phone
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Unarchive chat (POST)
      app.post('/chats/unarchive', async (req, res) => {
        try {
          const { phone } = req.body;
          const response = await makeApiRequest('/v1/chats/unarchive', 'post', {
            phone
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Clear chat (POST)
      app.post('/chats/clear', async (req, res) => {
        try {
          const { phone } = req.body;
          const response = await makeApiRequest('/v1/chats/clear', 'post', {
            phone
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Delete chat (POST)
      app.post('/chats/delete', async (req, res) => {
        try {
          const { phone } = req.body;
          const response = await makeApiRequest('/v1/chats/delete', 'post', {
            phone
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Pin chat (POST)
      app.post('/chats/pin', async (req, res) => {
        try {
          const { phone } = req.body;
          const response = await makeApiRequest('/v1/chats/pin', 'post', {
            phone
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Unpin chat (POST)
      app.post('/chats/unpin', async (req, res) => {
        try {
          const { phone } = req.body;
          const response = await makeApiRequest('/v1/chats/unpin', 'post', {
            phone
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // ==================
      // GROUPS ENDPOINTS
      // ==================

      // Create group (POST)
      app.post('/groups/create', async (req, res) => {
        try {
          const { name, participants } = req.body;
          const response = await makeApiRequest('/v1/groups/create', 'post', {
            name,
            participants
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Get group (GET)
      app.get('/groups/get', async (req, res) => {
        try {
          const { groupId } = req.query;
          const response = await makeApiRequest(`/v1/groups/get?groupId=${groupId}`, 'get');
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Update group participants (POST)
      app.post('/groups/update-participants', async (req, res) => {
        try {
          const { groupId, participants, action } = req.body;
          const response = await makeApiRequest('/v1/groups/update-participants', 'post', {
            groupId,
            participants,
            action
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Update group settings (POST)
      app.post('/groups/update-settings', async (req, res) => {
        try {
          const { groupId, settings } = req.body;
          const response = await makeApiRequest('/v1/groups/update-settings', 'post', {
            groupId,
            settings
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Leave group (POST)
      app.post('/groups/leave', async (req, res) => {
        try {
          const { groupId } = req.body;
          const response = await makeApiRequest('/v1/groups/leave', 'post', {
            groupId
          });
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Get group invite code (GET)
      app.get('/groups/invite-code', async (req, res) => {
        try {
          const { groupId } = req.query;
          const response = await makeApiRequest(`/v1/groups/invite-code?groupId=${groupId}`, 'get');
          res.json(response);
        } catch (error) {
          res.status(500).json({ success: false, error });
        }
      });

      // Start the server
      server = app.listen(port, () => {
        console.log(`W-API Server running at http://localhost:${port}`);
        console.log('All W-API endpoints are available and ready to use');
        resolve(app);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Stop the API server
 * @returns {Promise<void>}
 */
function stop() {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close((err) => {
        if (err) {
          reject(err);
        } else {
          server = null;
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  start,
  stop
}; 