/**
 * W-API Beauty IA - Basic Usage Example
 * 
 * This example demonstrates how to use the W-API Beauty IA client to send messages
 * and perform other WhatsApp operations.
 */

// Import the package
const wapi = require('../index');

// Your W-API credentials
const config = {
  instanceId: 'KP4DOT-KDU663-HHS6M9',   // Replace with your Instance ID
  apiToken: 'Q7aGkBpxdvQ4Qg0kALd9RZRfazvlapdDp',  // Replace with your API Token
  directMode: true  // Connect directly to W-API servers
};

// Create a client
const client = wapi.createClient(config);

// Using the full client interface
async function usingFullClient() {
  try {
    // Get device status
    console.log('Checking device status...');
    const status = await client.status();
    console.log('Status:', status);

    if (!status.connected) {
      console.log('Getting QR code for connection...');
      const qr = await client.qr();
      console.log('Scan this QR code with your WhatsApp app:', qr.qrcode);
      
      // Wait for connection
      console.log('Waiting for connection...');
      // In a real app, you would need to poll the status endpoint until connected
    }

    // Send a text message
    console.log('Sending a text message...');
    const result = await client.sendText('5512345678901', 'Hello from W-API Beauty IA!');
    console.log('Message sent:', result);

    // Get all contacts
    console.log('Getting all contacts...');
    const contacts = await client.getContacts();
    console.log(`Found ${contacts.length} contacts`);
    
    // Get all chats
    console.log('Getting all chats...');
    const chats = await client.getChats();
    console.log(`Found ${chats.length} chats`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Using the short syntax (wa object)
async function usingShortSyntax() {
  const { wa } = wapi;
  
  try {
    // Check status
    const status = await wa.status(client);
    console.log('Status (short syntax):', status);
    
    // Send a message
    const result = await wa.text(client, '5512345678901', 'Hello using short syntax!');
    console.log('Message sent (short syntax):', result);
    
    // Send an image
    await wa.image(
      client,
      '5512345678901',
      'https://example.com/image.jpg',
      'Check out this image!'
    );
    
    // Get contacts
    const contacts = await wa.getContacts(client);
    console.log(`Found ${contacts.length} contacts (short syntax)`);
  } catch (error) {
    console.error('Error with short syntax:', error);
  }
}

// Run the examples
async function runExamples() {
  console.log('=== USING FULL CLIENT INTERFACE ===');
  await usingFullClient();
  
  console.log('\n=== USING SHORT SYNTAX ===');
  await usingShortSyntax();
}

runExamples().catch(console.error); 