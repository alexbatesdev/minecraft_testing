const { Rcon } = require('rcon-client');

async function getRCONconnection() {
  const rcon = new Rcon({
      host: process.env.RCON_HOST,
      port: process.env.RCON_PORT,
      password: process.env.RCON_PASSWORD
  });

  await rcon.connect();
  console.log('Connected to Minecraft server via RCON');
  return rcon;
}

module.exports = {
  getRCONconnection
};