const { SlashCommandBuilder } = require('discord.js');
const { getRCONconnection } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whosupdog')
    .setDescription('Check who is online in the Minecraft server!'),
  async execute(interaction) {
    const rcon = await getRCONconnection();
    let response = await rcon.send(`list`);

    await interaction.reply(response);
  },
};