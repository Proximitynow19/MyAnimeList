import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Fetch a user's list from MyAnimeList.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Which list of the user to fetch.")
        .setRequired(true)
        .addChoice("Anime", "anime")
        .addChoice("Manga", "manga")
    )
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The MyAnimeList username of the target.")
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("The Discord user of the target.")
    ),
  async execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const username = interaction.options.getString("username");

    const user = interaction.options.getUser("user");

    if (!user) {
      if (!username)
        return interaction.editReply("Log in through MyAnimeList to continue.");
    } else {
      return interaction.editReply(
        `${user.tag} has not yet linked their account.`
      );
    }

    const list = interaction.options.getString("type", true);

    const res = await axios.get(
      `https://api.myanimelist.net/v2/users/${username}/${list}list?limit=1000`,
      {
        headers: { "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID as string },
      }
    );

    let slice = 0;
    let message = `${username}'s ${list}list (${res.data.data.length}):\n`;
    let replySent = false;

    while (slice < res.data.data.length) {
      message += `${res.data.data[slice].node.title}, `;

      if (
        (
          message +
          (slice >= res.data.data.length - 1
            ? ""
            : res.data.data[slice + 1].node.title)
        ).length > 2000 ||
        slice === res.data.data.length - 1
      ) {
        if (!replySent) {
          replySent = true;

          await interaction.editReply(message.slice(0, message.length - 2));
        } else {
          await interaction.followUp({
            content: message.slice(0, message.length - 2),
            ephemeral: true,
          });
        }

        message = "";
      }

      slice++;
    }
  },
};
