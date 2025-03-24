const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

let config;
try {
  const configData = fs.readFileSync('./config.json', 'utf8');
  config = JSON.parse(configData);
  
  if (!config.token || !config.guildID) {
    console.error('Error: Missing token or guildID in config.json');
    process.exit(1);
  }
} catch (error) {
  console.error('Error reading config file:', error.message);
  process.exit(1);
}

const whitelistedEmojis = config.whitelistedEmojis || [
  'example_1',
  'example_2'
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildEmojisAndStickers
  ]
});

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  try {
    const guild = await client.guilds.fetch(config.guildID);
    
    if (!guild) {
      console.error('Specified server not found!');
      return client.destroy();
    }
    
    console.log(`Deleting emojis from server "${guild.name}"...`);
    
    const emojis = await guild.emojis.fetch();
    console.log(`Found a total of ${emojis.size} emojis.`);
    
    let deletedEmojis = 0;
    let failedEmojis = 0;
    let protectedEmojis = 0;
    
    for (const [id, emoji] of emojis) {
      if (whitelistedEmojis.includes(emoji.name)) {
        console.log(`${emoji.name} - Protected by whitelist, not deleted.`);
        protectedEmojis++;
        continue;
      }
      
      try {
        await emoji.delete(`Emoji deletion process`);
        console.log(`${emoji.name} - Successfully deleted.`);
        deletedEmojis++;
        
        await new Promise(resolve => setTimeout(resolve, 900));
      } catch (error) {
        console.error(`Error deleting emoji "${emoji.name}":`, error.message);
        failedEmojis++;
      }
    }
    
    console.log(`Process completed! ${deletedEmojis} emojis deleted, ${protectedEmojis} emojis protected, ${failedEmojis} emojis failed to delete.`);
    client.destroy();
  } catch (error) {
    console.error('An error occurred:', error);
    client.destroy();
  }
});

client.login(config.token).catch(error => {
  console.error('Failed to login:', error);
});