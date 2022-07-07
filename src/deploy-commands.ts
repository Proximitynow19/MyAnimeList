import { config } from "dotenv";

config();

import fs from "node:fs";
import { join } from "node:path";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { clientId, guildId } from "../config.json";

const commands = [];
const commandFiles = fs
  .readdirSync(join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(
  process.env.DISCORD_TOKEN as string
);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
