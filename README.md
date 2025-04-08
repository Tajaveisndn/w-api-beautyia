# W-API Beauty IA

Uma biblioteca cliente completa para o serviço W-API WhatsApp.

## 📋 Índice
- [Características](#-características)
- [Instalação](#-instalação)
- [Início Rápido](#-início-rápido)
- [Uso Básico](#-uso-básico)
- [Métodos Disponíveis](#-métodos-disponíveis)
- [Exemplos](#-exemplos)
- [Suporte](#-suporte)
- [Licença](#-licença)

## ✨ Características

- Suporte completo para todos os endpoints do W-API
- Interface simplificada com nomes curtos de métodos
- Servidor API integrado para uso local
- Conexão direta com servidores W-API
- Suporte a TypeScript
- Documentação em português

## 📥 Instalação

```bash
npm install w-api-beauty-ia
```

## 🚀 Início Rápido

```javascript
const wapi = require('w-api-beauty-ia');

// Configurações básicas
const config = {
  port: 3000,
  instanceId: 'SEU_INSTANCE_ID',
  apiToken: 'SEU_API_TOKEN'
};

// Função para verificar status
async function verificarStatus() {
  try {
    const response = await fetch('http://localhost:3000/instance/status');
    const status = await response.json();
    console.log('Status da instância:', status);
    return status;
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    throw error;
  }
}

// Iniciar o servidor
console.log('Conectando ao W-API...');
wapi.start(config)
  .then(async () => {
    console.log('✅ Servidor iniciado!');
    console.log('Verificando credenciais...');
    
    // Verificar status da instância
    await verificarStatus();
  })
  .catch(erro => {
    console.error('❌ Erro ao conectar:', erro);
  });
```

## 💡 Uso Básico

### Usando nomes curtos de variáveis

```javascript
const { wa, createClient } = require('w-api-beauty-ia');

const client = createClient({
  instanceId: 'SEU_INSTANCE_ID',
  apiToken: 'SEU_API_TOKEN',
  directMode: true
});

// Enviar mensagem de texto
wa.text(client, '5512345678901', 'Olá!');

// Enviar imagem
wa.image(client, '5512345678901', 'https://exemplo.com/imagem.jpg', 'Veja isso!');

// Criar grupo
wa.createGroup(client, 'Meu Grupo', ['5512345678901', '5598765432101']);
```

### Iniciando o Servidor API

```javascript
const { startServer } = require('w-api-beauty-ia');

// Iniciar o servidor
startServer({
  port: 3000,
  instanceId: 'SEU_INSTANCE_ID',
  apiToken: 'SEU_API_TOKEN'
}).then(() => {
  console.log('Servidor iniciado com sucesso');
}).catch(error => {
  console.error('Falha ao iniciar servidor:', error);
});
```

## 📚 Métodos Disponíveis

### Métodos de Instância
- `status()` - Obter status da conexão
- `qr()` - Obter código QR para conexão
- `connect()` - Conectar ao WhatsApp
- `disconnect()` - Desconectar do WhatsApp
- `restart()` - Reiniciar a instância
- `logout()` - Sair do WhatsApp

### Métodos de Mensagem
- `sendText(phone, message, options)` - Enviar mensagem de texto
- `sendImage(phone, image, caption, options)` - Enviar imagem
- `sendDoc(phone, document, filename, caption, options)` - Enviar documento
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

## 📝 Exemplos

### Enviar Mensagem de Texto
```javascript
const client = createClient({
  instanceId: 'SEU_INSTANCE_ID',
  apiToken: 'SEU_API_TOKEN'
});

client.sendText('5512345678901', 'Olá, como vai?');
```

### Enviar Imagem com Legenda
```javascript
client.sendImage(
  '5512345678901',
  'https://exemplo.com/imagem.jpg',
  'Veja esta imagem!'
);
```

### Criar Grupo
```javascript
client.createGroup('Meu Grupo', [
  '5512345678901',
  '5598765432101'
]);
```

## ❓ Suporte

Para mais informações e suporte, consulte:
- [Documentação Oficial do W-API](https://w-api.app/docs)
- [Issues do GitHub](https://github.com/seu-usuario/w-api-beauty-ia/issues)

## 📄 Licença

MIT
