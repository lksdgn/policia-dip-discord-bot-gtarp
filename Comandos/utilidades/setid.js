const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = './json/idmap.json'; // Arquivo onde os IDs serão salvos

const TOKEN = 'SEU_TOKEN';
const ID_CANAL_PERMITIDO = '1384278098220023818'; 

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Bot do !setid online!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!setid')) return;

  // Verificar se está no canal permitido
  if (message.channel.id !== ID_CANAL_PERMITIDO) {
    const reply = await message.reply(`❌ Este comando só pode ser usado no canal autorizado <#${ID_CANAL_PERMITIDO}>.`);
    setTimeout(() => {
      message.delete().catch(() => {});
      reply.delete().catch(() => {});
    }, 60 * 1000);
    return;
  }

  const args = message.content.trim().split(/\s+/);
  if (args.length !== 2) {
    const reply = await message.reply('❌ Uso incorreto. Exemplo: `!setid 60`');
    setTimeout(() => {
      message.delete().catch(() => {});
      reply.delete().catch(() => {});
    }, 60 * 1000);
    return;
  }

  const idRP = args[1];
  if (isNaN(idRP)) {
    const reply = await message.reply('❌ O ID deve ser um número válido.');
    setTimeout(() => {
      message.delete().catch(() => {});
      reply.delete().catch(() => {});
    }, 60 * 1000);
    return;
  }

  let idmap = {};
  if (fs.existsSync(path)) {
    try {
      idmap = JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch (err) {
      console.error('Erro ao ler idmap.json:', err);
      const reply = await message.reply('❌ Ocorreu um erro ao acessar os dados.');
      setTimeout(() => {
        message.delete().catch(() => {});
        reply.delete().catch(() => {});
      }, 60 * 1000);
      return;
    }
  }

  // Verificar se o ID RP já está cadastrado por outro usuário
  const idJaCadastrado = Object.entries(idmap).find(([discordId, rp]) => rp === idRP && discordId !== message.author.id);
  if (idJaCadastrado) {
    const reply = await message.reply('❌ Este ID já está cadastrado por outro usuário.');
    setTimeout(() => {
      message.delete().catch(() => {});
      reply.delete().catch(() => {});
    }, 60 * 1000);
    return;
  }

  // Salvar o ID vinculado ao Discord ID
  idmap[message.author.id] = idRP;

  try {
    fs.writeFileSync(path, JSON.stringify(idmap, null, 2));
    const reply = await message.reply(`✅ Seu ID foi salvo como **${idRP}**.`);
    setTimeout(() => {
      message.delete().catch(() => {});
      reply.delete().catch(() => {});
    }, 60 * 1000);
  } catch (err) {
    console.error('Erro ao salvar idmap.json:', err);
    const reply = await message.reply('❌ Não foi possível salvar seu ID.');
    setTimeout(() => {
      message.delete().catch(() => {});
      reply.delete().catch(() => {});
    }, 60 * 1000);
  }
});

client.login(TOKEN);
