# W-API Wrapper

Uma biblioteca JavaScript para integração com a API do WhatsApp W-API. Essa biblioteca facilita o envio de mensagens, criação de grupos e gerenciamento de instâncias do WhatsApp.

## Instalação

```bash
npm install w-api-wrapper
```

## Uso Básico

```javascript
const { WApiClient } = require('w-api-wrapper');

// Inicialize o cliente com sua API key e Instance ID
const client = new WApiClient('sua-api-key', 'seu-instance-id');

// Exemplo: Enviar uma mensagem de texto
async function enviarMensagem() {
  try {
    const resultado = await client.sendTextMessage('5511999999999@c.us', 'Olá, esta é uma mensagem de teste!');
    console.log('Mensagem enviada:', resultado);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
}

enviarMensagem();
```

## Exemplos de Uso

### Inicializar uma Instância

```javascript
async function inicializarInstancia() {
  try {
    const resultado = await client.initInstance();
    console.log('Instância inicializada:', resultado);
  } catch (error) {
    console.error('Erro ao inicializar instância:', error);
  }
}
```

### Obter QR Code para Autenticação

```javascript
async function obterQRCode() {
  try {
    const qrCode = await client.getQrCode();
    console.log('QR Code:', qrCode);
  } catch (error) {
    console.error('Erro ao obter QR code:', error);
  }
}
```

### Enviar Mensagem com Imagem

```javascript
async function enviarImagem() {
  try {
    const resultado = await client.sendImageMessage(
      '5511999999999@c.us',
      'Confira esta imagem!',
      'https://exemplo.com/imagem.jpg'
    );
    console.log('Imagem enviada:', resultado);
  } catch (error) {
    console.error('Erro ao enviar imagem:', error);
  }
}
```

### Enviar Mensagem com Botões

```javascript
async function enviarBotoes() {
  try {
    const botoes = [
      { id: 'btn1', text: 'Opção 1' },
      { id: 'btn2', text: 'Opção 2' },
      { id: 'btn3', text: 'Opção 3' }
    ];
    
    const resultado = await client.sendButtonMessage(
      '5511999999999@c.us',
      'Escolha uma opção',
      'Por favor, selecione uma das opções abaixo:',
      botoes,
      'Responda clicando em um botão'
    );
    console.log('Mensagem com botões enviada:', resultado);
  } catch (error) {
    console.error('Erro ao enviar mensagem com botões:', error);
  }
}
```

### Criar um Grupo

```javascript
async function criarGrupo() {
  try {
    const participantes = ['5511999999999@c.us', '5511888888888@c.us'];
    const resultado = await client.createGroup('Nome do Grupo', participantes);
    console.log('Grupo criado:', resultado);
  } catch (error) {
    console.error('Erro ao criar grupo:', error);
  }
}
```

## Integração com Sistema de Agendamento

Para integrar com um sistema de agendamento em seu site, você pode usar o seguinte exemplo:

```javascript
// Quando um cliente fizer um agendamento em seu site
async function notificarAgendamento(dadosAgendamento) {
  try {
    const { nome, telefone, data, hora, servico } = dadosAgendamento;
    
    // Formatar o número do telefone para o formato do WhatsApp (com @c.us no final)
    const numeroFormatado = telefone.replace(/\D/g, '') + '@c.us';
    
    // Criar a mensagem de confirmação
    const mensagem = `Olá ${nome}, seu agendamento foi confirmado!\n\nServiço: ${servico}\nData: ${data}\nHorário: ${hora}\n\nAguardamos você!`;
    
    // Enviar a mensagem para o cliente
    const resultado = await client.sendTextMessage(numeroFormatado, mensagem);
    console.log('Notificação de agendamento enviada:', resultado);
    
    return resultado;
  } catch (error) {
    console.error('Erro ao enviar notificação de agendamento:', error);
    throw error;
  }
}
```

## Métodos Disponíveis

### Instâncias
- `getInstance()` - Obter informações da instância
- `initInstance()` - Inicializar uma instância
- `getQrCode()` - Obter o QR code para autenticação
- `logout()` - Desconectar da instância

### Mensagens
- `sendTextMessage(to, body)` - Enviar mensagem de texto
- `sendImageMessage(to, caption, url)` - Enviar mensagem com imagem
- `sendFileMessage(to, caption, url)` - Enviar mensagem com arquivo
- `sendButtonMessage(to, title, description, buttons, footer)` - Enviar mensagem com botões

### Grupos
- `createGroup(name, participants)` - Criar um grupo
- `addGroupParticipants(groupId, participants)` - Adicionar participantes a um grupo
- `removeGroupParticipants(groupId, participants)` - Remover participantes de um grupo

### Contatos e Chats
- `getContacts()` - Obter lista de contatos
- `getChats()` - Obter lista de chats

## Licença

MIT 