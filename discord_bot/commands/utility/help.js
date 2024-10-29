const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Replies with some command information.'),
  async execute(interaction) {
    await interaction.reply('I am MineCatt!\n To add yourself to the servers whitelist use the whitelist command!\nTo see the who\'s online use the whosupdog command!\nTo say something in chat use the say command!');
  },
};