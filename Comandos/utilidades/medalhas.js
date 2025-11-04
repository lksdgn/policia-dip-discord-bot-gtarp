const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Reaction, Partials.Channel],
});

// IDs das medalhas permitidas
const cargosPermitidos = [
  '1360756205009506430',
'1360756205009506429',
'1360756205009506428',
'1360756205009506427',
'1360756205009506426',
'1360756205009506425',
'1360756205009506424',
'1360756204942659674',
'1360756204942659673',
'1360756204942659672',
'1360756204942659671',
'1360756204942659670',
'1360756204942659669',
'1360756204942659667',
'1360756204942659666',
'1360756204942659665',
'1360756204929945711',
'1360756204929945710',
'1360756204929945709',
'1360756204929945707',
'1360756204929945706',
'1360756204929945705',
'1360756204929945704',
'1360756204929945703',
'1360756204929945702',
'1360756204913037382',
'1360756204913037381',
'1360756204913037380',
'1360756204913037379',
'1360756204913037378',
'1360756204913037377',
'1360756204913037376',
'1360756204913037375',
'1360756204913037374',
'1360756204900450323',
'1360756204900450322',
'1360756204900450321',
'1360756204900450320',
'1360756204900450319',
'1360756204900450318',
'1360756204900450317',
'1360756204900450316',
'1360756204900450315',
'1360756204900450314',
'1360756204888002701',
'1360756204888002700',
'1360756204888002699',
'1360756204888002698',
'1360756204888002697',
'1360756204888002696',
'1360756204888002695',
'1360756204888002694',
'1360756204888002693',
'1360756204888002692',
'1360756204862705683',
'1360756204862705682',
'1360756204862705681',
'1360756204862705680',
'1360756204862705679',
'1360756204862705678',
'1360756204862705677',
'1360756204862705676',
'1360756204862705675',
'1360756204862705674'
];

// Cargo extra a ser adicionado sempre (divisão medalhas)
const CARGO_EXTRA = '1360756205009506431';

// ID do canal onde as mensagens com pedidos de medalha serão enviadas
const ID_CANAL_SOLICITACAO = '1360756207127625784';

client.on('ready', () => {
  console.log(`sistema de medalhas carregado (krozz lindo)`);
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;

  try {
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    const message = reaction.message;

    if (reaction.emoji.name !== '✅') return;
    if (!message.guild || message.channel.id !== ID_CANAL_SOLICITACAO) return;

    const membro = await message.guild.members.fetch(message.author.id).catch(() => null);
    if (!membro) return;

    const cargosParaAdicionar = message.mentions.roles.filter(role => cargosPermitidos.includes(role.id));

    // Se nenhum cargo válido foi mencionado
    if (cargosParaAdicionar.size === 0) {
      const aviso = await message.reply('⚠️ O cargo mencionado não está autorizado a ser setado por mim.');
      setTimeout(() => aviso.delete().catch(() => {}), 10000);
      return;
    }

    // Adiciona os cargos mencionados autorizados
    for (const [_, cargo] of cargosParaAdicionar) {
      await membro.roles.add(cargo).catch(() => {});
    }

    // Adiciona o cargo extra fixo
    await membro.roles.add(CARGO_EXTRA).catch(() => {});

    const confirmacao = await message.reply('✅ Medalhas setadas com sucesso! (essa mensagem será deletada em 10 segundos)');
    setTimeout(() => confirmacao.delete().catch(() => {}), 10000);
  } catch (err) {
    console.error('Erro ao aplicar cargos por reação:', err);
  }
});

client.login('SEU_TOKEN'); 
