/**
 * W-API Beauty IA - Server Usage Example
 * 
 * This example demonstrates how to start a local API server
 * that handles all W-API requests and then connect to it.
 */

// Import the package
const wapi = require('../index');

// Your W-API credentials
const apiCredentials = {
  instanceId: 'KP4DOT-KDU663-HHS6M9',   // Replace with your Instance ID
  apiToken: 'Q7aGkBpxdvQ4Qg0kALd9RZRfazvlapdDp',  // Replace with your API Token
  port: 3000  // Port to run the API server on
};

// Server monitoring variables
let serverIsRunning = false;
let serverInstance = null;

/**
 * Start the local API server
 */
async function startApiServer() {
  try {
    console.log('Starting W-API Beauty IA server...');
    
    // Start the server with your API credentials
    serverInstance = await wapi.startServer({
      port: apiCredentials.port,
      instanceId: apiCredentials.instanceId,
      apiToken: apiCredentials.apiToken
    });
    
    serverIsRunning = true;
    console.log(`W-API server is running on http://localhost:${apiCredentials.port}`);
    console.log('Now you can connect to this server from any client in your network');
    
    // Setup shutdown handler
    process.on('SIGINT', async () => {
      await stopApiServer();
      process.exit(0);
    });
    
    return serverInstance;
  } catch (error) {
    console.error('Failed to start server:', error);
    throw error;
  }
}

/**
 * Stop the API server
 */
async function stopApiServer() {
  if (serverIsRunning && serverInstance) {
    console.log('Stopping W-API server...');
    await wapi.stopServer();
    serverIsRunning = false;
    console.log('Server stopped');
  }
}

/**
 * Create a client that connects to the local server
 */
function createLocalClient() {
  // Create a client that uses the local server (not direct mode)
  return wapi.createClient({
    baseUrl: `http://localhost:${apiCredentials.port}`,
    directMode: false // Use local server instead of direct W-API connection
  });
}

/**
 * Example of how to use the client with the local server
 */
async function useLocalClient() {
  const client = createLocalClient();
  
  try {
    // Get connection status
    console.log('Checking WhatsApp connection status...');
    const status = await client.status();
    console.log('Connection status:', status);
    
    if (!status.connected) {
      // Get QR code for connection
      console.log('Getting QR code for WhatsApp connection...');
      const qr = await client.qr();
      console.log('Please scan this QR code with your WhatsApp app:');
      console.log(qr.qrcode || qr.base64Image);
      
      console.log('Waiting for connection...');
      // In a real app, you would poll the status endpoint periodically
    } else {
      // Send a test message
      console.log('Sending a test message...');
      const result = await client.sendText('5512345678901', 'Test message from local W-API Beauty IA server');
      console.log('Message sent:', result);
    }
  } catch (error) {
    console.error('Error using local client:', error);
  }
}

/**
 * Main function to run the example
 */
async function main() {
  try {
    // First start the API server
    await startApiServer();
    
    // Then use a client to connect to it
    console.log('\n=== USING LOCAL CLIENT ===');
    await useLocalClient();
    
    console.log('\nPress Ctrl+C to stop the server');
  } catch (error) {
    console.error('Error in main:', error);
    process.exit(1);
  }
}

// Run the example
main().catch(console.error); 