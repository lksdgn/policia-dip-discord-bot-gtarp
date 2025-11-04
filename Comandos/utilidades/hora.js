const { Client, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(duration);
dayjs.extend(customParseFormat);

const TOKEN = 'SEU_TOKEN';
const ID_CANAL_BATE_PONTO = '1360756207996108924';
const CARGO1 = '1360756205206896880'; // Alto Escalão
const CARGO2 = '1360756205206896874'; // Segundo Escalão

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

function parseTempo(tempoStr) {
    tempoStr = tempoStr.toLowerCase().replace(/\*/g, '').replace(/ e /g, ' ').trim();

    const hMatch = tempoStr.match(/(\d+)\s*hr/);
    const mMatch = tempoStr.match(/(\d+)\s*min/);
    const sMatch = tempoStr.match(/(\d+)\s*seg/);

    const horas = hMatch ? parseInt(hMatch[1]) : 0;
    const minutos = mMatch ? parseInt(mMatch[1]) : 0;
    const segundos = sMatch ? parseInt(sMatch[1]) : 0;

    return dayjs.duration({ hours: horas, minutes: minutos, seconds: segundos });
}

async function fetchMessagesBetween(channel, afterTimestamp, beforeTimestamp) {
    let allMessages = [];
    let lastId = null;
    let done = false;

    while (!done) {
        const options = { limit: 100 };
        if (lastId) options.before = lastId;

        const messages = await channel.messages.fetch(options);
        if (messages.size === 0) break;

        for (const msg of messages.values()) {
            const ts = msg.createdTimestamp;
            if (ts >= afterTimestamp && ts <= beforeTimestamp) {
                allMessages.push(msg);
            }
            lastId = msg.id;
        }

        const lastMsg = messages.last();
        if (lastMsg && lastMsg.createdTimestamp < afterTimestamp) {
            done = true;
        }
    }

    return allMessages;
}

client.once('ready', () => {
    console.log(`sistema de contagem de horas por patente carregado (krozz lindo)!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!horas')) {
        if (!message.member.roles.cache.has(CARGO1) && !message.member.roles.cache.has(CARGO2)) {
            await message.reply('❌ Você não tem permissão para usar este comando.');
            return;
        }

        const partes = message.content.trim().split(' ');
        if (partes.length !== 4 || !message.mentions.roles.size) {
            await message.reply('❌ Use o formato: `!horas @cargo DD/MM/AAAA DD/MM/AAAA`');
            return;
        }

        const cargoMencionado = message.mentions.roles.first();
        const dataInicio = dayjs(partes[2], 'DD/MM/YYYY');
        const dataFim = dayjs(partes[3], 'DD/MM/YYYY').endOf('day');

        if (!dataInicio.isValid() || !dataFim.isValid()) {
            await message.reply('❌ Datas inválidas. Use o formato DD/MM/AAAA.');
            return;
        }

        await message.reply(`⏳ Buscando registros de membros com o cargo ${cargoMencionado} entre ${partes[2]} e ${partes[3]}...`);

        const canal = await client.channels.fetch(ID_CANAL_BATE_PONTO);
        if (!canal) {
            await message.reply('❌ Canal de bate-ponto não encontrado.');
            return;
        }

        await message.guild.members.fetch();

        const membrosComCargo = cargoMencionado.members;
        const idsMap = new Map();

        membrosComCargo.forEach(member => {
            const nome = member.displayName;
            console.log(`[DEBUG] Verificando apelido: ${nome}`);
            const match = nome.match(/\|\s*([^|]+)\s*\|\s*(\d+)$/);
            if (match) {
                const nomeRP = match[1].trim();
                const idRP = match[2].trim();
                idsMap.set(idRP, nomeRP);
                console.log(`[DEBUG] Encontrado ID: ${idRP} | Nome: ${nomeRP}`);
            }
        });

        if (idsMap.size === 0) {
            await message.reply('❌ Nenhum membro com ID de jogo válido encontrado no cargo.');
            return;
        }

        const mensagens = await fetchMessagesBetween(canal, dataInicio.valueOf(), dataFim.valueOf());
        const registros = {};

        for (const msg of mensagens) {
            if (!msg.embeds.length) continue;

            const embed = msg.embeds[0];
            let texto = embed.description || '';
            if (!texto) {
                texto = embed.fields.map(f => `${f.name}: ${f.value}`).join('\n');
            }

            const idMatch = texto.match(/\[ID:\s*(\d+)\]/);
            const tempoMatch = texto.match(/Tempo total em serviço:\s*([\d\w\s\*]+)/i);
            if (!idMatch || !tempoMatch) continue;

            const idRP = idMatch[1];
            if (!idsMap.has(idRP)) continue;

            const tempo = parseTempo(tempoMatch[1]);

            if (registros[idRP]) {
                registros[idRP].tempo = registros[idRP].tempo.add(tempo);
            } else {
                registros[idRP] = {
                    nome: idsMap.get(idRP),
                    tempo
                };
            }
        }

        if (Object.keys(registros).length === 0) {
            await message.reply("❌ Nenhum tempo registrado para esse grupo nesse período.");
            return;
        }

        const registrosOrdenados = Object.entries(registros).sort((a, b) => {
            return b[1].tempo.asSeconds() - a[1].tempo.asSeconds();
        });

        const embed = new EmbedBuilder()
            .setTitle(`📊 Relatório de Horas ${cargoMencionado.name} - ${partes[2]} até ${partes[3]}`)
            .setColor('Blue');

        for (const [idRP, { nome, tempo }] of registrosOrdenados) {
            const horas = Math.floor(tempo.asHours());
            const minutos = Math.floor(tempo.asMinutes()) % 60;

            embed.addFields({
                name: `${nome} - ${idRP}`,
                value: `**${horas}** horas e **${minutos}** minutos`,
                inline: false
            });
        }

        await message.channel.send({ embeds: [embed] });
    }
});

client.login(TOKEN);
