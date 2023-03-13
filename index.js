const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

const dotenv = require('dotenv');
dotenv.config();
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env

const { log } = require('node:console');
// Importar comandos

const fs = require("node:fs");
const { get } = require('node:http');
const path = require("node:path");

const commandsPath = path.join(__dirname, 'commands');
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`O comando ${filePath} está com data ou execute inválido.`);
    }
}

client.once(Events.ClientReady, c => {
	console.log(`Pronto! Login realizado como: ${c.user.tag}`);
});

client.login(TOKEN);

// Listener
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction-commandName)
    if (!command) {
        console.log(`Comando não encontrado`);
        return;
    }
    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Ocorreu um erro ao executar o comando.', ephemeral: true });
    }
});