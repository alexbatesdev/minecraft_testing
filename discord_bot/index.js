require('dotenv').config();
console.log("--------------------")
console.log(process.env);
console.log("--------------------")


const { Rcon } = require('rcon-client');

const CHANNEL_ID = '738985655866228797';
const RCON_HOST = 'localhost'; // Or your server IP
const RCON_PORT = 25576;       // Port specified in server.properties
const RCON_PASSWORD = 'splorbo';



// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const token = process.env.TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection()


const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);


for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`[INFO] Loaded command ${command.data.name} from ${filePath}`);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Connect to RCON
async function connectRcon() {
  const rcon = new Rcon({
      host: RCON_HOST,
      port: RCON_PORT,
      password: RCON_PASSWORD
  });

  await rcon.connect();
  console.log('Connected to Minecraft server via RCON');

  const channel = await client.channels.fetch(CHANNEL_ID);
  channel.send('Connected to Minecraft server via RCON');
}

// Log in to Discord with your client's token
client.login(token).then(connectRcon);

client.on(Events.InteractionCreate, interaction => {
  if (!interaction.isChatInputCommand()) return;
  console.log(interaction);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;


  const command = interaction.client.commands.get(interaction.commandName);


  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }


  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});