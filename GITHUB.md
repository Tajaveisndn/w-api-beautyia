# Usando o W-API Wrapper pelo GitHub

Este guia explica como publicar e utilizar este pacote diretamente do GitHub.

## Publicando no GitHub

1. Crie um repositório no GitHub para seu pacote.

2. Faça o commit do código e envie para o GitHub:

```bash
# Inicialize o repositório Git
git init

# Adicione os arquivos (exceto node_modules e .env)
git add .

# Faça o commit inicial
git commit -m "Versão inicial do W-API Wrapper"

# Adicione seu repositório remoto
git remote add origin https://github.com/seu-usuario/w-api-wrapper.git

# Envie o código para o GitHub
git push -u origin main
```

## Instalando a partir do GitHub

Em seu projeto onde deseja usar este pacote:

```bash
# Instale a dependência diretamente do GitHub
npm install git+https://github.com/seu-usuario/w-api-wrapper.git
```

Ou adicione ao seu package.json:

```json
{
  "dependencies": {
    "w-api-wrapper": "git+https://github.com/seu-usuario/w-api-wrapper.git"
  }
}
```

E então execute:

```bash
npm install
```

## Usando em seu projeto

Depois de instalado, você pode usar o pacote em seu projeto:

```javascript
const { WApiClient } = require('w-api-wrapper');

// Inicialize o cliente com suas credenciais
const client = new WApiClient('sua-api-key', 'seu-instance-id');

// Utilize os métodos disponíveis
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

## Atualizando o pacote

Se você fizer alterações no pacote e quiser atualizar a versão em seus projetos:

1. Faça as alterações necessárias
2. Atualize a versão no `package.json`
3. Envie as alterações para o GitHub:

```bash
git add .
git commit -m "Atualização: descrição das mudanças"
git push
```

4. Nos projetos que usam este pacote, atualize para a versão mais recente:

```bash
npm update w-api-wrapper
```

## Uso em sites

Para utilizar este pacote em um site, siga estas etapas:

1. Configure um servidor Node.js com Express (ou outro framework)
2. Instale o pacote conforme descrito acima
3. Crie endpoints para processar requisições do frontend
4. Utilize o W-API Wrapper para enviar mensagens de WhatsApp

Veja o exemplo em `examples/site-integration.js` e `examples/form-agendamento.html` para um modelo completo de integração. 