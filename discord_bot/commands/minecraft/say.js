const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};