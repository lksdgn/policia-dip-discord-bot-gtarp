const Discord = require("discord.js");
const axios = require("axios");
const config = require("./token.json");

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMembers,
    '32767'
  ]
});

client.slashCommands = new Discord.Collection();

require('./handler')(client);

const interactionHandler = require('./handler/interactionCreate.js');

client.on('interactionCreate', async interaction => {
  try {
    await interactionHandler(interaction, client);

    if (interaction.isCommand()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd) return interaction.reply({ content: 'Erro: comando não encontrado.', ephemeral: true });
      interaction.member = interaction.guild.members.cache.get(interaction.user.id);
      await cmd.run(client, interaction);
    }

    if (interaction.isAutocomplete()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd) return;
      try {
        await cmd.autocomplete(interaction);
      } catch (err) {
        console.error('Erro autocomplete:', err);
      }
    }

    const outrosHandlers = [
      require('./events/botconfig'),
      require('./events/config'),
      require('./events/setpainel'),
      require('./events/paineis'),
      require('./events/ticket'),
      require('./events/sistemaavalia'),
      require('./events/abrir-ticket'),
      require('./events/ticket-finalizar'),
      require('./events/assumir'),
      require('./events/logsSystem')
    ];
    for (const handler of outrosHandlers) {
      if (typeof handler.run === 'function') {
        await handler.run(interaction, client);
      }
    }

  } catch (error) {
    console.error('Erro no interactionCreate:', error);
  }
});

client.on('ready', () => {
  console.log(`🎉 Ligado com sucesso em ${client.user.username} com acesso à ${client.users.cache.size} membros`);
  client.user.setPresence({
    activities: [{
      name: `DIP | ONE`,
      type: Discord.ActivityType["Watching"],
      url: "https://discord.gg/onerp"
    }]
  });

  if (client.guilds.cache.size > 2) {
    let firstGuild = true;
    client.guilds.cache.forEach(guild => {
      if (firstGuild) {
        firstGuild = false;
      } else {
        guild.leave()
          .then(() => console.log(`Saiu do servidor ${guild.name}`))
          .catch(console.error);
      }
    });
  }
});

client.on('guildCreate', guild => {
  console.log(`Bot entrou em um novo servidor: ${guild.name}.`);
  if (client.guilds.cache.size > 2) {
    guild.leave()
      .then(() => console.log(`Saiu do servidor ${guild.name}`))
      .catch(console.error);
  }
});

client.on('messageCreate', async (msg) => {
  const { JsonDatabase } = require("wio.db");
  const dbc = new JsonDatabase({ databasePath: "./json/botconfig.json" });
  const db = new JsonDatabase({ databasePath: "./json/data_ticket.json" });
  if (db.get(`${msg.channel.id}`)) {
    const user = msg.author;
    if (user.bot) return;

    let users = db.get(`${msg.channel.id}.logsUsers`);
    const id = users.find(element => element.id === user.id);
    if (!id) {
      db.push(`${msg.channel.id}.logsUsers`, {
        name: user.username,
        avatar: user.displayAvatarURL({ dynamic: true }),
        id: user.id
      });
    }
    if (msg.reference) {
      const orgmsg = await msg.channel.messages.fetch(msg.reference.messageId);
      if (orgmsg.author.bot) return;
      db.push(`${msg.channel.id}.logs`, {
        id: user.id,
        msg: msg.content,
        date: new Date(),
        resp: true,
        respContent: orgmsg.content
      });
      return;
    }
    db.push(`${msg.channel.id}.logs`, {
      id: user.id,
      msg: msg.content,
      date: new Date(),
      resp: false
    });
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const { JsonDatabase } = require("wio.db");
  const dbc = new JsonDatabase({ databasePath: "./json/botconfig.json" });
  if (dbc.get(`sugest.sistema`) !== "ON") return;

  const channelId = dbc.get(`sugest.channel`);
  if (message.channel.id === channelId) {
    const channel = client.channels.cache.get(channelId);
    await message.react(dbc.get(`sugest.certo`));
    await message.react(dbc.get(`sugest.errado`));
    const user = message.author;
    const thread = await message.startThread({
      name: `Sugestão de ${user.displayName}`,
      autoArchiveDuration: 10080,
      reason: `Sugestão de ${user.displayName}`
    });
    await thread.send(`Olá ${user} 👋, obrigado por enviar sua sugestão! Caso necessário, explique melhor a mesma.`);
  }
});

// ✅ Reação em canal específico => adiciona cargo ao AUTOR DA MENSAGEM
client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Erro ao buscar reação parcial:', error);
      return;
    }
  }

  const canaisObservados = [
    "1371239925919514654",
    "1374509048694571211",
    "1382158415035367484",
    "1360756206083506386",
    "1360756206674903071",
    "1360756206674903077",
    "1360756206674903074",
    "1360756206674903070",
    "1360756206481703065",
	"1386919790542852096"
  ];

  if (
    canaisObservados.includes(reaction.message.channel.id) &&
    reaction.emoji.name === "📋"
  ) {
    const canalConfirmacaoId = "1360756206481703063";
    const canalConfirmacao = await client.channels.fetch(canalConfirmacaoId);

    const dataMensagem = `<t:${Math.floor(reaction.message.createdTimestamp / 1000)}:F>`;

    canalConfirmacao.send({
      content: `Planilha atualizada com as informações de ${reaction.message.channel} referentes à ${dataMensagem}.`
    });
  }

  const canalAlvoId = "1360756206083506386"; // canal de laudo
  const cargoId = "1360756205118816259";    // cargo de laudo

  if (
    reaction.message.channel.id === canalAlvoId &&
    reaction.emoji.name === "✅"
  ) {
    try {
      const guild = reaction.message.guild;
      if (!guild) return;

      const autorDaMensagem = reaction.message.author;
      if (!autorDaMensagem || autorDaMensagem.bot) return;

      const member = await guild.members.fetch(autorDaMensagem.id);
      if (!member) return;

      if (!member.roles.cache.has(cargoId)) {
        await member.roles.add(cargoId);
        console.log(`Cargo adicionado para ${member.user.tag} (autor da mensagem) por reação ✅`);
      }
    } catch (error) {
      console.error('Erro ao adicionar cargo por reação ✅ ao autor da mensagem:', error);
    }
  }
});

client.login(config.token);

process.on('multipleResolutions', (type, reason, promise) => {
  console.log(`Err:\n` + type, promise, reason);
});
process.on('unhandledRejection', (reason, promise) => {
  console.log(`Err:\n` + reason, promise);
});
process.on('uncaughtException', (error, origin) => {
  console.log(`Err:\n` + error, origin);
});
process.on('uncaughtExceptionMonitor', (error, origin) => {
  console.log(`Err:\n` + error, origin);
});
