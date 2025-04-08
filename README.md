# W-API Beauty IA

A comprehensive client library for the W-API WhatsApp API service.

## Features

- Full support for all W-API endpoints
- Simplified client interface with short method names
- Built-in API server for local use
- Direct connection to W-API servers
- TypeScript support

## Installation

```bash
npm install w-api-beauty-ia
```

## Quick Start

```javascript
const api = require('./node_modules/w-api-beauty-ia/src/index');  // This will use the index.js we just created

// Example usage
const start = async () => {
    try {
        await api.startServer({
            port: 3000,
            instanceId: 'KP4DOT-KDU663-HHS6M9',  // Replace with your instance ID
            apiToken: 'Q7aGkBpxdvQ4Qg0kALd9RZRfazvlapdDp'       // Replace with your API token
        });
        
        console.log('Server started successfully!');
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

start();
```

## Using Short Variable Names

You can use the `wa` object for shorter syntax:

```javascript
const { wa, createClient } = require('w-api-beauty-ia');

const client = createClient({
  instanceId: 'YOUR_INSTANCE_ID',
  apiToken: 'YOUR_API_TOKEN',
  directMode: true
});

// Send a text message
wa.text(client, '5512345678901', 'Hello!');

// Send an image
wa.image(client, '5512345678901', 'https://example.com/image.jpg', 'Check this out!');

// Create a group
wa.createGroup(client, 'My Group', ['5512345678901', '5598765432101']);
```

## Starting the API Server

You can start the built-in API server to use in your local network:

```javascript
const { startServer } = require('w-api-beauty-ia');

// Start the server
startServer({
  port: 3000,
  instanceId: 'YOUR_INSTANCE_ID',
  apiToken: 'YOUR_API_TOKEN'
}).then(() => {
  console.log('Server started successfully');
}).catch(error => {
  console.error('Failed to start server:', error);
});
```

Then you can create a client that uses the local server:

```javascript
const { createClient } = require('w-api-beauty-ia');

const client = createClient({
  baseUrl: 'http://localhost:3000',
  directMode: false // use local server
});

// Now you can use the client methods
client.sendText('5512345678901', 'Hello!');
```

## Available Methods

### Instance Methods
- `status()` - Get connection status
- `qr()` - Get QR code for connection
- `connect()` - Connect to WhatsApp
- `disconnect()` - Disconnect from WhatsApp
- `restart()` - Restart the instance
- `logout()` - Logout from WhatsApp

### Message Methods
- `sendText(phone, message, options)` - Send text message
- `sendImage(phone, image, caption, options)` - Send image
- `sendDoc(phone, document, filename, caption, options)` - Send document
- `sendAudio(phone, audio, options)` - Send audio
- `sendVideo(phone, video, caption, options)` - Send video
- `sendLocation(phone, latitude, longitude, name, address, options)` - Send location
- `sendContact(phone, contact, options)` - Send contact
- `sendButtons(phone, message, buttons, options)` - Send button message
- `sendList(phone, message, list, options)` - Send list message
- `reply(messageId, message, options)` - Reply to a message

### Contacts Methods
- `getContact(phone)` - Get contact info
- `getContacts()` - Get all contacts
- `checkContact(phone)` - Check if number exists on WhatsApp
- `saveContact(phone, name)` - Save a contact
- `getAbout(phone)` - Get contact about/status

### Chats Methods
- `getChat(phone)` - Get chat info
- `getChats()` - Get all chats
- `archiveChat(phone)` - Archive a chat
- `unarchiveChat(phone)` - Unarchive a chat
- `clearChat(phone)` - Clear chat history
- `deleteChat(phone)` - Delete a chat
- `pinChat(phone)` - Pin a chat
- `unpinChat(phone)` - Unpin a chat

### Groups Methods
- `createGroup(name, participants)` - Create a group
- `getGroup(groupId)` - Get group info
- `updateGroupParticipants(groupId, participants, action)` - Update group participants
- `updateGroupSettings(groupId, settings)` - Update group settings
- `leaveGroup(groupId)` - Leave a group
- `getGroupInviteCode(groupId)` - Get group invite code

## License

MIT 
