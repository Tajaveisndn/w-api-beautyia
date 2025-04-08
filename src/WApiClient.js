const axios = require('axios');

/**
 * W-API WhatsApp API Client
 * Um wrapper simplificado para a W-API (https://w-api.app)
 */
class WApiClient {
  /**
   * Cria um novo cliente W-API
   * @param {string} apiKey - Sua chave de API da W-API
   * @param {string} instanceId - Seu ID de instância da W-API
   * @param {string} baseUrl - URL base da API (padrão: https://api.w-api.app/v1)
   */
  constructor(apiKey, instanceId, baseUrl = 'https://api.w-api.app/v1') {
    if (!apiKey) throw new Error('API key é obrigatória');
    if (!instanceId) throw new Error('Instance ID é obrigatório');

    this.apiKey = apiKey;
    this.instanceId = instanceId;
    this.baseUrl = baseUrl;
    
    this.http = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      timeout: 30000 // 30 segundos de timeout
    });

    // Log da inicialização
    console.log(`Cliente W-API inicializado: instância ${this.instanceId}`);
  }

  // ===== MÉTODOS PARA INSTÂNCIA =====

  /**
   * Obter informações da instância
   * @returns {Promise} - Informações da instância
   */
  async getInstance() {
    return this._request('get', `/instances/${this.instanceId}`);
  }

  /**
   * Obter status da instância (atalho)
   */
  async status() {
    return this.getInstance();
  }

  /**
   * Inicializar uma instância
   * @returns {Promise} - Resultado da inicialização
   */
  async initInstance() {
    return this._request('post', `/instances/${this.instanceId}/init`);
  }

  /**
   * Inicializar (atalho)
   */
  async init() {
    return this.initInstance();
  }

  /**
   * Obter QR code da instância
   * @returns {Promise} - Dados do QR code
   */
  async getQrCode() {
    return this._request('get', `/instances/${this.instanceId}/qrcode`);
  }

  /**
   * Obter QR code (atalho)
   */
  async qrcode() {
    return this.getQrCode();
  }

  /**
   * Desconectar da instância
   * @returns {Promise} - Resultado do logout
   */
  async logout() {
    return this._request('post', `/instances/${this.instanceId}/logout`);
  }

  // ===== MÉTODOS PARA MENSAGENS =====

  /**
   * Enviar mensagem de texto
   * @param {string} to - Número de telefone no formato 5511999999999@c.us ou só 5511999999999
   * @param {string} body - Texto da mensagem
   * @returns {Promise} - Resultado do envio
   */
  async sendTextMessage(to, body) {
    // Garantir que o número esteja no formato correto
    to = this._formatPhoneNumber(to);
    return this._request('post', `/instances/${this.instanceId}/message/text`, { to, body });
  }

  /**
   * Enviar texto (atalho)
   */
  async sendText(to, text) {
    return this.sendTextMessage(to, text);
  }

  /**
   * Enviar mensagem com imagem
   * @param {string} to - Número de telefone
   * @param {string} caption - Legenda da imagem
   * @param {string} url - URL da imagem
   * @returns {Promise} - Resultado do envio
   */
  async sendImageMessage(to, caption, url) {
    to = this._formatPhoneNumber(to);
    return this._request('post', `/instances/${this.instanceId}/message/image`, { to, caption, url });
  }

  /**
   * Enviar imagem (atalho)
   */
  async sendImage(to, caption, url) {
    return this.sendImageMessage(to, caption, url);
  }

  /**
   * Enviar mensagem com arquivo
   * @param {string} to - Número de telefone
   * @param {string} caption - Legenda do arquivo
   * @param {string} url - URL do arquivo
   * @returns {Promise} - Resultado do envio
   */
  async sendFileMessage(to, caption, url) {
    to = this._formatPhoneNumber(to);
    return this._request('post', `/instances/${this.instanceId}/message/file`, { to, caption, url });
  }

  /**
   * Enviar arquivo (atalho)
   */
  async sendFile(to, caption, url) {
    return this.sendFileMessage(to, caption, url);
  }

  /**
   * Enviar mensagem com botões
   * @param {string} to - Número de telefone
   * @param {string} title - Título da mensagem
   * @param {string} description - Descrição da mensagem
   * @param {Array} buttons - Array de objetos de botão com id e text
   * @param {string} footer - Rodapé da mensagem
   * @returns {Promise} - Resultado do envio
   */
  async sendButtonMessage(to, title, description, buttons, footer = '') {
    to = this._formatPhoneNumber(to);
    return this._request('post', `/instances/${this.instanceId}/message/button`, { 
      to, title, description, buttons, footer 
    });
  }

  /**
   * Enviar botões (atalho)
   */
  async sendButtons(to, title, text, buttons, footer) {
    return this.sendButtonMessage(to, title, text, buttons, footer);
  }

  // ===== MÉTODOS PARA GRUPOS =====

  /**
   * Criar um grupo
   * @param {string} name - Nome do grupo
   * @param {Array} participants - Array de números de telefone
   * @returns {Promise} - Resultado da criação
   */
  async createGroup(name, participants) {
    participants = participants.map(p => this._formatPhoneNumber(p));
    return this._request('post', `/instances/${this.instanceId}/groups/create`, { name, participants });
  }

  /**
   * Adicionar participantes a um grupo
   * @param {string} groupId - ID do grupo
   * @param {Array} participants - Array de números de telefone
   * @returns {Promise} - Resultado da adição
   */
  async addGroupParticipants(groupId, participants) {
    participants = participants.map(p => this._formatPhoneNumber(p));
    return this._request('post', `/instances/${this.instanceId}/groups/${groupId}/participants/add`, { participants });
  }

  /**
   * Remover participantes de um grupo
   * @param {string} groupId - ID do grupo
   * @param {Array} participants - Array de números de telefone
   * @returns {Promise} - Resultado da remoção
   */
  async removeGroupParticipants(groupId, participants) {
    participants = participants.map(p => this._formatPhoneNumber(p));
    return this._request('post', `/instances/${this.instanceId}/groups/${groupId}/participants/remove`, { participants });
  }

  // ===== MÉTODOS PARA CONTATOS E CHATS =====

  /**
   * Obter contatos
   * @returns {Promise} - Lista de contatos
   */
  async getContacts() {
    return this._request('get', `/instances/${this.instanceId}/contacts`);
  }

  /**
   * Obter contatos (atalho)
   */
  async contacts() {
    return this.getContacts();
  }

  /**
   * Obter chats
   * @returns {Promise} - Lista de chats
   */
  async getChats() {
    return this._request('get', `/instances/${this.instanceId}/chats`);
  }

  /**
   * Obter chats (atalho)
   */
  async chats() {
    return this.getChats();
  }

  // ===== MÉTODOS AUXILIARES =====

  /**
   * Formata o número de telefone para o padrão da W-API
   * @param {string} phone - Número de telefone
   * @returns {string} - Número formatado
   * @private
   */
  _formatPhoneNumber(phone) {
    if (!phone) return phone;
    
    // Se já estiver no formato correto com @c.us, retorna como está
    if (phone.includes('@c.us')) return phone;
    
    // Remove caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Adiciona o sufixo @c.us
    return `${cleaned}@c.us`;
  }

  /**
   * Método unificado para fazer requisições à API
   * @param {string} method - Método HTTP (get, post, etc)
   * @param {string} endpoint - Endpoint da API
   * @param {Object} data - Dados para enviar (para POST, PUT, etc)
   * @returns {Promise} - Resultado da requisição
   * @private
   */
  async _request(method, endpoint, data = null) {
    try {
      console.log(`[W-API] Requisição ${method.toUpperCase()} para ${endpoint}`);
      
      let response;
      if (method.toLowerCase() === 'get') {
        response = await this.http.get(endpoint);
      } else if (method.toLowerCase() === 'post') {
        response = await this.http.post(endpoint, data);
      } else if (method.toLowerCase() === 'put') {
        response = await this.http.put(endpoint, data);
      } else if (method.toLowerCase() === 'delete') {
        response = await this.http.delete(endpoint);
      }
      
      console.log(`[W-API] Resposta recebida de ${endpoint}: sucesso`);
      return response.data;
    } catch (error) {
      return this._handleError(error, endpoint);
    }
  }

  /**
   * Tratamento de erros
   * @param {Error} error - Objeto de erro
   * @param {string} endpoint - Endpoint que gerou o erro
   * @private
   */
  _handleError(error, endpoint) {
    if (error.response) {
      // Servidor respondeu com status não-2xx
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || JSON.stringify(error.response.data);
      
      console.error(`[W-API] Erro ${statusCode} ao acessar ${endpoint}: ${errorMessage}`);
      
      // Mensagens específicas para códigos de erro comuns
      if (statusCode === 404) {
        console.error('[W-API] Endpoint não encontrado. Verifique se a URL base está correta.');
      } else if (statusCode === 401) {
        console.error('[W-API] Autenticação falhou. Verifique sua API key.');
      } else if (statusCode === 403) {
        console.error('[W-API] Acesso proibido. Verifique as permissões da sua conta.');
      }
      
      throw new Error(`W-API Error: ${statusCode} - ${errorMessage}`);
    } else if (error.request) {
      // Requisição feita mas sem resposta
      console.error('[W-API] Sem resposta do servidor. Verifique sua conexão e se o servidor está disponível.');
      throw new Error('W-API Error: Sem resposta do servidor');
    } else {
      // Erro na configuração da requisição
      console.error(`[W-API] Erro de configuração: ${error.message}`);
      throw new Error(`W-API Error: ${error.message}`);
    }
  }
}

module.exports = WApiClient; 
