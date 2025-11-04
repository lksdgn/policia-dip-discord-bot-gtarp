const { Client, GatewayIntentBits } = require('discord.js');
const dayjs = require('dayjs');

const TOKEN = 'SEU_TOKEN'; 

// canais unidade
const CANAIS_EDITAL = {
  interceptor: '1382777576098889798',
  sat: '1382777594788839484',
  gtm: '1382777634311766228',
  marshal: '1382777617605726348',
  goe: '1386875711876497508',
};

// ID do cargo para menção
const CARGO_ID = '1360756205131268113';

// textos formatados
const MENSAGENS_EDITAL = {
  interceptor: (data, link) => 
    `**EDITAL – UNIDADE INTERCEPTOR**

Se você manda bem no volante e sonha em pilotar os veículos mais agressivos da cidade em nome da segurança dos cidadãos da One, essa é a sua chance: o edital da INTERCEPTOR está oficialmente aberto!

Requisitos:

- Excelente habilidade no P1;
- Boa modulação de rádio;
- Conhecimento dos principais pontos de referência da cidade;
- Ser SOLDADO ou superior;
- Ter pleno domínio de procedimentos de acompanhamento.

Para participar do processo seletivo, acesse o formulário: ${link}

O edital ficará aberto até o dia **${data}**.

Boa sorte a todos!`,

  sat: (data, link) =>
    `**EDITAL – UNIDADE SAT**

Se você gosta de pilotar e/ou atirar e sonha em operar os helicópteros mais ágeis e agressivos da cidade em nome da segurança dos cidadãos da One, essa é a sua chance: o edital da SAT está oficialmente aberto!

Requisitos:

- Excelente habilidade no P1 do helicóptero (para Piloto);
- Excelente precisão em disparos em movimento (para Atirador);
- Boa modulação de rádio;
- Conhecimento dos principais pontos de referência da cidade;
- Ser SOLDADO ou superior;
- Pleno domínio dos procedimentos de acompanhamento.

Para participar do processo seletivo, acesse o formulário: ${link}

O edital ficará aberto até o dia **${data}**.

Boa sorte a todos!`,

  gtm: (data, link) =>
    `**EDITAL – UNIDADE GTM**

Se você gosta de pilotar as motos mais ágeis e agressivas da cidade em nome da segurança dos cidadãos da One, essa é a sua chance: o edital da GTM está oficialmente aberto!

Requisitos:

- Excelente habilidade no P1;
- Boa modulação de rádio;
- Conhecimento dos principais pontos de referência da cidade;
- Ser SOLDADO ou superior;
- Pleno domínio dos procedimentos de acompanhamento.

Para participar do processo seletivo, acesse o formulário: ${link}

O edital ficará aberto até o dia **${data}**.

Boa sorte a todos!`,

  marshal: (data, link) =>
    `**Edital Marshal aberto!**

Para mais informações, fique atento aos canais oficiais.

O edital ficará aberto até o dia **${data}**.`,

goe: (data, link) =>
    `**EDITAL - UNIDADE GOE**

Se você é um oficial que gosta de confrontos armados e se destaca em situações de crise, o edital da GOE está oficialmente aberto. 
Preencha corretamente e aguarde as próximas orientações.

Requisitos:

- Ter conhecimentos gerais sobre ações e perímetros;
- Boa comunicação no uso da rádio;
- Manter conduta exemplar e demonstrar comprometimento.

Para participar do processo seletivo, acesse o formulário: ${link}

O edital ficará aberto até o dia **${data}**.

Boa sorte a todos!`,
};

