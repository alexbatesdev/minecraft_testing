const { SlashCommandBuilder } = require('discord.js');
const { getRCONconnection } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Say something in the Minecraft chat!')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Your message to send to the Minecraft chat.')
        .setRequired(true)),
  async execute(interaction) {
    const message = interaction.options.getString('username');

    if (!message) {
      await interaction.reply('You can\'t say nothing!');
      return;
    }

    const rcon = await getRCONconnection();
    await rcon.send(`say ${message}`);

    await interaction.reply(`You said ${message} in the Minecraft chat!`);
  },
};