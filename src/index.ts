import { config } from "dotenv";
import fs from "node:fs";
import { join } from "node:path";
import { MAL_Client } from "./Classes";

config();

const client = new MAL_Client({ intents: [] });

const commandFiles = fs
  .readdirSync(join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log("Client Online.");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({
        content: "There was an error while executing this command!",
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