// texto do edital fechado
const TEXTOS_FECHAMENTO = {
  interceptor: `**EDITAL – UNIDADE INTERCEPTOR**

Informamos que o processo seletivo da unidade INTERCEPTOR foi oficialmente encerrado.

Agradecemos a todos os interessados e desejamos sucesso a quem participou.

Entraremos em contato com os aprovados.

Fiquem atentos aos próximos editais e oportunidades!`,

  sat: `**EDITAL – UNIDADE SAT**

Informamos que o processo seletivo da unidade SAT foi oficialmente encerrado.

Agradecemos a todos os interessados e desejamos sucesso a quem participou.

Entraremos em contato com os aprovados.

Fiquem atentos aos próximos editais e oportunidades!`,

  gtm: `**EDITAL – UNIDADE GTM**

Informamos que o processo seletivo da unidade GTM foi oficialmente encerrado.

Agradecemos a todos os interessados e desejamos sucesso a quem participou.

Entraremos em contato com os aprovados.

Fiquem atentos aos próximos editais e oportunidades!`,

  marshal: `**Edital Marshal**

O processo seletivo da unidade Marshal foi oficialmente encerrado.

Entraremos em contato com os aprovados.

Agradecemos a todos os interessados e fiquem atentos às próximas oportunidades.`,

goe: `**Edital GOE**

O processo seletivo da unidade GOE foi oficialmente encerrado.

Entraremos em contato com os aprovados.

Agradecemos a todos os interessados e fiquem atentos às próximas oportunidades.`

};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log('sistema de edital carregado (krozz lindo)!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const args = message.content.trim().split(/\s+/);
  const cmd = args[0].toLowerCase();

  if (cmd === '!edital') {
    await message.delete().catch(() => {});

    if (args.length < 4) {
      const reply = await message.channel.send('❌ Formato inválido. Use: `!edital <unidade> <data> <link>`');
      setTimeout(() => reply.delete().catch(() => {}), 10000);
      return;
    }

    const unidade = args[1].toLowerCase();
    const data = args[2];
    const link = args.slice(3).join(' ');

    if (!CANAIS_EDITAL[unidade]) {
      const reply = await message.channel.send('❌ Unidade inválida. Use: `interceptor`, `sat`, `gtm`, `marshal`');
      setTimeout(() => reply.delete().catch(() => {}), 10000);
      return;
    }

    const canalEdital = await client.channels.fetch(CANAIS_EDITAL[unidade]).catch(() => null);
    if (!canalEdital) {
      const reply = await message.channel.send('❌ Canal da unidade não encontrado.');
      setTimeout(() => reply.delete().catch(() => {}), 10000);
      return;
    }

    // envia o edital no canal da unidade
    await canalEdital.send(MENSAGENS_EDITAL[unidade](data, link));

    // envia a menção do cargo abaixo da mensagem
    await canalEdital.send(`<@&${CARGO_ID}>`);

    const confirmMsg = await message.channel.send('✅ Edital enviado com sucesso!');
    setTimeout(() => {
      confirmMsg.delete().catch(() => {});
    }, 10000);
  }

  else if (cmd === '!fedital') {
    await message.delete().catch(() => {});

    if (args.length < 2) {
      const reply = await message.channel.send('❌ Formato inválido. Use: `!fedital <unidade>`');
      setTimeout(() => reply.delete().catch(() => {}), 10000);
      return;
    }

    const unidade = args[1].toLowerCase();

    if (!CANAIS_EDITAL[unidade]) {
      const reply = await message.channel.send('❌ Unidade inválida. Use: `interceptor`, `sat`, `gtm`, `marshal`');
      setTimeout(() => reply.delete().catch(() => {}), 10000);
      return;
    }

    const canalEdital = await client.channels.fetch(CANAIS_EDITAL[unidade]).catch(() => null);
    if (!canalEdital) {
      const reply = await message.channel.send('❌ Canal da unidade não encontrado.');
      setTimeout(() => reply.delete().catch(() => {}), 10000);
      return;
    }

    // envia o texto de edital fechado no canal da unidade
    await canalEdital.send(TEXTOS_FECHAMENTO[unidade]);

    // envia a menção do cargo policia abaixo da mensagem
    await canalEdital.send(`<@&${CARGO_ID}>`);

    const confirmMsg = await message.channel.send('✅ Edital fechado com sucesso!');
    setTimeout(() => {
      confirmMsg.delete().catch(() => {});
    }, 10000);
  }
});

client.login(TOKEN);
