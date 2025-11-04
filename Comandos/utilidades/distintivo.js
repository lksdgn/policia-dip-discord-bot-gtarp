import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dayjs from 'dayjs';

const TOKEN = 'SEU_TOKEN';
const ID_CANAL_LOGS = '1386919790542852096';
const ID_CANAL_PERMITIDO = '1386919667356139560';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember, Partials.User],
});

client.once('ready', () => {
  console.log(`Bot logado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!distintivo')) {
    // Verificando se está no canal permitido
    if (message.channel.id !== ID_CANAL_PERMITIDO) {
      const aviso = await message.reply('❌ Este comando só pode ser usado no canal correto, <#1386919667356139560>.');
      setTimeout(() => aviso.delete().catch(() => {}), 120000);
      setTimeout(() => message.delete().catch(() => {}), 120000);
      return;
    }

    const args = message.content.trim().split(' ');
    const novoDistintivo = args[1];

    if (!novoDistintivo || isNaN(novoDistintivo)) {
      const erroMsg = await message.reply('❌ Por favor, informe um número válido para o novo distintivo. Exemplo: `!distintivo 100`');
      setTimeout(() => erroMsg.delete().catch(() => {}), 120000);
      setTimeout(() => message.delete().catch(() => {}), 120000);
      return;
    }

    try {
      const membro = await message.guild.members.fetch(message.author.id);
      const apelidoAtual = membro.nickname || membro.user.username;

      const partes = apelidoAtual.split('|');
      if (partes.length < 2) {
        const erroMsg = await message.reply('❌ Seu apelido precisa estar no formato `Número | Nome`. Corrija antes de usar o comando.');
        setTimeout(() => erroMsg.delete().catch(() => {}), 120000);
        setTimeout(() => message.delete().catch(() => {}), 120000);
        return;
      }

      const nome = partes.slice(1).join('|').trim();
      const novoApelido = `${novoDistintivo} | ${nome}`;

      // Alterar o apelido
      await membro.setNickname(novoApelido).catch((err) => {
        console.error('Erro ao alterar apelido:', err);
        throw new Error('PERMISSAO');
      });

      // Log no canal de logs
      const canalLogs = await client.channels.fetch(ID_CANAL_LOGS);
      if (canalLogs && canalLogs.isTextBased()) {
        canalLogs.send(
          `📢 O usuário <@${membro.id}> alterou seu distintivo de \`${apelidoAtual}\` para \`${novoApelido}\` às ${dayjs().format('DD/MM/YYYY HH:mm')}.`
        );
      }

      // Resposta de sucesso
      const resposta = await message.reply(`✅ Distintivo alterado com sucesso para: \`${novoApelido}\``);
      setTimeout(() => resposta.delete().catch(() => {}), 120000);

    } catch (err) {
      if (err.message === 'PERMISSAO') {
        const erroMsg = await message.reply('❌ O bot não tem permissão para alterar seu apelido. Verifique a hierarquia de cargos.');
        setTimeout(() => erroMsg.delete().catch(() => {}), 120000);
      } else {
        console.error('Erro geral:', err);
        const erroMsg = await message.reply('❌ Ocorreu um erro inesperado ao tentar alterar seu distintivo.');
        setTimeout(() => erroMsg.delete().catch(() => {}), 120000);
      }
    }

    // Apagar a mensagem original de quem usou o comando
    setTimeout(() => message.delete().catch(() => {}), 120000);
  }
});

client.login(TOKEN);
