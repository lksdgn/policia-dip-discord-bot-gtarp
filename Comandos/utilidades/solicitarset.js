const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'solicitarset',
    description: "Solicite seu set de cargos.",
    options: [],
    default_member_permissions: PermissionFlagsBits.Administrator, // Apenas administradores podem usar
    run: async (Client, inter) => {
        // Checagem extra para garantir que só admin use, mesmo se o Discord não filtrar
        if (!inter.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return inter.reply({ content: "Apenas administradores podem usar este comando.", ephemeral: true });
        }

        await inter.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Solicitar Set")
                    .setDescription("🟢 Use os botões abaixo para iniciar a solicitação do set desejado.")
                    .setImage("https://media.discordapp.net/attachments/1381872301288460338/1382908233290612838/SETAGEM.png?ex=684cdd28&is=684b8ba8&hm=e62af8cbd3ecc54a4a10e11a2aadeea23a1c8c9c48ee987f1065ce3d25c19baf&=&format=webp&quality=lossless")
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('abrir_set')
                        .setLabel('CURSOS MAP')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('setcore')
                        .setLabel('CURSOS CORE')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('setuni')
                        .setLabel('SET UNIDADES')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('setrec')
                        .setLabel('SET RECRUTAMENTO')
                        .setStyle(ButtonStyle.Primary)
                )
            ]
        });
    }
}