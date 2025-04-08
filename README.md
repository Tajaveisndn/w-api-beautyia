# W-API Beauty IA

Uma biblioteca cliente avançada para o serviço W-API WhatsApp, agora com suporte a nuvem e recursos premium.

## ✨ Novas Características

- ✅ Arquitetura Cloud-Ready (sem dependência de servidor local)
- ✅ Cache inteligente para respostas
- ✅ Rate Limiting automático
- ✅ Monitoramento de saúde da conexão
- ✅ Sistema de eventos para status da conexão
- ✅ Logging avançado
- ✅ Suporte a variáveis de ambiente
- ✅ Métricas de uso em tempo real
- ✅ Tratamento de erros robusto
- ✅ Compatibilidade com versões anteriores

## 📋 Índice
- [Instalação](#-instalação)
- [Início Rápido](#-início-rápido)
- [Configuração Avançada](#-configuração-avançada)
- [Métodos Disponíveis](#-métodos-disponíveis)
- [Eventos](#-eventos)
- [Exemplos](#-exemplos)
- [Suporte](#-suporte)
- [Licença](#-licença)

## 📥 Instalação

```bash
npm install w-api-beauty-ia
```

## 🚀 Início Rápido

### Usando Variáveis de Ambiente

```javascript
// Configure as variáveis de ambiente
process.env.WAPI_HOST = 'api.w-api.app';
process.env.WAPI_INSTANCE_ID = 'SEU_INSTANCE_ID';
process.env.WAPI_API_TOKEN = 'SEU_API_TOKEN';

const { createService } = require('w-api-beauty-ia');

// Crie uma instância do serviço
const wapi = createService({
  logEnabled: true, // Habilita logging
  cacheEnabled: true, // Habilita cache
  rateLimit: 60 // Limite de 60 requisições por minuto
});

// Use os métodos diretamente
async function main() {
  try {
    // Verificar status
    const status = await wapi.getStatus();
    console.log('Status:', status);

    // Enviar mensagem
    await wapi.sendText('5512345678901', 'Olá!');
    
    // Obter métricas
    const stats = wapi.getStats();
    console.log('Métricas:', stats);
  } catch (error) {
    console.error('Erro:', error);
  }
}

main();
```

### Usando Configuração Direta

```javascript
const { createService } = require('w-api-beauty-ia');

const wapi = createService({
  apiHost: 'api.w-api.app',
  instanceId: 'SEU_INSTANCE_ID',
  apiToken: 'SEU_API_TOKEN',
  logEnabled: true,
  cacheEnabled: true,
  rateLimit: 60
});

// Escute eventos
wapi.on('connected', (status) => {
  console.log('Conectado ao WhatsApp!', status);
});

wapi.on('disconnected', (status) => {
  console.log('Desconectado do WhatsApp!', status);
});

wapi.on('error', (error) => {
  console.error('Erro:', error);
});
```

## ⚙️ Configuração Avançada

### Opções do Serviço

```javascript
const options = {
  // Configurações básicas
  apiHost: 'api.w-api.app',
  instanceId: 'SEU_INSTANCE_ID',
  apiToken: 'SEU_API_TOKEN',
  
  // Recursos avançados
  cacheEnabled: true,      // Habilita cache de respostas
  cacheTTL: 60,           // Tempo de vida do cache em segundos
  logEnabled: true,       // Habilita logging
  rateLimit: 60,          // Limite de requisições por minuto
  healthCheckInterval: 60000 // Intervalo de verificação de saúde em ms
};
```

### Eventos Disponíveis

```javascript
wapi.on('connected', (status) => {
  // Chamado quando conecta ao WhatsApp
});

wapi.on('disconnected', (status) => {
  // Chamado quando desconecta do WhatsApp
});

wapi.on('health_check', (status) => {
  // Chamado a cada verificação de saúde
});

wapi.on('error', (error) => {
  // Chamado quando ocorre um erro
});

wapi.on('log', (log) => {
  // Chamado para cada log quando logEnabled é true
});

wapi.on('request_error', (error) => {
  // Chamado quando uma requisição falha
});

wapi.on('shutdown', () => {
  // Chamado quando o serviço é encerrado
});
```

## 📚 Métodos Disponíveis

### Métodos de Instância
- `getStatus()` - Obter status da conexão
- `getQR()` - Obter código QR para conexão
- `connect()` - Conectar ao WhatsApp
- `disconnect()` - Desconectar do WhatsApp
- `restart()` - Reiniciar a instância
- `logout()` - Sair do WhatsApp

### Métodos de Mensagem
- `sendText(phone, message, options)` - Enviar mensagem de texto
- `sendImage(phone, image, caption, options)` - Enviar imagem
- `sendDocument(phone, document, filename, caption, options)` - Enviar documento
- `sendAudio(phone, audio, options)` - Enviar áudio
- `sendVideo(phone, video, caption, options)` - Enviar vídeo
- `sendLocation(phone, latitude, longitude, name, address, options)` - Enviar localização
- `sendContact(phone, contact, options)` - Enviar contato
- `sendButtons(phone, message, buttons, options)` - Enviar mensagem com botões
- `sendList(phone, message, list, options)` - Enviar mensagem com lista
- `reply(messageId, message, options)` - Responder a uma mensagem

### Métodos de Contatos
- `getContact(phone)` - Obter informações do contato
- `getContacts()` - Obter todos os contatos
- `checkContact(phone)` - Verificar se número existe no WhatsApp
- `saveContact(phone, name)` - Salvar um contato
- `getAbout(phone)` - Obter status/sobre do contato

### Métodos de Chats
- `getChat(phone)` - Obter informações do chat
- `getChats()` - Obter todos os chats
- `archiveChat(phone)` - Arquivar um chat
- `unarchiveChat(phone)` - Desarquivar um chat
- `clearChat(phone)` - Limpar histórico do chat
- `deleteChat(phone)` - Deletar um chat
- `pinChat(phone)` - Fixar um chat
- `unpinChat(phone)` - Desafixar um chat

### Métodos de Grupos
- `createGroup(name, participants)` - Criar um grupo
- `getGroup(groupId)` - Obter informações do grupo
- `updateGroupParticipants(groupId, participants, action)` - Atualizar participantes do grupo
- `updateGroupSettings(groupId, settings)` - Atualizar configurações do grupo
- `leaveGroup(groupId)` - Sair do grupo
- `getGroupInviteCode(groupId)` - Obter código de convite do grupo

### Métodos de Gerenciamento
- `getStats()` - Obter métricas do serviço
- `clearCache()` - Limpar cache
- `shutdown()` - Encerrar o serviço

## 📝 Exemplos

### Enviar Mensagem com Cache

```javascript
const wapi = createService({
  cacheEnabled: true,
  cacheTTL: 300 // Cache por 5 minutos
});

// Primeira chamada - faz a requisição
const status1 = await wapi.getStatus();

// Segunda chamada - usa o cache
const status2 = await wapi.getStatus();
```

### Monitoramento de Conexão

```javascript
const wapi = createService({
  healthCheckInterval: 30000 // Verifica a cada 30 segundos
});

wapi.on('connected', (status) => {
  console.log('WhatsApp conectado:', status);
});

wapi.on('disconnected', (status) => {
  console.log('WhatsApp desconectado:', status);
});
```

### Rate Limiting

```javascript
const wapi = createService({
  rateLimit: 30 // 30 requisições por minuto
});

// Se exceder o limite, lança erro 429
try {
  for (let i = 0; i < 40; i++) {
    await wapi.getStatus();
  }
} catch (error) {
  if (error.code === 429) {
    console.log('Rate limit excedido. Tente novamente em:', error.resetAfter, 'ms');
  }
}
```

## ❓ Suporte

Para mais informações e suporte, consulte:
- [Documentação Oficial do W-API](https://w-api.app/docs)
- [Issues do GitHub](https://github.com/seu-usuario/w-api-beauty-ia/issues)

## 📄 Licença

MIT
