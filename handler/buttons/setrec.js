const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require("discord.js");
const cargosConfig = require('../../json/cargos.json');
const canalLogRecId = cargosConfig.canalLogRecId;
const cargoAprovadorRecId = cargosConfig.cargoAprovadorRecId;
const recCargos = [
    cargosConfig.rec1,
    cargosConfig.rec2,
    cargosConfig.rec3,
    cargosConfig.rec4,
    cargosConfig.rec5
];

// Função para deixar cada palavra com a primeira letra maiúscula
function capitalizeNome(nome) {
    return nome
        .toLowerCase()
        .split(' ')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(' ');
}

module.exports = async (interaction, Client) => {
    // Botão para abrir o formulário
    if (interaction.customId === 'setrec') {
        const modal = new ModalBuilder()
            .setCustomId('rec_formulario')
            .setTitle('Solicitar Set Rec')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('rec_nome')
                        .setLabel('CODINOME/QRA:')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('rec_id')
                        .setLabel('ID (do jogo):')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('rec_distintivo')
                        .setLabel('DISTINTIVO:')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('rec_autorizado')
                        .setLabel('AUTORIZADO:')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                )
            );
        await interaction.showModal(modal);
    }

    // Quando o formulário for enviado
    else if (interaction.isModalSubmit() && interaction.customId === 'rec_formulario') {
        const nome = interaction.fields.getTextInputValue('rec_nome');
        const idJogo = interaction.fields.getTextInputValue('rec_id');
        const distintivo = interaction.fields.getTextInputValue('rec_distintivo');
        const autorizado = interaction.fields.getTextInputValue('rec_autorizado');
        const discordId = interaction.user.id;

        const canalLog = Client.channels.cache.get(canalLogRecId);
        if (canalLog) {
            canalLog.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("SET REC RECEBIDO")
                        .setDescription(
                            `CODINOME/QRA: ${nome}\n` +
                            `ID JOGO: ${idJogo}\n` +
                            `DISTINTIVO: ${distintivo}\n` +
                            `AUTORIZADO: ${autorizado}\n` +
                            `DISCORD: <@${discordId}>`
                        )
                        .setColor("#00ff99")
                ],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`aprovar_rec_${discordId}`)
                            .setLabel('Aprovar')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId(`recusar_rec_${discordId}`)
                            .setLabel('Recusar')
                            .setStyle(ButtonStyle.Danger)
                    )
                ]
            });
        }

        await interaction.reply({ content: "Sua solicitação foi enviada para análise.", ephemeral: true });
    }

    // Aprovar set rec
    else if (interaction.customId.startsWith('aprovar_rec_')) {
        const aprovadorRoles = Array.isArray(cargoAprovadorRecId) ? cargoAprovadorRecId : [cargoAprovadorRecId];
        if (!aprovadorRoles.some(roleId => interaction.member.roles.cache.has(roleId))) {
            return interaction.reply({ content: "Você não tem permissão para aprovar sets Rec.", ephemeral: true });
        }

        const embed = interaction.message.embeds[0];
        const nome = embed.description.match(/CODINOME\/QRA: (.*)\n/)[1];
        const idJogo = embed.description.match(/ID JOGO: (.*)\n/)[1];
        const distintivo = embed.description.match(/DISTINTIVO: (.*)\n/)[1];
        const autorizado = embed.description.match(/AUTORIZADO: (.*)\n/)[1];
        const discordId = interaction.customId.replace('aprovar_rec_', '');

        const guildMember = await interaction.guild.members.fetch(discordId).catch(() => null);
        if (guildMember) {
            await guildMember.roles.add(recCargos).catch(() => null);

            try {
                await guildMember.setNickname(`${capitalizeNome(distintivo)} | ${capitalizeNome(nome)}`);
            } catch (e) { /* Sem permissão para mudar o apelido */ }

            try {
                await guildMember.send({
                    content: `# Parabéns, Seu Set foi aprovado!
Entre nos servidores:

**ONE AÇÕES:**
https://discord.gg/QeDTj6ZnFv

**ONE HOSPITAL:**
https://discord.gg/BFTMvz3JM5

@everyone`
                });
            } catch (e) { /* DM fechada */ }
        }

        await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`SET REC APROVADO`)
                    .setDescription(
                        `CODINOME/QRA: ${capitalizeNome(nome)}\n` +
                        `ID JOGO: ${idJogo}\n` +
                        `DISTINTIVO: ${capitalizeNome(distintivo)}\n` +
                        `AUTORIZADO: ${autorizado}\n` +
                        `DISCORD: <@${discordId}>\n` +
                        `APROVADO POR: <@${interaction.user.id}>`
                    )
                    .setColor("#00ff99")
            ],
            components: []
        });
    }

    // Recusar set rec
    else if (interaction.customId.startsWith('recusar_rec_')) {
        const discordId = interaction.customId.replace('recusar_rec_', '');
        const modal = new ModalBuilder()
            .setCustomId(`rec_motivo_${discordId}`)
            .setTitle('Motivo da Recusa')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('motivo')
                        .setLabel('Motivo da recusa')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                )
            );
        await interaction.showModal(modal);
    }

    // Modal de motivo de recusa
    else if (interaction.isModalSubmit() && interaction.customId.startsWith('rec_motivo_')) {
        const discordId = interaction.customId.replace('rec_motivo_', '');
        const motivo = interaction.fields.getTextInputValue('motivo');

        const embed = interaction.message.embeds[0];
        const nome = embed.description.match(/CODINOME\/QRA: (.*)\n/)[1];
        const idJogo = embed.description.match(/ID JOGO: (.*)\n/)[1];
        const distintivo = embed.description.match(/DISTINTIVO: (.*)\n/)[1];
        const autorizado = embed.description.match(/AUTORIZADO: (.*)\n/)[1];

        const guildMember = await interaction.guild.members.fetch(discordId).catch(() => null);
        if (guildMember) {
            try {
                await guildMember.send({
                    content: `Seu Set Rec foi recusado.\nMotivo: ${motivo}\n\nTente novamente, só que do jeito certo!`
                });
            } catch (e) { /* DM fechada */ }
        }

        await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`SET REC RECUSADO`)
                    .setDescription(
                        `CODINOME/QRA: ${capitalizeNome(nome)}\n` +
                        `ID JOGO: ${idJogo}\n` +
                        `DISTINTIVO: ${capitalizeNome(distintivo)}\n` +
                        `AUTORIZADO: ${autorizado}\n` +
                        `DISCORD: <@${discordId}>\n` +
                        `RECUSADO POR: <@${interaction.user.id}>\n` +
                        `MOTIVO: ${motivo}`
                    )
                    .setColor("#ff0000")
            ],
            components: []
        });
    }
};
