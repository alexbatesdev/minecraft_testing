const { SlashCommandBuilder } = require('discord.js');
const { getRCONconnection } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Add yourself to the whitelist!')
    .addStringOption(option =>
      option.setName('username')
        .setDescription('Your Minecraft username (later updates will require your UUID, but for now, just your username).')
        .setRequired(true)),
  async execute(interaction) {
    const username = interaction.options.getString('username');

    if (!username) {
      await interaction.reply('Please provide a valid Minecraft username!');
      return;
    }

    const rcon = await getRCONconnection();
    await rcon.send(`whitelist add ${username}`);

    await interaction.reply('Adding you to the whitelist!');
  },
};