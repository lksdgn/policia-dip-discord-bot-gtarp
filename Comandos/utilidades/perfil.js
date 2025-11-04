const { Client, GatewayIntentBits, EmbedBuilder, Partials } = require('discord.js');
const fs = require('fs');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(duration);
dayjs.extend(customParseFormat);

const TOKEN = 'SEU_TOKEN';
const ID_CANAL_BATE_PONTO = '1360756207996108924';
const UPS_FILE = './json/ups.json';
const IDMAP_FILE = './json/idmap.json';

const PATENTES = [
  { id: '1360756205219352687', nome: 'Comando' },
  { id: '1360756205206896879', nome: 'Sub Comando' },
  { id: '1360756205206896877', nome: 'Comissário' },
  { id: '1360756205206896876', nome: 'Delegado' },
  { id: '1360756205206896875', nome: 'Diretor' },
  { id: '1360756205206896873', nome: 'Coordenador' },
  { id: '1360756205206896872', nome: 'Inspetor Sênior' },
  { id: '1360756205198245903', nome: 'Escrivão' },
  { id: '1360756205198245902', nome: 'Agente Sênior' },
  { id: '1360756205198245901', nome: 'Agente Especial' },
  { id: '1360756205198245899', nome: 'Agente 1° Classe' },
  { id: '1360756205198245898', nome: 'Agente 2° Classe' },
  { id: '1360756205131268115', nome: 'Recruta' }
];

const UNIDADES = [
  { id: '1360756205118816264', nome: 'INTERCEPTOR' },
  { id: '1360756205118816265', nome: 'CORE' },
  { id: '1368588351527063695', nome: 'GOE' },
  { id: '1360756205118816263', nome: 'GTM' },
  { id: '1360756205118816262', nome: 'SAT' },
  { id: '1360756205118816261', nome: 'Marshal' }
];

const CURSOS = [
  { id: '1360756205089460369', nome: 'Sistema Prisional' },
  { id: '1360756205089460368', nome: 'Perseguição' },
  { id: '1360756205089460367', nome: 'Abordagem' },
  { id: '1360756205089460366', nome: 'Modulação na Central' },
  { id: '1360756205089460365', nome: 'Noções Básicas' },
  { id: '1360756205038997542', nome: 'Negociação Geral' },
  { id: '1360756205038997541', nome: 'Gerenciamento de Crise' }
];

const ADVERTENCIAS = [
  { id: '1360756204850118674', nome: 'Advertência Verbal' },
  { id: '1360756204850118673', nome: 'Advertência 1' },
  { id: '1360756204850118672', nome: 'Advertência 2' },
  { id: '1360756204850118671', nome: 'Advertência 3' }
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.GuildMember]
});

function parseTempo(tempoStr) {
  tempoStr = tempoStr.toLowerCase().replace(/\*/g, '').replace(/ e /g, ' ').trim();
  const h = tempoStr.match(/(\d+)\s*hr/);
  const m = tempoStr.match(/(\d+)\s*min/);
  const s = tempoStr.match(/(\d+)\s*seg/);
  return dayjs.duration({
    hours: h ? parseInt(h[1], 10) : 0,
    minutes: m ? parseInt(m[1], 10) : 0,
    seconds: s ? parseInt(s[1], 10) : 0
  });
}

