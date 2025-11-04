# Documentação do Bot DIP - Departamento de Investigação Policial GTA RP (Gratuito)

Consulte o BOT base para informações mais detalhadas ou até mesmo um BOT Policial menos específico (Militar e afins) -
[Consulte o BOT base aqui](https://github.com/lksdgn/policia-discord-bot-gtarp/tree/main)

## Índice
1. [Sobre o Bot](#sobre-o-bot)
2. [Pré-requisitos](#pré-requisitos)
3. [Instalação](#instalação)
4. [Configuração Inicial](#configuração-inicial)
5. [Bibliotecas Utilizadas](#bibliotecas-utilizadas)
6. [Estrutura do Projeto](#estrutura-do-projeto)
7. [Comandos do Bot](#comandos-do-bot)
8. [Configurações Manuais](#configurações-manuais)
9. [Sistemas Especiais](#sistemas-especiais)
10. [Solução de Problemas](#solução-de-problemas)

---

## Sobre o Bot

Este é um bot Discord desenvolvido para gerenciar o Departamento de Investigação Policial (DIP) de um servidor de roleplay. Ele oferece funcionalidades completas para:

- Gerenciamento de membros e patentes
- Sistema de tickets
- Controle de horas de serviço
- Sistema de editais para unidades especiais
- Gerenciamento de medalhas e distintivos
- Sistema de advertências
- Filtros e consultas de membros
- E muito mais!

---

## Pré-requisitos

Antes de instalar o bot, certifique-se de ter:

- **Node.js** versão 16.9.0 ou superior ([Download](https://nodejs.org/))
- **npm** (geralmente vem com o Node.js)
- Uma **Application/Bot** criada no [Discord Developer Portal](https://discord.com/developers/applications)
- O **Token do Bot** (obtido no Developer Portal)
- **Permissões de Administrador** no servidor Discord onde o bot será usado

---

## Instalação

### 1. Download do Projeto

Clone ou faça download deste repositório para sua máquina local.

### 2. Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

Isso instalará todas as bibliotecas necessárias listadas no `package.json`.

### 3. Verificar Instalação

Após a instalação, verifique se não houve erros. As seguintes bibliotecas devem estar instaladas:

- discord.js (v14.14.1)
- wio.db (v4.0.22)
- dayjs (v1.11.13)
- axios (v1.6.7)
- discord-html-transcripts (v3.2.0)
- mercadopago (v2.0.8)
- moment (v2.30.1)
- randomized-string (v2.0.1)

---

## Configuração Inicial

- Use o modelo de apelido (nomes do Discord): DISTINTIVO | CODINOME (Exemplo: 01 | Texas) | Caso queira mudar isso, mude o REGEX nos arquivos que consultam o apelido.

### 1. Configurar o Token do Bot

Edite o arquivo `token.json` na raiz do projeto:

```json
{
    "token": "SEU_TOKEN_AQUI"
}
```

Substitua `SEU_TOKEN_AQUI` pelo token do seu bot obtido no Discord Developer Portal.

### 2. Configurar IDs do Servidor

Edite o arquivo `config.json`:

```json
{
    "dono": "ID_DO_DONO_DO_BOT",
    "senha": "SUA_SENHA_ADMIN",
    "setdono": "setado"
}
```

- **dono**: ID do Discord do proprietário do bot
- **senha**: Senha para comandos administrativos
- **setdono**: Mantenha como "setado"

### 3. Iniciar o Bot

Execute um dos seguintes comandos:

```bash
node index.js
```

Ou, se estiver usando PM2:

```bash
pm2 start index.js
```

Se tudo estiver correto, você verá a mensagem:
```
🎉 Ligado com sucesso em [NOME_DO_BOT] com acesso à [X] membros
```

---

## Bibliotecas Utilizadas

### Discord.js (v14.14.1)
A principal biblioteca para interagir com a API do Discord. Usada para:
- Criar e gerenciar comandos slash
- Manipular eventos (mensagens, reações, membros)
- Criar embeds, botões e modals
- Gerenciar permissões

### wio.db (v4.0.22)
Sistema de banco de dados JSON simples. Usado para:
- Armazenar configurações do bot
- Salvar dados de tickets
- Armazenar IDs de cargos e canais
- Gerenciar permissões

### dayjs (v1.11.13)
Biblioteca para manipulação de datas e horários. Usado para:
- Formatar datas e horários
- Calcular duração de serviço
- Processar registros de ponto

### axios (v1.6.7)
Cliente HTTP para fazer requisições. Usado para:
- Integrações externas
- APIs de terceiros

### discord-html-transcripts (v3.2.0)
Gera transcrições HTML de conversas. Usado para:
- Criar logs de tickets
- Exportar histórico de conversas

### moment (v2.30.1)
Biblioteca alternativa para datas (usada em alguns comandos legados).

### randomized-string (v2.0.1)
Gera strings aleatórias. Usado para:
- IDs únicos de tickets
- Códigos temporários

---

## Estrutura do Projeto

```
bot-dip-main/
├── Comandos/
│   ├── config/          # Comandos de configuração do bot
│   │   ├── botconfig.js
│   │   ├── config.js
│   │   ├── criar.js
│   │   └── ping.js
│   ├── set/             # Comandos para definir configurações
│   │   ├── perms.js
│   │   ├── setdono.js
│   │   └── setpainel.js
│   └── utilidades/      # Comandos de utilidades gerais
│       ├── adv.js
│       ├── botinfo.js
│       ├── clear.js
│       ├── consultar.js
│       ├── criarembed.js
│       ├── deletealltickets.js
│       ├── distintivo.js
│       ├── edital.js
│       ├── filtrar.js
│       ├── hora.js
│       ├── horas.js
│       ├── lock.js
│       ├── medalhas.js
│       ├── paineis.js
│       ├── perfil.js
│       ├── reiniciar.js
│       ├── say.js
│       ├── setid.js
│       ├── solicitarset.js
│       └── unlock.js
├── events/              # Handlers de eventos do Discord
│   ├── abrir-ticket.js
│   ├── assumir.js
│   ├── botconfig.js
│   ├── config.js
│   ├── logsSystem.js
│   ├── paineis.js
│   ├── setpainel.js
│   ├── sistemaavalia.js
│   ├── ticket-finalizar.js
│   └── ticket.js
├── handler/             # Sistema de carregamento de comandos
│   ├── buttons/         # Handlers de botões
│   │   ├── setcore.js
│   │   ├── setfox.js
│   │   ├── setmap.js
│   │   ├── setrec.js
│   │   └── setuni.js
│   ├── index.js
│   └── interactionCreate.js
├── json/                # Arquivos de dados JSON
│   ├── botconfig.json
│   ├── cargos.json
│   ├── configbot.json
│   ├── data_ticket.json
│   ├── emojis.json
│   ├── filtros.json
│   ├── idmap.json
│   ├── perms.json
│   ├── setcargo.json
│   ├── setcargo_core.json
│   ├── setcargo_uni.json
│   ├── tickets.json
│   └── ups.json
├── config.json          # Configuração do dono e senha
├── token.json           # Token do bot
├── index.js             # Arquivo principal
├── package.json         # Dependências do projeto
└── README.md            # Este arquivo
```

---

## Comandos do Bot

### Comandos de Configuração (`/config`)

#### `/ping`
- **Descrição**: Testa se o bot está respondendo (apenas para o owner)
- **Permissão**: Owner do bot
- **Uso**: `/ping`

#### `/botconfig`
- **Descrição**: Configurações avançadas do bot
- **Permissão**: Administrador
- **Uso**: `/botconfig`

#### `/config`
- **Descrição**: Menu de configuração principal
- **Permissão**: Administrador
- **Uso**: `/config`

#### `/criar`
- **Descrição**: Criar novos painéis e sistemas
- **Permissão**: Administrador
- **Uso**: `/criar`

---

### Comandos de Utilidades (`/`)

#### `/adv`
- **Descrição**: Registra uma advertência para um oficial
- **Permissão**: Alto Escalão
- **Uso**: `/adv`
- **Funcionalidade**:
  - Abre um modal para preencher dados da advertência
  - Envia embed no canal de advertências
  - Adiciona cargo de advertência ao membro
  - Tenta enviar DM ao membro advertido
- **Configuração Manual**:
  - Arquivo: `Comandos/utilidades/adv.js`
  - Linha 16: `ALTO_ESCALAO_ID` - ID do cargo que pode usar o comando
  - Linha 62: `canalAdvId` - ID do canal onde as advertências são registradas
  - Linhas 67-72: IDs dos cargos de advertência

#### `/botinfo`
- **Descrição**: Mostra informações sobre o bot
- **Permissão**: Todos
- **Uso**: `/botinfo`

#### `/clear`
- **Descrição**: Limpa mensagens de um canal
- **Permissão**: Gerenciar Canais
- **Uso**: `/clear quantidade:[número]`
- **Exemplo**: `/clear quantidade:50`
- **Limite**: 0 a 2000 mensagens

#### `/consultar`
- **Descrição**: Verifica se membros de um cargo possuem os cursos necessários
- **Permissão**: Todos
- **Uso**: `/consultar cursos cargo:[@cargo]`
- **Configuração Manual**:
  - Arquivo: `Comandos/utilidades/consultar.js`
  - Linhas 26-36: Array com IDs dos cargos de cursos obrigatórios

#### `/criarembed`
- **Descrição**: Cria embeds personalizadas
- **Permissão**: Administrador
- **Uso**: `/criarembed`

#### `/deletealltickets`
- **Descrição**: Deleta todos os tickets do servidor
- **Permissão**: Administrador
- **Uso**: `/deletealltickets`
- **ATENÇÃO**: Este comando é irreversível!

#### `/distintivo`
- **Descrição**: Sistema independente para alterar distintivo no apelido
- **Permissão**: Todos (no canal específico)
- **Uso**: Executar o arquivo standalone `distintivo.js`
- **Configuração Manual**:
  - Arquivo: `Comandos/utilidades/distintivo.js`
  - Linha 4: `TOKEN` - Token do bot
  - Linha 5: `ID_CANAL_LOGS` - Canal onde os logs são enviados
  - Linha 6: `ID_CANAL_PERMITIDO` - Canal onde o comando pode ser usado
- **Comando de uso**: `!distintivo [novo_número]`
- **Exemplo**: `!distintivo 100`

#### `/edital`
- **Descrição**: Sistema independente para gerenciar editais de unidades
- **Permissão**: Administrador
- **Uso**: Executar o arquivo standalone `edital.js`
- **Configuração Manual**:
  - Arquivo: `Comandos/utilidades/edital.js`
  - Linha 4: `TOKEN` - Token do bot
  - Linhas 7-13: `CANAIS_EDITAL` - IDs dos canais de cada unidade
  - Linha 16: `CARGO_ID` - ID do cargo a ser mencionado
- **Comandos de uso**:
  - `!edital <unidade> <data> <link>` - Abre edital
  - `!fedital <unidade>` - Fecha edital
- **Unidades disponíveis**: interceptor, sat, gtm, marshal, goe
- **Exemplo**: `!edital interceptor 25/12/2024 https://forms.gle/exemplo`

#### `/filtrar`
- **Descrição**: Filtra membros de um cargo que não possuem cargos específicos
- **Permissão**: Alto Escalão ou Segundo Escalão
- **Uso**: `/filtrar grupo:[grupo] cargo:[@cargo]`
- **Grupos disponíveis**:
  - Laudos e Vacinas
  - Cursos M.A.P
  - Cursos CORE
- **Configuração Manual**:
  - Arquivo: `json/filtros.json`
  - `ID_DO_CARGO_PERMITIDO`: IDs dos cargos que podem usar o comando
  - `laudo_vacina`: IDs dos cargos de laudo/vacina
  - `map`: IDs dos cargos de cursos M.A.P
  - `core`: IDs dos cargos de cursos CORE

#### `/hora`
- **Descrição**: Sistema de contagem de horas por patente
- **Permissão**: Alto Escalão ou Segundo Escalão
- **Uso**: Executar o arquivo standalone `hora.js`
- **Configuração Manual**:
  - Arquivo: `Comandos/utilidades/hora.js`
  - Linha 8: `TOKEN` - Token do bot
  - Linha 9: `ID_CANAL_BATE_PONTO` - Canal de bate-ponto
  - Linha 10: `CARGO1` - ID do cargo Alto Escalão
  - Linha 11: `CARGO2` - ID do cargo Segundo Escalão
- **Comando de uso**: `!horas @cargo DD/MM/AAAA DD/MM/AAAA`
- **Exemplo**: `!horas @Soldado 01/01/2024 31/01/2024`

#### `/horas`
- **Descrição**: Relatório de horas de todos os oficiais
- **Permissão**: Alto Escalão ou Segundo Escalão
- **Uso**: Executar o arquivo standalone `horas.js`
- **Configuração Manual**:
  - Arquivo: `Comandos/utilidades/horas.js`
  - Linha 8: `TOKEN` - Token do bot
  - Linha 9: `ID_CANAL_BATE_PONTO` - Canal de bate-ponto
  - Linha 10: `CARGOS_PERMITIDOS` - Array de IDs dos cargos permitidos
- **Comando de uso**: `!relatorio DD/MM/AAAA DD/MM/AAAA`
- **Exemplo**: `!relatorio 01/01/2024 31/01/2024`

#### `/lock`
- **Descrição**: Bloqueia o canal atual
- **Permissão**: Gerenciar Canais
- **Uso**: `/lock`

#### `/medalhas`
- **Descrição**: Sistema de medalhas por reação
- **Permissão**: Sistema automático
- **Uso**: Executar o arquivo standalone `medalhas.js`
- **Configuração Manual**:
  - Arquivo: `Comandos/utilidades/medalhas.js`
  - Linha 130: `TOKEN` - Token do bot
  - Linhas 14-79: `cargosPermitidos` - Array com IDs de todas as medalhas
  - Linha 82: `CARGO_EXTRA` - ID do cargo "divisão medalhas"
  - Linha 85: `ID_CANAL_SOLICITACAO` - Canal de solicitação de medalhas
- **Funcionamento**:
  - Alguém menciona um cargo de medalha no canal de solicitação
  - Admin reage com ✅
  - O bot adiciona a medalha ao autor da mensagem

#### `/paineis`
- **Descrição**: Gerencia painéis do servidor
- **Permissão**: Administrador
- **Uso**: `/paineis`

#### `/perfil`
- **Descrição**: Exibe perfil completo de um oficial
- **Permissão**: Todos (no canal específico)
- **Uso**: Executar o arquivo standalone `perfil.js`
- **Configuração Manual**:
  - Arquivo: `Comandos/utilidades/perfil.js`
  - Linha 9: `TOKEN` - Token do bot
  - Linha 10: `ID_CANAL_BATE_PONTO` - Canal de bate-ponto
  - Linhas 14-28: `PATENTES` - Array com IDs e nomes das patentes
  - Linhas 30-37: `UNIDADES` - Array com IDs e nomes das unidades
  - Linhas 39-47: `CURSOS` - Array com IDs e nomes dos cursos
  - Linhas 49-54: `ADVERTENCIAS` - Array com IDs e nomes das advertências
  - Linha 112: Canal onde o comando pode ser usado
  - Linha 141: ID do cargo de laudo/vacina
- **Comando de uso**: `!perfil`
- **Requisito**: Usuário deve ter vinculado seu ID (passaporte na cidade) com `/setid`

#### `/reiniciar`
- **Descrição**: Reinicia o bot usando PM2
- **Permissão**: Usuários específicos
- **Uso**: Executar o arquivo standalone `reiniciar.js`
- **Configuração Manual**:
  - Arquivo: `Comandos/utilidades/reiniciar.js`
  - Linha 4: `TOKEN` - Token do bot
  - Linha 24: `autorizadoIDs` - Array com IDs dos usuários autorizados
- **Comando de uso**: `!reiniciar`

#### `/say`
- **Descrição**: Envia mensagem personalizada com botões
- **Permissão**: Administrador
- **Uso**: `/say channel:[#canal]`

#### `/setid`
- **Descrição**: Vincula ID do jogo (passaporte) ao Discord
- **Permissão**: Todos (no canal específico)
- **Uso**: Executar o arquivo standalone `setid.js`
- **Configuração Manual**:
  - Arquivo: `Comandos/utilidades/setid.js`
  - Linha 5: `TOKEN` - Token do bot
  - Linha 6: `ID_CANAL_PERMITIDO` - Canal onde o comando pode ser usado
- **Comando de uso**: `!setid [número_id]`
- **Exemplo**: `!setid 60`

#### `/solicitarset`
- **Descrição**: Solicita setagem de cargo/unidade
- **Permissão**: Todos
- **Uso**: `/solicitarset`

#### `/unlock`
- **Descrição**: Desbloqueia o canal atual
- **Permissão**: Gerenciar Canais
- **Uso**: `/unlock`

---

### Comandos de Set (`/set`)

#### `/perms`
- **Descrição**: Gerencia permissões de comandos
- **Permissão**: Owner
- **Uso**: `/perms`

#### `/setdono`
- **Descrição**: Define o dono do bot
- **Permissão**: Owner
- **Uso**: `/setdono`

#### `/setpainel`
- **Descrição**: Configura painéis de setagem
- **Permissão**: Administrador
- **Uso**: `/setpainel`

---

## Configurações Manuais

### Arquivos Standalone (Comandos com TOKEN próprio)

**AVISO**: Dentro da Comandos/utilidades contém sistemas de horas, perfil e afins, cada arquivo (listado abaixo) possui a configuração de TOKEN separada, caso o processo principal caia (ou quebre com alguma alteração sua) essas funções podem ser iniciadas de forma independente - Você pode configurar para utilizar o token.json caso queira.

1. **distintivo.js** - Sistema de alterar distintivo
2. **edital.js** - Sistema de editais
3. **hora.js** - Horas por patente
4. **horas.js** - Relatório de horas
5. **medalhas.js** - Sistema de medalhas
6. **perfil.js** - Perfil de oficial
7. **reiniciar.js** - Reiniciar bot
8. **setid.js** - Vincular ID

Após configurar o seu TOKEN nos arquivos indicados acima e iniciar o `index.js` na raiz, todos os módulos serão executados automaticamente no mesmo terminal — **não é preciso iniciar cada um separadamente.**


### Configuração de IDs de Cargos/Canais

#### Como obter IDs no Discord:

1. Ative o **Modo Desenvolvedor** no Discord:
   - Configurações > Avançado > Modo Desenvolvedor (ativar)

2. Para obter ID de canal:
   - Clique com botão direito no canal
   - Selecione "Copiar ID"

3. Para obter ID de cargo:
   - Configurações do Servidor > Cargos
   - Clique com botão direito no cargo
   - Selecione "Copiar ID"

4. Para obter ID de usuário:
   - Clique com botão direito no usuário
   - Selecione "Copiar ID"

#### Arquivos que precisam de configuração manual:

##### 1. ``json/filtros.json``
```json
{
  "ID_DO_CARGO_PERMITIDO": ["ID_CARGO_1", "ID_CARGO_2"],
  "laudo_vacina": ["ID_CARGO_LAUDO"],
  "map": ["ID_CURSO_1", "ID_CURSO_2", "..."],
  "core": ["ID_CURSO_CORE_1", "ID_CURSO_CORE_2"]
}
```

##### 2. ``Comandos/utilidades/adv.js``
- Linha 16: ID do cargo Alto Escalão
- Linha 62: ID do canal de advertências
- Linhas 67-72: IDs dos cargos de advertência

##### 3. ``Comandos/utilidades/consultar.js``
- Linhas 26-36: IDs dos cargos de cursos obrigatórios

##### 4. ``Comandos/utilidades/distintivo.js``
- Linha 5: ID do canal de logs
- Linha 6: ID do canal permitido

##### 5. ``Comandos/utilidades/edital.js``
- Linhas 7-13: IDs dos canais de cada unidade
- Linha 16: ID do cargo a ser mencionado

##### 6. ``Comandos/utilidades/hora.js`` e ``horas.js``
- ID do canal de bate-ponto
- IDs dos cargos permitidos

##### 7. ``Comandos/utilidades/medalhas.js``
- Linhas 14-79: IDs de todas as medalhas
- Linha 82: ID do cargo "divisão medalhas"
- Linha 85: ID do canal de solicitação

##### 8. ``Comandos/utilidades/perfil.js``
- IDs de todas as patentes, unidades, cursos e advertências
- Linha 112: ID do canal permitido
- Linha 141: ID do cargo laudo/vacina

##### 9. ``Comandos/utilidades/ping.js``
- Linha 9: ID do owner

##### 10. ``Comandos/utilidades/reiniciar.js``
- Linha 24: IDs dos usuários autorizados

##### 11. ``Comandos/utilidades/setid.js``
- Linha 6: ID do canal permitido

##### 12. ``index.js`` (Arquivo principal)
- Linhas 170-180: IDs dos canais observados para reações
- Linha 187: ID do canal de confirmação
- Linha 197: ID do canal de laudo
- Linha 198: ID do cargo de laudo

---

## Sistemas Especiais

### Sistema de Tickets

O bot possui um sistema completo de tickets com:
- Abertura de tickets por botões
- Sistema de assunção (assumir tickets)
- Finalização com transcrição HTML
- Sistema de avaliação
- Logs detalhados

### Sistema de Bate-Ponto

Registra horários de entrada/saída dos oficiais:
- Calcula tempo total de serviço
- Gera relatórios por período
- Filtra por patente/cargo
- Integração com perfil

### Sistema de Reações

Funcionalidades automáticas por reação:
- ✅ em laudo: adiciona cargo
- ✅ em solicitação de medalha: adiciona medalha
- 📋 em canais específicos: confirma atualização de planilha

### Sistema de Sugestões

Quando ativado no botconfig:
- Reage automaticamente em canal de sugestões
- Cria thread para discussão
- Adiciona emojis de aprovação/reprovação

---

## Solução de Problemas

### Bot não inicia

1. Verifique se o Node.js está instalado:
   ```bash
   node --version
   ```
   Deve ser v16.9.0 ou superior

2. Verifique se as dependências estão instaladas:
   ```bash
   npm install
   ```

3. Verifique o token no `token.json`

4. Verifique erros no console

### Comandos não aparecem

1. Aguarde alguns minutos (Discord pode demorar para sincronizar)
2. Reinicie o bot
3. Verifique se o bot tem permissões de administrador
4. Verifique se o bot está em mais de um servidor (ele sai automaticamente de servidores extras)

### Comandos standalone não funcionam

1. Verifique se você configurou o TOKEN em cada arquivo
2. Execute cada arquivo standalone separadamente:
   ```bash
   node Comandos/utilidades/[arquivo].js
   ```
3. Verifique os IDs de canais/cargos configurados

### Erro de permissões

1. Certifique-se que o bot tem:
   - Permissão de Administrador OU
   - Permissões específicas: Gerenciar Cargos, Gerenciar Canais, Gerenciar Mensagens, etc.

2. Verifique a hierarquia de cargos:
   - O cargo do bot deve estar acima dos cargos que ele vai gerenciar

### Banco de dados corrompido

Se os arquivos JSON na pasta `/json/` estiverem corrompidos:

1. Pare o bot
2. Faça backup dos arquivos
3. Corrija o formato JSON ou restaure de um backup
4. Reinicie o bot

### Comandos de horas não calculam corretamente

1. Verifique se o formato de data/hora no canal de bate-ponto está correto
2. Verifique se o ID do canal de bate-ponto está configurado
3. Verifique se os usuários vincularam seus IDs com `!setid`

---

## ⚖️ Licença e Créditos

- Este bot foi desenvolvido para uso em servidores de GTA V RP da Polícia. Pode ser adaptado para qualquer coisa, basta ter criatividade.
- A venda deste BOT é **proibida**, exceto se você o utilizar apenas como base para outro nicho ou desenvolver novas funcionalidades.

**Desenvolvedor**
- Lukas (lksdgn) / "Krozz"

**Tecnologias principais:**
- Discord.js v14
- Node.js
- wio.db
- node-cron

---

**Data de criação desta documentação:** 02-11-2025

**Versão da documentação:** 1.0

---

## Conclusão

Este bot é uma solução completa e robusta para gerenciar servidores de roleplay policial no Discord. Com mais de 20 comandos, múltiplos sistemas integrados e automação avançada, ele oferece todas as ferramentas necessárias para administrar recrutamento, treinamento, unidades especiais, controle de horas e muito mais.

**Lembre-se:** Configure TODOS os IDs antes de usar em produção e sempre faça backups regulares!

Divirta-se.