async function fetchMessagesBetween(channel, after, before) {
  let all = [], lastId = null, done = false;
  while (!done) {
    const opts = { limit: 100 };
    if (lastId) opts.before = lastId;
    const msgs = await channel.messages.fetch(opts);
    if (msgs.size === 0) break;
    for (const msg of msgs.values()) {
      const ts = msg.createdTimestamp;
      if (ts >= after && ts <= before) all.push(msg);
      lastId = msg.id;
    }
    if (msgs.last()?.createdTimestamp < after) done = true;
  }
  return all;
}

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  const oldRoles = new Set(oldMember.roles.cache.keys());
  const newRoles = new Set(newMember.roles.cache.keys());

  for (const { id: patenteId } of PATENTES) {
    if (!oldRoles.has(patenteId) && newRoles.has(patenteId)) {
      const upsData = fs.existsSync(UPS_FILE) ? JSON.parse(fs.readFileSync(UPS_FILE)) : {};
      upsData[newMember.id] = Date.now();
      fs.writeFileSync(UPS_FILE, JSON.stringify(upsData, null, 2));
      break;
    }
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!perfil')) return;
  if (message.channel.id !== '1384099296952979568') return message.reply('❌ Este comando só pode ser usado no canal autorizado <#1384099296952979568>.');

  let idmap = {};
  try {
    idmap = JSON.parse(fs.readFileSync(IDMAP_FILE));
  } catch {
    return message.reply('❌ Falha ao carregar o arquivo de IDMAP.');
  }

  const idRP = idmap[message.author.id];
  if (!idRP) return message.reply('❌ Você ainda não vinculou seu ID com o comando `!setid`.');

  let member;
  try {
    member = await message.guild.members.fetch(message.author.id);
  } catch {
    return message.reply('❌ Não foi possível obter os dados do membro.');
  }

  const apelido = member.displayName || '';
  const partes = apelido.split('|');
  const distintivo = partes[0]?.trim() || 'Desconhecido';
  const codinome = partes[1]?.split('-')[0]?.trim() || 'Desconhecido';

  const patenteAtual = PATENTES.find(p => member.roles.cache.has(p.id));
  const patente = patenteAtual?.nome || 'Nenhuma';
  const unidades = UNIDADES.filter(u => member.roles.cache.has(u.id)).map(u => u.nome);
  const cursos = CURSOS.filter(c => member.roles.cache.has(c.id)).map(c => c.nome);
  const advertencias = ADVERTENCIAS.filter(a => member.roles.cache.has(a.id)).map(a => a.nome);
  const laudoVacina = member.roles.cache.has('1118537019010846800') ? 'SIM' : 'NÃO';

  const dataEntrada = dayjs(member.joinedAt).format('DD/MM/YYYY');

  let dataPromocao = 'Não encontrada';
  if (fs.existsSync(UPS_FILE)) {
    try {
      const upsData = JSON.parse(fs.readFileSync(UPS_FILE));
      if (upsData[member.id]) {
        dataPromocao = dayjs(upsData[member.id]).format('DD/MM/YYYY');
      }
    } catch {}
  }

  const canal = await client.channels.fetch(ID_CANAL_BATE_PONTO).catch(() => null);
  if (!canal) return message.reply('❌ Canal de bate-ponto não encontrado.');

  const fim = dayjs().endOf('day');
  const inicio = dayjs().subtract(7, 'day').startOf('day');
  const mensagens = await fetchMessagesBetween(canal, inicio.valueOf(), fim.valueOf());

  let duracaoTotal = dayjs.duration();

  for (const msg of mensagens) {
    if (!msg.embeds.length) continue;
    const embed = msg.embeds[0];
    const texto = embed.description || embed.fields.map(f => `${f.name}: ${f.value}`).join('\n');

    const idMatch = texto.match(/\[ID:\s*(\d+)\]/);
    const tempoMatch = texto.match(/Tempo total em serviço:\s*([\d\w\s\*]+)/i);

    if (!idMatch || !tempoMatch) continue;
    if (idMatch[1] !== idRP) continue;

    const tempo = parseTempo(tempoMatch[1]);
    duracaoTotal = duracaoTotal.add(tempo);
  }

  const horas = Math.floor(duracaoTotal.asHours());
  const minutos = Math.floor(duracaoTotal.asMinutes()) % 60;
  const intervaloTexto = `${inicio.format('DD/MM/YYYY')} até ${fim.format('DD/MM/YYYY')}`;

  const embed = new EmbedBuilder()
    .setTitle(`Perfil de ${codinome}`)
    .setColor('Yellow')
    .addFields(
      { name: 'CODINOME:', value: codinome, inline: true },
      { name: 'DISTINTIVO:', value: distintivo, inline: true },
      { name: 'Patente Atual:', value: patente, inline: false },
      { name: 'Unidade(s):', value: unidades.length ? unidades.join(', ') : 'Nenhuma', inline: false },
      { name: 'Cursos:', value: cursos.length ? cursos.join(', ') : 'Nenhum', inline: false },
      { name: 'Advertências:', value: advertencias.length ? advertencias.join(', ') : 'Nenhuma', inline: false },
      { name: 'Laudo e Vacinas:', value: laudoVacina, inline: true },
      { name: 'Data de Entrada:', value: dataEntrada, inline: true },
      { name: 'Última Promoção:', value: dataPromocao, inline: true },
      { name: `Horas em Serviço (últimos 7 dias - ${intervaloTexto}):`, value: `${horas} horas ${minutos} minutos`, inline: false }
    )
    .setTimestamp();

  message.reply({ embeds: [embed] });
});

client.login(TOKEN);
